import * as Sentry from '@sentry/nextjs'

const { SENTRY_DNS, NODE_ENV } = process.env

if (SENTRY_DNS && NODE_ENV === 'production') {
  Sentry.init({
    dsn: SENTRY_DNS,
    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps
    tracesSampleRate: 0.3
  })
}
