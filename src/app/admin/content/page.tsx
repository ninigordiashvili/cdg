import Link from 'next/link';
import { getDefaultDictionary } from '@/get-dictionary';
import { requireUser } from '@/server/session';
import Shell from '../Shell';
import { SECTION_TITLES } from './sections';

export default async function ContentIndex() {
  const user = await requireUser();
  const dictionary = await getDefaultDictionary('ge');
  const sections = Object.keys(dictionary).filter((k) => k in SECTION_TITLES);

  return (
    <Shell user={user} current="/admin/content">
      <h1>Page texts</h1>
      <p className="lead">Pick a part of the website to edit.</p>
      <div className="grid">
        {sections.map((key) => (
          <Link key={key} className="card tile" href={`/admin/content/${key}`}>
            <strong>{SECTION_TITLES[key].title}</strong>
            <span>{SECTION_TITLES[key].hint}</span>
          </Link>
        ))}
      </div>
    </Shell>
  );
}
