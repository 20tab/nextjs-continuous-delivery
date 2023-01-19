FROM node:16-bullseye-slim
ARG DEBIAN_FRONTEND=noninteractive
ARG USER=appuser
ENV APPUSER=$USER PATH="$PATH:./node_modules/.bin"
RUN apt-get update && apt-get install -y --no-install-recommends \
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
WORKDIR /app
RUN useradd --skel /dev/null --create-home $APPUSER
RUN chown $APPUSER:$APPUSER /app
USER $APPUSER
COPY --chown=$APPUSER ./tsconfig.json ./
RUN yarn add cypress typescript
RUN cypress install
RUN mkdir cypress-screenshots
CMD [ "cypress", "run" ]
