# syntax=docker/dockerfile:1

FROM node:16-bullseye-slim
LABEL company="20tab" project="{{ cookiecutter.project_slug }}" service="frontend" stage="test"

ARG DEBIAN_FRONTEND=noninteractive
ARG USER=appuser
ENV APPUSER=$USER LANG=C.UTF-8 LC_ALL=C.UTF-8 NEXT_TELEMETRY_DISABLED=1 NODE_ENV="development" TZ='Europe/Rome' WORKDIR=/app
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        g++ \
        make \
        python3
WORKDIR $WORKDIR
RUN addgroup --system --gid 997 $APPUSER
RUN adduser --system --uid 997 $APPUSER
USER $APPUSER
ENV PATH="$PATH:./node_modules/.bin"
COPY --chown=$APPUSER package.json yarn.lock ./
ENTRYPOINT ["./scripts/test.sh"]
CMD yarn ci:unit-test && yarn ci:contract-test
