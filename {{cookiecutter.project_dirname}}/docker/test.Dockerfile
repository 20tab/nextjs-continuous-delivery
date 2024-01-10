# syntax=docker/dockerfile:1

FROM node:18-bookworm-slim
ARG DEBIAN_FRONTEND=noninteractive USER=appuser
ENV APPUSER=$USER LANG=C.UTF-8 LC_ALL=C.UTF-8 NEXT_TELEMETRY_DISABLED=1 NODE_ENV="development" PATH="$PATH:./node_modules/.bin" TZ='Europe/Rome' WORKDIR=/app
RUN apt-get update \
    && apt-get install --assume-yes --no-install-recommends \
        g++ \
        make \
        python3 \
    && rm -rf /var/lib/apt/lists/*
WORKDIR $WORKDIR
RUN addgroup --system --gid 1001 $APPUSER
RUN adduser --system --uid 1001 $APPUSER
RUN chown $APPUSER:$APPUSER $WORKDIR
USER $APPUSER
COPY --chown=$APPUSER ./scripts/test.sh jest.config.js middleware.ts next.config.js package.json tsconfig.json yarn.lock ./
ENTRYPOINT ["./test.sh"]
CMD yarn ci:contract-test && yarn ci:unit-test
LABEL company="20tab" project="{{ cookiecutter.project_slug }}" service="frontend" stage="test"
