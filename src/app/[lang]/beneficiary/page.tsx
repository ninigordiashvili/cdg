import type { Metadata } from 'next';
import Beneficiary from '@/components/pages/Beneficiary';
import { getDictionary } from '@/get-dictionary';
import type { Locale } from '@/i18n-config';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const lang = (await props.params).lang as Locale;
  const dictionary = await getDictionary(lang);
  return { title: dictionary.nav.beneficiary };
}

export default async function Page(props: Props) {
  const lang = (await props.params).lang as Locale;
  const dictionary = await getDictionary(lang);
  return <Beneficiary dictionary={dictionary.beneficiary} />;
}
