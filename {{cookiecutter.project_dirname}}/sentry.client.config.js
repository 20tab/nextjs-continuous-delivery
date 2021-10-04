import * as Sentry from '@sentry/nextjs'

const { SENTRY_DNS, NODE_ENV } = process.env

if (SENTRY_DNS && NODE_ENV === 'production') {
  Sentry.init({
    dsn: SENTRY_DNS,
    // To set a uniform sample rate
    tracesSampleRate: 0.3,
  })
}
