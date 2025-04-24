/**
 * Interface for translation function provided by next-intl
 */
export type TranslationFunction = (key: string, values?: Record<string, string | number>) => string;

/**
 * Interface for locale information
 */
export interface LocaleInfo {
  locale: string;
  isRtl: boolean;
} 