import { listUsers, MIN_PASSWORD_LENGTH } from '@/server/users';
import { requireAdmin } from '@/server/session';
import { createUserAction, deleteUserAction } from '../actions';
import Shell from '../Shell';

const notices: Record<string, [string, 'ok' | 'error']> = {
  created: ['Account created.', 'ok'],
  deleted: ['Account removed.', 'ok'],
  invalid: ['Enter a valid email and a name.', 'error'],
  password: [`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`, 'error'],
  exists: ['An account with that email already exists.', 'error'],
  self: ['You cannot remove your own account.', 'error'],
  lastAdmin: ['You cannot remove the last administrator.', 'error'],
};

export default async function UsersPage(props: { searchParams: Promise<Record<string, string>> }) {
  const me = await requireAdmin();
  const params = await props.searchParams;
  const notice = Object.keys(params)
    .map((k) => notices[k] ?? notices[params[k]])
    .find(Boolean);
  const users = await listUsers();

  return (
    <Shell user={me} current="/admin/users">
      <h1>Staff</h1>
      <p className="lead">
        Editors can change texts and events. Administrators can also manage accounts.
      </p>
      {notice && (
        <p className={`notice ${notice[1]}`} role={notice[1] === 'error' ? 'alert' : 'status'}>
          {notice[0]}
        </p>
      )}
      <div className="card">
        <table>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  {u.id !== me.id && (
                    <form action={deleteUserAction}>
                      <input type="hidden" name="id" value={u.id} />
                      <button className="btn danger" type="submit" aria-label={`Remove ${u.name}`}>
                        Remove
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Add a colleague</h2>
      <form action={createUserAction} className="card">
        <div className="two">
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" required />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>
        </div>
        <div className="two">
          <div className="field">
            <label htmlFor="password">
              Temporary password{' '}
              <span className="hint">(min. {MIN_PASSWORD_LENGTH} characters)</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" defaultValue="editor">
              <option value="editor">Editor</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
        </div>
        <button className="btn" type="submit">
          Create account
        </button>
      </form>
    </Shell>
  );
}
