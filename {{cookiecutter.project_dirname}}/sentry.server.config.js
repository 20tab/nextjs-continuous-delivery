import * as Sentry from '@sentry/nextjs'

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: __SENTRY_DNS__,
    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps
  })
}
