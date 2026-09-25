import type { Metadata } from 'next';
import Contact from '@/components/pages/Contact';
import { getDictionary } from '@/get-dictionary';
import type { Locale } from '@/i18n-config';

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang);
  return { title: dictionary.nav.contact };
}

export default async function Page(props: Props) {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang);
  return <Contact dictionary={dictionary.contact} common={dictionary.common} lang={lang} />;
}
