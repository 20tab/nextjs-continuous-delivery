# syntax=docker/dockerfile:1

ARG NODE_VERSION={{ cookiecutter.node_version }}-alpine


FROM node:${NODE_VERSION} AS dependencies

LABEL company="20tab" project="{{ cookiecutter.project_slug }}" service="{{ cookiecutter.service_slug }}" stage="dependencies"

WORKDIR /app

COPY package.json yarn.lock ./

RUN corepack enable && corepack prepare yarn@stable --activate && yarn set version stable

RUN --mount=type=cache,target=/usr/local/share/.cache/yarn \
    yarn install --immutable


FROM node:${NODE_VERSION} AS builder

LABEL company="20tab" project="{{ cookiecutter.project_slug }}" service="{{ cookiecutter.service_slug }}" stage="builder"

ARG NEXT_PUBLIC_PROJECT_URL \
    SENTRY_DSN \
    SENTRY_ENVIRONMENT \
    SENTRY_ORG \
    SENTRY_PROJECT_NAME \
    SENTRY_TRACES_SAMPLE_RATE \
    SENTRY_URL

ENV NEXT_PUBLIC_PROJECT_URL=$NEXT_PUBLIC_PROJECT_URL \
    NEXT_PUBLIC_ENVIRONMENT=$SENTRY_ENVIRONMENT \
    NEXT_PUBLIC_SENTRY_DSN=$SENTRY_DSN \
    NEXT_PUBLIC_SENTRY_ENVIRONMENT=$SENTRY_ENVIRONMENT \
    NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=$SENTRY_TRACES_SAMPLE_RATE \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production \
    PATH="$PATH:./node_modules/.bin" \
    SENTRY_ORG=$SENTRY_ORG \
    SENTRY_PROJECT_NAME=$SENTRY_PROJECT_NAME \
    SENTRY_URL=$SENTRY_URL \
    TZ="Europe/Rome"

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY . .

RUN --mount=type=secret,id=SENTRY_AUTH_TOKEN \
    SENTRY_AUTH_TOKEN=$(cat /run/secrets/SENTRY_AUTH_TOKEN 2>/dev/null || true) \
    yarn build


FROM node:${NODE_VERSION} AS remote

LABEL company="20tab" project="{{ cookiecutter.project_slug }}" service="{{ cookiecutter.service_slug }}" stage="remote"

ARG SENTRY_ENVIRONMENT

ENV HOSTNAME="0.0.0.0" \
    NEXT_PUBLIC_ENVIRONMENT=$SENTRY_ENVIRONMENT \
    NEXT_PUBLIC_SENTRY_ENVIRONMENT=$SENTRY_ENVIRONMENT \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production \
    PORT={{ cookiecutter.internal_service_port }} \
    TZ="Europe/Rome"

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public

RUN mkdir .next && chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE {{ cookiecutter.internal_service_port }}

CMD ["node", "server.js"]
