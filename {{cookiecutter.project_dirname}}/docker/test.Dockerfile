# syntax=docker/dockerfile:1

FROM node:16-bullseye-slim
ARG DEBIAN_FRONTEND=noninteractive
ENV LANG=C.UTF-8 LC_ALL=C.UTF-8 NEXT_TELEMETRY_DISABLED=1 NODE_ENV="development" TZ='Europe/Rome' WORKDIR=/app
RUN apt-get update \
    && apt-get install --assume-yes --no-install-recommends \
        g++ \
        make \
        python3 \
        && rm -rf /var/lib/apt/lists/*
WORKDIR $WORKDIR
ENV PATH="$PATH:./node_modules/.bin"
COPY package.json yarn.lock ./
ENTRYPOINT ["./scripts/test.sh"]
CMD yarn ci:unit-test && yarn ci:contract-test
LABEL company="20tab" project="{{ cookiecutter.project_slug }}" service="frontend" stage="test"
