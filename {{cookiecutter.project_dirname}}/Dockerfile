FROM node:14-slim as base

WORKDIR /

COPY ./package.json .

COPY ./yarn.lock .

RUN yarn install

ENV PATH /node_modules/.bin:$PATH

RUN next telemetry disable

WORKDIR /app

COPY . .

FROM base as local

CMD ["yarn", "dev"]

FROM base as test

CMD yarn pact --coverage --color && \
  yarn test --coverage --color

FROM base as build

RUN yarn build

FROM node:14-slim as remote

WORKDIR /app

COPY ./package.json /app
COPY ./yarn.lock /app
COPY ./public /app/public

RUN yarn add express next basic-auth path

COPY --from=build /app/.next /app/.next
COPY ./server.js /app

CMD ["yarn", "start"]
