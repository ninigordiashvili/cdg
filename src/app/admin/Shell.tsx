import Link from 'next/link';
import { logoutAction } from './actions';
import type { User } from '@/server/users';

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/content', label: 'Page texts' },
  { href: '/admin/events', label: 'Events' },
];

export default function Shell({
  user,
  current,
  children,
}: {
  user: User;
  current: string;
  children: React.ReactNode;
}) {
  const all = user.role === 'admin' ? [...links, { href: '/admin/users', label: 'Staff' }] : links;
  return (
    <div className="shell">
      <header className="topbar">
        <nav aria-label="Admin">
          {all.map((l) => (
            <Link key={l.href} href={l.href} aria-current={l.href === current ? 'page' : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>
        <span className="who">
          {user.name} ({user.role})
        </span>
        <a href="/ge" target="_blank" rel="noopener noreferrer" className="btn secondary">
          View site
        </a>
        <form action={logoutAction}>
          <button className="btn secondary" type="submit">
            Sign out
          </button>
        </form>
      </header>
      <main>{children}</main>
    </div>
  );
}
