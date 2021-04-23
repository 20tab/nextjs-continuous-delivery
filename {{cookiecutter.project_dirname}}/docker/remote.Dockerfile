FROM node:14-slim as base
WORKDIR /
COPY ./package.json .
COPY ./yarn.lock .
RUN yarn install
ENV PATH /node_modules/.bin:$PATH
RUN next telemetry disable
WORKDIR /app
COPY . .

FROM base as test
CMD yarn pact --coverage --color && \
  yarn test --coverage --color

FROM base as build
RUN yarn build

FROM node:14-slim as remote
WORKDIR /app
COPY ./package.json /app
COPY ./yarn.lock /app
RUN yarn install --prod
COPY --from=build /app/.next /app/.next
COPY ./server.js /app
COPY ./public /app/public
CMD ["yarn", "start"]
