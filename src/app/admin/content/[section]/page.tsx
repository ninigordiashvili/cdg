import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDefaultDictionary } from '@/get-dictionary';
import { flatten, getOverrides } from '@/server/content';
import { requireUser } from '@/server/session';
import { saveContentAction } from '../../actions';
import Shell from '../../Shell';
import { SECTION_TITLES } from '../sections';

const LANGS = [
  { code: 'ge', label: 'ქართული (Georgian)' },
  { code: 'en', label: 'English' },
] as const;

export default async function SectionPage(props: {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const user = await requireUser();
  const { section } = await props.params;
  const { saved } = await props.searchParams;
  if (!(section in SECTION_TITLES)) notFound();

  const [defGe, defEn, ovGe, ovEn] = await Promise.all([
    getDefaultDictionary('ge').then((d) => flatten(d)),
    getDefaultDictionary('en').then((d) => flatten(d)),
    getOverrides('ge'),
    getOverrides('en'),
  ]);
  const defaults = { ge: defGe, en: defEn };
  const overrides = { ge: ovGe, en: ovEn };
  const keys = Object.keys(defGe).filter((k) => k === section || k.startsWith(`${section}.`));

  return (
    <Shell user={user} current="/admin/content">
      <p>
        <Link href="/admin/content">← All sections</Link>
      </p>
      <h1>{SECTION_TITLES[section].title}</h1>
      <p className="lead">
        Change the text and press Save. Tick “Restore original” to go back to the built-in text.
      </p>
      {saved && (
        <p className="notice ok" role="status">
          Saved. The website is updated.
        </p>
      )}
      <form action={saveContentAction}>
        <input type="hidden" name="section" value={section} />
        {keys.map((key) => (
          <div className="row" key={key}>
            <div className="path">{key.slice(section.length + 1) || key}</div>
            {LANGS.map(({ code, label }) => {
              const edited = key in overrides[code];
              const value = edited ? overrides[code][key] : (defaults[code][key] ?? '');
              const id = `${code}-${key}`;
              const long = value.length > 70 || value.includes('\n');
              return (
                <div className="field" key={code}>
                  <label htmlFor={id}>
                    {label}
                    {edited && <span className="badge">edited</span>}
                  </label>
                  {long ? (
                    <textarea
                      id={id}
                      name={`${code}:${key}`}
                      defaultValue={value}
                      rows={Math.min(10, Math.ceil(value.length / 60) + 1)}
                      lang={code === 'ge' ? 'ka' : 'en'}
                    />
                  ) : (
                    <input
                      id={id}
                      type="text"
                      name={`${code}:${key}`}
                      defaultValue={value}
                      lang={code === 'ge' ? 'ka' : 'en'}
                    />
                  )}
                  {edited && (
                    <label className="reset">
                      <input type="checkbox" name={`reset:${code}:${key}`} />
                      Restore original
                    </label>
                  )}
                </div>
              );
            })}
          </div>
        ))}
        <div className="sticky">
          <button className="btn" type="submit">
            Save changes
          </button>
        </div>
      </form>
    </Shell>
  );
}
