/** @type {import('next').NextConfig} */

const { withSentryConfig } = require('@sentry/nextjs')

const {
  SENTRY_AUTH_TOKEN,
  SENTRY_ORG,
  SENTRY_PROJECT_NAME,
  SENTRY_URL,
} = process.env

const nextjsConfig = {
  compiler: { styledComponents: true },
  i18n:{
    defaultLocale: 'en-US',
    locales: ['en-US', 'it-IT'],
  },
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
}

// Sentry config. For all available options, see:
// https://github.com/getsentry/sentry-webpack-plugin#options
const SentryWebpackPluginOptions = {
  authToken: SENTRY_AUTH_TOKEN,
  org: SENTRY_ORG,
  project: SENTRY_PROJECT_NAME,
  url: SENTRY_URL
}

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
const config = SENTRY_AUTH_TOKEN && SENTRY_ORG && SENTRY_URL
  ? withSentryConfig(nextjsConfig, SentryWebpackPluginOptions)
  : nextjsConfig

module.exports = config
