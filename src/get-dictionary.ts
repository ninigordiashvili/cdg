import 'server-only';
import type { Locale } from './i18n-config';

const dictionaries = {
  ge: () => import('./dictionary/ge.json').then((module) => module.default),
  en: () => import('./dictionary/en.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]?.() ?? dictionaries.ge();

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
