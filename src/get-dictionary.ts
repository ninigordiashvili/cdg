import 'server-only';
import { applyOverrides, getOverrides } from '@/server/content';
import type { Locale } from './i18n-config';

const dictionaries = {
  ge: () => import('./dictionary/ge.json').then((module) => module.default),
  en: () => import('./dictionary/en.json').then((module) => module.default),
};

/** Built-in texts, without anything staff edited. The admin compares against these. */
export const getDefaultDictionary = async (locale: Locale) =>
  dictionaries[locale]?.() ?? dictionaries.ge();

export const getDictionary = async (locale: Locale) => {
  const base = await getDefaultDictionary(locale);
  return applyOverrides(base, await getOverrides(locale in dictionaries ? locale : 'ge'));
};

export type Dictionary = Awaited<ReturnType<typeof getDefaultDictionary>>;
