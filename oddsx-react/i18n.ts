// i18n.ts
export const locales = [
  'es','en','fr','it','pt','de','zh','ja','ko','ru','hi','bn','tr','nl','sv','no','da','pl','el','he','fa','ar','th','vi','id','fil'
] as const;

export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'es';
