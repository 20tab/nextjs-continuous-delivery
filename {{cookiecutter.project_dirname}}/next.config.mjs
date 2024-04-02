/** @type {import('next').NextConfig} */

import { withSentryConfig } from '@sentry/nextjs'

const { SENTRY_AUTH_TOKEN, SENTRY_ORG, SENTRY_PROJECT_NAME, SENTRY_URL } =
  process.env

const nextjsConfig = {
  compiler: { styledComponents: true },
  i18n: {
    defaultLocale: 'en',
    locales: ['en']
  },
  output: 'standalone',
  reactStrictMode: true,
  rewrites: async () => [
    {
      source: '/frontend/health',
      destination: '/api/health'
    },
    { source: '/robots.txt', destination: '/api/robots' }
  ],
  swcMinify: true
}

const sentryProjectConfig = {
  silent: true,
  authToken: SENTRY_AUTH_TOKEN,
  org: SENTRY_ORG,
  project: SENTRY_PROJECT_NAME,
  url: SENTRY_URL
}

const sentryOptionConfig = {
  widenClientFileUpload: true,
  transpileClientSDK: true,
  hideSourceMaps: true,
  disableLogger: true
}

const config =
  SENTRY_AUTH_TOKEN && SENTRY_ORG && SENTRY_URL
    ? withSentryConfig(nextjsConfig, sentryProjectConfig, sentryOptionConfig)
    : nextjsConfig

export default config
