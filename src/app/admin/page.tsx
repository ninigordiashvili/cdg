import Link from 'next/link';
import { listEvents } from '@/server/events';
import { requireUser } from '@/server/session';
import Shell from './Shell';

export default async function Dashboard() {
  const user = await requireUser();
  const events = await listEvents();
  return (
    <Shell user={user} current="/admin">
      <h1>Hello, {user.name}</h1>
      <p className="lead">
        Edit the texts shown on the website or add events. Changes appear on the public site as soon
        as you save.
      </p>
      <div className="grid">
        <Link className="card tile" href="/admin/content">
          <strong>Page texts</strong>
          <span>Edit any text, in Georgian and English.</span>
        </Link>
        <Link className="card tile" href="/admin/events">
          <strong>Events ({events.length})</strong>
          <span>Add, edit or remove events.</span>
        </Link>
        {user.role === 'admin' && (
          <Link className="card tile" href="/admin/users">
            <strong>Staff</strong>
            <span>Give colleagues access.</span>
          </Link>
        )}
      </div>
    </Shell>
  );
}
