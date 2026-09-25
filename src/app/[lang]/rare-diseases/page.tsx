import type { Metadata } from 'next';
import RareDiseases from '@/components/pages/RareDiseases';
import { getDictionary } from '@/get-dictionary';
import type { Locale } from '@/i18n-config';

type Props = { params: Promise<{ lang: Locale }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang);
  return { title: dictionary.nav.rareDiseases };
}

export default async function Page(props: Props) {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang);
  return <RareDiseases dictionary={dictionary.rare} common={dictionary.common} lang={lang} />;
}
