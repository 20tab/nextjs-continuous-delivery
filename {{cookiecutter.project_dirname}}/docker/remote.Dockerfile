# syntax=docker/dockerfile:1

FROM node:{{ cookiecutter.node_version }}-alpine AS build
ENV PATH="$PATH:./node_modules/.bin"
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
RUN corepack enable && corepack prepare yarn@stable --activate && yarn set version stable
RUN yarn install --immutable
ARG \
  NEXT_PUBLIC_PROJECT_URL \
  SENTRY_DSN \
  SENTRY_ENVIRONMENT \
  SENTRY_ORG \
  SENTRY_PROJECT_NAME \
  SENTRY_TRACES_SAMPLE_RATE \
  SENTRY_URL
ENV \
  NEXT_PUBLIC_PROJECT_URL=$NEXT_PUBLIC_PROJECT_URL \
  NEXT_PUBLIC_SENTRY_DSN=$SENTRY_DSN \
  NEXT_PUBLIC_SENTRY_ENVIRONMENT=$SENTRY_ENVIRONMENT \
  NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=$SENTRY_TRACES_SAMPLE_RATE \
  NEXT_TELEMETRY_DISABLED=1 \
  NODE_ENV="production" \
  PATH="$PATH:./node_modules/.bin" \
  SENTRY_ORG=$SENTRY_ORG \
  SENTRY_PROJECT_NAME=$SENTRY_PROJECT_NAME \
  SENTRY_URL=$SENTRY_URL
COPY models ./models
COPY pages ./pages
COPY public ./public
COPY styles ./styles
COPY utils ./utils
COPY [ \
  "instrumentation-client.ts", \
  "instrumentation.ts", \
  "next.config.ts", \
  "postcss.config.mjs", \
  "sentry.edge.config.ts", \
  "sentry.server.config.ts", \
  "tsconfig.json", \
  "./" \
  ]
RUN --mount=type=secret,id=SENTRY_AUTH_TOKEN \
  SENTRY_AUTH_TOKEN=$(cat /run/secrets/SENTRY_AUTH_TOKEN) \
  yarn build
LABEL company="20tab" project="{{ cookiecutter.project_slug }}" service="{{ cookiecutter.service_slug }}" stage="build"

FROM node:{{ cookiecutter.node_version }}-alpine AS remote
ARG SENTRY_ENVIRONMENT
ENV \
  HOSTNAME="0.0.0.0" \
  NEXT_PUBLIC_SENTRY_ENVIRONMENT=$SENTRY_ENVIRONMENT \
  NEXT_TELEMETRY_DISABLED=1 \
  NODE_ENV="production" \
  PORT={{ cookiecutter.internal_service_port }}
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
COPY --from=build --chown=nextjs:nodejs /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
EXPOSE {{ cookiecutter.internal_service_port }}
CMD ["node", "server.js"]
LABEL company="20tab" project="{{ cookiecutter.project_slug }}" service="{{ cookiecutter.service_slug }}" stage="remote"
