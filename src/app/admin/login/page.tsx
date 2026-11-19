import { redirect } from 'next/navigation';
import { currentUser } from '@/server/session';
import { loginAction } from '../actions';

const messages: Record<string, string> = {
  invalid: 'Wrong email or password.',
  locked: 'Too many attempts. Please wait 15 minutes and try again.',
};

export default async function LoginPage(props: { searchParams: Promise<{ error?: string }> }) {
  if (await currentUser()) redirect('/admin');
  const { error } = await props.searchParams;

  return (
    <main className="shell" style={{ maxWidth: 440, paddingTop: 64 }}>
      <h1>Staff sign in</h1>
      <p className="lead">Foundation for CDG Syndrome and Autism — website editor.</p>
      {error && messages[error] && (
        <p className="notice error" role="alert">
          {messages[error]}
        </p>
      )}
      <form action={loginAction} className="card">
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="username" required />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        <button className="btn" type="submit">
          Sign in
        </button>
      </form>
    </main>
  );
}
