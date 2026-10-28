import type { Metadata } from 'next';
import Script from 'next/script';
import ColorFilters from '@/components/ColorFilters';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { getDictionary } from '@/get-dictionary';
import { i18n, type Locale } from '@/i18n-config';
import { a11yBootScript } from '@/lib/a11y';
import StyledComponentsRegistry from '@/lib/registry';
import './globals.css';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const lang = (await props.params).lang as Locale;
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
  params: Promise<{ lang: string }>;
}) {
  const lang = (await props.params).lang as Locale;
  const dictionary = await getDictionary(lang);

  return (
    <html lang={lang === 'ge' ? 'ka' : 'en'} suppressHydrationWarning>
      <body>
        <Script id="a11y-boot" strategy="beforeInteractive">
          {a11yBootScript}
        </Script>
        <a className="skip-link" href="#main">
          {dictionary.a11y.skip}
        </a>
        <ColorFilters />
        <StyledComponentsRegistry>
          <Header dictionary={dictionary.nav} a11y={dictionary.a11y} lang={lang} />
          <main id="main" tabIndex={-1}>
            {props.children}
          </main>
          <Footer dictionary={dictionary.footer} nav={dictionary.nav} lang={lang} />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
