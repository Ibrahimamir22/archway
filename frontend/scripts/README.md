# Translation Management Tools

This directory contains tools for managing translations in the Archway project.

## Translation Checker

The translation checker helps identify missing translations between language files.

### Usage

To check for missing translations:

```bash
# From the frontend directory
npm run check-translations

# Or directly
node scripts/check-translations.js
```

To automatically add missing keys (using English values as placeholders):

```bash
# From the frontend directory
npm run fix-translations

# Or directly
node scripts/check-translations.js --fix
```

### How It Works

The script compares all translation keys in the English file (en.json) with other language files, like Arabic (ar.json). It identifies any keys that are present in English but missing in other languages.

With the `--fix` option, it automatically adds the missing keys to the target language files, using the English values as placeholders that you can later translate properly.

## Best Practices for Managing Translations

1. **Run the checker before deployment**: Make sure to run the translation checker before deploying to catch any missing translations.

2. **Add new translations properly**:
   - First add the English translation
   - Run the fix script to add placeholders in other languages
   - Translate the placeholders in each language file

3. **Use the TypeScript types**: Use the type definitions in `src/types/translations.d.ts` to get type safety when accessing translations.

4. **Consider using a Translation Management System** for larger projects:
   - [Lokalise](https://lokalise.com/)
   - [Crowdin](https://crowdin.com/)
   - [Phrase](https://phrase.com/)

## Advanced Features

### TypeScript Type Safety

The project includes TypeScript type definitions for translations in `src/types/translations.d.ts`. This provides type checking and autocompletion for translation keys.

Example usage:

```typescript
import { useTranslations } from 'next-intl';

// In a component
const t = useTranslations('about');
const title = t('title'); // TypeScript will validate this key exists
```

### Adding New Languages

To add a new language:

1. Create a new translation file in `src/messages/` (e.g., `fr.json`)
2. Add the language code to the `LANGUAGES_TO_CHECK` array in `scripts/check-translations.js`
3. Run the fix script to populate all keys: `npm run fix-translations`
4. Translate the placeholder values 