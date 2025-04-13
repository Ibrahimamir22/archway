module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar'],
    localeDetection: false,
  },
  localePath: './public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  debug: process.env.NODE_ENV === 'development',
} 