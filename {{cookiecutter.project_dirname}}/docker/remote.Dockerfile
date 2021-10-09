FROM node:14-buster-slim as base
WORKDIR /temp
COPY package.json yarn.lock ./
RUN yarn install
ENV PATH="/temp/node_modules/.bin:$PATH"
RUN next telemetry disable
COPY . .

FROM base as test
CMD yarn coverage

FROM base as build
ARG SENTRY_DSN \
  SENTRY_AUTH_TOKEN \
  SENTRY_ORG \
  SENTRY_URL
ENV NEXT_PUBLIC_SENTRY_DSN=$SENTRY_DSN \
  NODE_ENV="production" \
  SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN \
  SENTRY_ORG=$SENTRY_ORG \
  SENTRY_URL=$SENTRY_URL
RUN apt-get update && apt-get install -y \
    ca-certificates \
  && yarn build \
  && apt-get purge -y --auto-remove \
    ca-certificates \
  && rm -rf /var/lib/apt/lists/*

FROM build as remote
WORKDIR /app
COPY package.json yarn.lock server.js ./
COPY public /app/public
COPY --from=build /temp/.next ./.next
RUN yarn install --prod && rm -rf /temp
CMD ["yarn", "start"]
