import { db } from './db.ts';
import { hashPassword } from './password.ts';

export type Role = 'admin' | 'editor';
export type User = { id: number; email: string; name: string; role: Role };

export const MIN_PASSWORD_LENGTH = 10;

const toUser = (r: Record<string, unknown>): User => ({
  id: Number(r.id),
  email: String(r.email),
  name: String(r.name),
  role: r.role === 'admin' ? 'admin' : 'editor',
});

export async function findUserByEmail(email: string) {
  const c = await db();
  const res = await c.execute({
    sql: 'SELECT * FROM users WHERE email = ?',
    args: [email.trim().toLowerCase()],
  });
  const row = res.rows[0];
  return row ? { ...toUser(row), passwordHash: String(row.password_hash) } : undefined;
}

export async function findUserById(id: number): Promise<User | undefined> {
  const c = await db();
  const res = await c.execute({ sql: 'SELECT * FROM users WHERE id = ?', args: [id] });
  return res.rows[0] ? toUser(res.rows[0]) : undefined;
}

export async function listUsers(): Promise<User[]> {
  const c = await db();
  const res = await c.execute('SELECT * FROM users ORDER BY created_at');
  return res.rows.map(toUser);
}

export async function createUser(input: {
  email: string;
  name: string;
  password: string;
  role: Role;
}) {
  if (input.password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }
  const c = await db();
  await c.execute({
    sql: 'INSERT INTO users (email, name, password_hash, role) VALUES (?, ?, ?, ?)',
    args: [
      input.email.trim().toLowerCase(),
      input.name.trim(),
      await hashPassword(input.password),
      input.role,
    ],
  });
}

export async function deleteUser(id: number) {
  const c = await db();
  await c.execute({ sql: 'DELETE FROM users WHERE id = ?', args: [id] });
}

export async function countAdmins(): Promise<number> {
  const c = await db();
  const res = await c.execute("SELECT COUNT(*) AS n FROM users WHERE role = 'admin'");
  return Number(res.rows[0].n);
}
