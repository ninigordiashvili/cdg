import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { findUserById, type User } from './users';

const COOKIE = 'cdg_session';
const MAX_AGE_SECONDS = 60 * 60 * 12;

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET must be set in production.');
  }
  return 'development-only-secret';
}

const sign = (payload: string) =>
  createHmac('sha256', secret()).update(payload).digest('base64url');

function makeToken(userId: number): string {
  const payload = Buffer.from(
    JSON.stringify({ uid: userId, exp: Date.now() + MAX_AGE_SECONDS * 1000 })
  ).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function readToken(token: string): number | undefined {
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return;
  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return;
  try {
    const { uid, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return typeof uid === 'number' && typeof exp === 'number' && exp > Date.now() ? uid : undefined;
  } catch {
    return;
  }
}

export async function startSession(userId: number) {
  (await cookies()).set(COOKIE, makeToken(userId), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

/** The signed-in user, re-read from the database so deleted users lose access at once. */
export async function currentUser(): Promise<User | undefined> {
  const token = (await cookies()).get(COOKIE)?.value;
  const uid = token && readToken(token);
  return uid ? findUserById(uid) : undefined;
}

export async function requireUser(): Promise<User> {
  const user = await currentUser();
  if (!user) redirect('/admin/login');
  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await requireUser();
  if (user.role !== 'admin') redirect('/admin');
  return user;
}
