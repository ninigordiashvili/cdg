import Link from 'next/link';
import { listEvents } from '@/server/events';
import { requireUser } from '@/server/session';
import Shell from '../Shell';

export default async function EventsAdmin(props: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  const user = await requireUser();
  const { saved, deleted } = await props.searchParams;
  const events = await listEvents();

  return (
    <Shell user={user} current="/admin/events">
      <h1>Events</h1>
      <p className="lead">Events appear on the Events page, newest first.</p>
      {saved && (
        <p className="notice ok" role="status">
          Event saved.
        </p>
      )}
      {deleted && (
        <p className="notice ok" role="status">
          Event deleted.
        </p>
      )}
      <p>
        <Link className="btn" href="/admin/events/new">
          Add event
        </Link>
      </p>
      <div className="card" style={{ marginTop: 20 }}>
        {events.length === 0 ? (
          <p>No events yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Title</th>
                <th scope="col">Status</th>
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id}>
                  <td>{e.date}</td>
                  <td lang="ka">{e.titleGe}</td>
                  <td>{e.published ? 'Published' : <span className="badge off">Draft</span>}</td>
                  <td>
                    <Link href={`/admin/events/${e.id}`}>Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Shell>
  );
}
