import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { getDictionary } from '@/get-dictionary';
import { i18n, type Locale } from '@/i18n-config';
import StyledComponentsRegistry from '@/lib/registry';
import './globals.css';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang);
  return {
    title: { default: dictionary.meta.title, template: `%s — ${dictionary.meta.title}` },
    description: dictionary.meta.description,
    openGraph: {
      title: dictionary.meta.title,
      description: dictionary.meta.description,
      images: ['/assets/logo/logo-stacked-green.svg'],
    },
  };
}

export default async function Root(props: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang);

  return (
    <html lang={lang === 'ge' ? 'ka' : 'en'}>
      <body>
        <StyledComponentsRegistry>
          <Header dictionary={dictionary.nav} lang={lang} />
          <main>{props.children}</main>
          <Footer dictionary={dictionary.footer} nav={dictionary.nav} lang={lang} />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
