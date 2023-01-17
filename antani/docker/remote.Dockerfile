# syntax=docker/dockerfile:1

FROM node:16.13.1-buster-slim as base
ENV PATH="$PATH:./node_modules/.bin"
WORKDIR /app
RUN chown node:node /app
USER node
COPY --chown=node:node . .
RUN yarn install
RUN next telemetry disable

FROM base as test
ENV TZ='Europe/Rome'
CMD yarn ci:unit-test && yarn ci:contract-test

FROM base as e2e
USER root
RUN apt-get update && apt-get install -y \
  libgtk2.0-0 \
  libgtk-3-0 \
  libgbm-dev \
  libnotify-dev \
  libgconf-2-4 \
  libnss3 \
  libxss1 \
  libasound2 \
  libxtst6 \
  xauth \
  xvfb \
  && rm -rf /var/lib/apt/lists/*
USER node
RUN cypress install
CMD ./scripts/test.sh

FROM base as build
ENV NODE_ENV="production" \
  PORT={{ cookiecutter.internal_service_port }}
USER root
RUN apt-get update && apt-get install -y \
    ca-certificates
USER node
RUN  yarn build
USER root
RUN apt-get purge -y --auto-remove \
    ca-certificates \
  && rm -rf /var/lib/apt/lists/*

FROM node:16.13.1-buster-slim as remote
ENV PATH="$PATH:./node_modules/.bin" NODE_ENV="production"
WORKDIR /app
COPY ["next.config.js", "package.json", "sentry.client.config.js", "sentry.server.config.js", "server.js", "yarn.lock", "./"]
COPY ["public/", "public/"]
COPY --from=build /app/.next /app/.next
RUN yarn install --prod
CMD ["yarn", "start"]
