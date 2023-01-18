# syntax=docker/dockerfile:1

FROM node:16-bullseye-slim
LABEL company="20tab" project="differenti" service="frontend" stage="local"

ARG DEBIAN_FRONTEND=noninteractive
ENV LANG=C.UTF-8 LC_ALL=C.UTF-8 NEXT_TELEMETRY_DISABLED=1 NODE_ENV="development" WORKDIR=/app
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        g++ \
        git \
        make \
        openssh-client \
        python3
WORKDIR /
COPY --chown=node ./package.json ./
COPY --chown=node ./yarn.lock ./
RUN yarn install
USER node
ENV PATH="/node_modules/.bin:${PATH}"
WORKDIR ${WORKDIR}
RUN chown node ${WORKDIR}
ENTRYPOINT ["./scripts/entrypoint.sh"]
CMD yarn start