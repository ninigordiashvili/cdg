import Home from '@/components/home/Home';
import { getDictionary } from '@/get-dictionary';
import type { Locale } from '@/i18n-config';

export default async function IndexPage(props: { params: Promise<{ lang: string }> }) {
  const lang = (await props.params).lang as Locale;
  const dictionary = await getDictionary(lang);
  return (
    <Home
      dictionary={dictionary.home}
      rare={dictionary.rare}
      events={dictionary.events}
      lang={lang}
    />
  );
}
