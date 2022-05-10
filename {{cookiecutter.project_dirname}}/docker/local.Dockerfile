# syntax=docker/dockerfile:1

FROM node:16.13.1-buster-slim

ENV NODE_ENV="development"

WORKDIR /

COPY ./package.json .

COPY ./yarn.lock .

RUN yarn install

ENV PATH /node_modules/.bin:$PATH

RUN next telemetry disable

WORKDIR /app

CMD ["yarn", "dev"]
