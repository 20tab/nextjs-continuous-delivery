import * as Sentry from '@sentry/nextjs'

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: process.env.SENTRY_DNS,
    // To set a uniform sample rate
    tracesSampleRate: 0.3,
  })
}
