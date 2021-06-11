import * as Sentry from '@sentry/nextjs'

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: __SENTRY_DNS__,
  })
}
