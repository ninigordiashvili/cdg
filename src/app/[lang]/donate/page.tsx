import type { Metadata } from 'next';
import Donate from '@/components/pages/Donate';
import { getDictionary } from '@/get-dictionary';
import type { Locale } from '@/i18n-config';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const lang = (await props.params).lang as Locale;
  const dictionary = await getDictionary(lang);
  return { title: dictionary.nav.donate };
}

export default async function Page(props: Props) {
  const lang = (await props.params).lang as Locale;
  const dictionary = await getDictionary(lang);
  return <Donate dictionary={dictionary.donate} common={dictionary.common} />;
}
