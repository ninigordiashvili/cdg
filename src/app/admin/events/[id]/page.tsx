import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEvent, type EventRow } from '@/server/events';
import { requireUser } from '@/server/session';
import { deleteEventAction, saveEventAction } from '../../actions';
import Shell from '../../Shell';

const errors: Record<string, string> = {
  date: 'Please choose a valid date.',
  title: 'The Georgian title is required.',
};

export default async function EventForm(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await requireUser();
  const { id } = await props.params;
  const { error } = await props.searchParams;

  let event: EventRow | undefined;
  if (id !== 'new') {
    event = Number(id) ? await getEvent(Number(id)) : undefined;
    if (!event) notFound();
  }

  return (
    <Shell user={user} current="/admin/events">
      <p>
        <Link href="/admin/events">← All events</Link>
      </p>
      <h1>{event ? 'Edit event' : 'New event'}</h1>
      {error && errors[error] && (
        <p className="notice error" role="alert">
          {errors[error]}
        </p>
      )}
      <form action={saveEventAction} className="card">
        {event && <input type="hidden" name="id" value={event.id} />}
        <div className="two">
          <div className="field">
            <label htmlFor="date">Date</label>
            <input id="date" name="date" type="date" defaultValue={event?.date} required />
          </div>
          <div className="field">
            <label htmlFor="location">
              Location <span className="hint">(optional)</span>
            </label>
            <input id="location" name="location" type="text" defaultValue={event?.location} />
          </div>
        </div>
        <div className="two">
          <div className="field">
            <label htmlFor="titleGe">Title — ქართული</label>
            <input
              id="titleGe"
              name="titleGe"
              type="text"
              lang="ka"
              defaultValue={event?.titleGe}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="titleEn">
              Title — English <span className="hint">(falls back to Georgian)</span>
            </label>
            <input id="titleEn" name="titleEn" type="text" defaultValue={event?.titleEn} />
          </div>
        </div>
        <div className="two">
          <div className="field">
            <label htmlFor="textGe">Description — ქართული</label>
            <textarea id="textGe" name="textGe" lang="ka" rows={7} defaultValue={event?.textGe} />
          </div>
          <div className="field">
            <label htmlFor="textEn">Description — English</label>
            <textarea id="textEn" name="textEn" rows={7} defaultValue={event?.textEn} />
          </div>
        </div>
        <div className="field">
          <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="checkbox"
              name="published"
              defaultChecked={event ? event.published : true}
            />
            Published (uncheck to keep it as a draft)
          </label>
        </div>
        <div className="actions">
          <button className="btn" type="submit">
            Save event
          </button>
        </div>
      </form>

      {event && (
        <details style={{ marginTop: 24 }}>
          <summary>Delete this event…</summary>
          <form action={deleteEventAction} style={{ marginTop: 12 }}>
            <input type="hidden" name="id" value={event.id} />
            <p>This cannot be undone.</p>
            <button className="btn danger solid" type="submit">
              Yes, delete event
            </button>
          </form>
        </details>
      )}
    </Shell>
  );
}
