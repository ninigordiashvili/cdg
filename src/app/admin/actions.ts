'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getDefaultDictionary } from '@/get-dictionary';
import { i18n } from '@/i18n-config';
import { flatten, saveOverrides } from '@/server/content';
import { deleteEvent, saveEvent } from '@/server/events';
import { verifyPassword } from '@/server/password';
import { endSession, requireAdmin, requireUser, startSession } from '@/server/session';
import {
  countAdmins,
  createUser,
  deleteUser,
  findUserByEmail,
  findUserById,
  MIN_PASSWORD_LENGTH,
  type Role,
} from '@/server/users';

const MAX_TEXT = 5000;
const str = (f: FormData, name: string) => String(f.get(name) ?? '').replace(/\r\n/g, '\n');

// Sections of the site may change, so refresh every public page.
const refreshSite = () => revalidatePath('/', 'layout');

// ---- sign in / out -------------------------------------------------------

const attempts = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function tooManyAttempts(key: string): boolean {
  const now = Date.now();
  const a = attempts.get(key);
  if (!a || now - a.first > WINDOW_MS) {
    attempts.set(key, { count: 1, first: now });
    return false;
  }
  a.count += 1;
  return a.count > MAX_ATTEMPTS;
}

export async function loginAction(formData: FormData) {
  const email = str(formData, 'email').trim().toLowerCase();
  const password = str(formData, 'password');
  if (tooManyAttempts(email)) redirect('/admin/login?error=locked');

  const user = await findUserByEmail(email);
  // Verify against a dummy hash when the user is unknown, to keep timing similar.
  const ok = user
    ? await verifyPassword(password, user.passwordHash)
    : await verifyPassword(password, '00:00').then(() => false);
  if (!user || !ok) redirect('/admin/login?error=invalid');

  attempts.delete(email);
  await startSession(user.id);
  redirect('/admin');
}

export async function logoutAction() {
  await endSession();
  redirect('/admin/login');
}

// ---- page texts ----------------------------------------------------------

export async function saveContentAction(formData: FormData) {
  const user = await requireUser();
  const section = str(formData, 'section');

  for (const lang of i18n.locales) {
    const defaults = flatten(await getDefaultDictionary(lang));
    const changes: { key: string; value: string | null }[] = [];
    for (const [key, original] of Object.entries(defaults)) {
      if (key !== section && !key.startsWith(`${section}.`)) continue;
      const submitted = formData.get(`${lang}:${key}`);
      if (submitted === null) continue;
      const value = String(submitted).replace(/\r\n/g, '\n').slice(0, MAX_TEXT);
      const reset = formData.get(`reset:${lang}:${key}`) !== null;
      changes.push({ key, value: reset || value === original ? null : value });
    }
    await saveOverrides(lang, changes, user.email);
  }
  refreshSite();
  redirect(`/admin/content/${encodeURIComponent(section)}?saved=1`);
}

// ---- events --------------------------------------------------------------

export async function saveEventAction(formData: FormData) {
  await requireUser();
  const id = Number(formData.get('id')) || undefined;
  const date = str(formData, 'date');
  const titleGe = str(formData, 'titleGe').trim();
  const back = `/admin/events/${id ?? 'new'}`;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) {
    redirect(`${back}?error=date`);
  }
  if (!titleGe) redirect(`${back}?error=title`);

  await saveEvent(id, {
    date,
    location: str(formData, 'location').trim().slice(0, 200),
    titleGe: titleGe.slice(0, 200),
    titleEn: str(formData, 'titleEn').trim().slice(0, 200),
    textGe: str(formData, 'textGe').trim().slice(0, MAX_TEXT),
    textEn: str(formData, 'textEn').trim().slice(0, MAX_TEXT),
    published: formData.get('published') !== null,
  });
  refreshSite();
  redirect('/admin/events?saved=1');
}

export async function deleteEventAction(formData: FormData) {
  await requireUser();
  const id = Number(formData.get('id'));
  if (id) await deleteEvent(id);
  refreshSite();
  redirect('/admin/events?deleted=1');
}

// ---- staff ---------------------------------------------------------------

export async function createUserAction(formData: FormData) {
  await requireAdmin();
  const email = str(formData, 'email').trim().toLowerCase();
  const name = str(formData, 'name').trim();
  const password = str(formData, 'password');
  const role: Role = formData.get('role') === 'admin' ? 'admin' : 'editor';

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !name) redirect('/admin/users?error=invalid');
  if (password.length < MIN_PASSWORD_LENGTH) redirect('/admin/users?error=password');
  if (await findUserByEmail(email)) redirect('/admin/users?error=exists');

  await createUser({ email, name, password, role });
  redirect('/admin/users?created=1');
}

export async function deleteUserAction(formData: FormData) {
  const me = await requireAdmin();
  const id = Number(formData.get('id'));
  if (!id || id === me.id) redirect('/admin/users?error=self');
  const target = await findUserById(id);
  if (target?.role === 'admin' && (await countAdmins()) <= 1) {
    redirect('/admin/users?error=lastAdmin');
  }
  await deleteUser(id);
  redirect('/admin/users?deleted=1');
}
