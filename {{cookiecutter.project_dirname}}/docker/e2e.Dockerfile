FROM cypress/base:16.18.1
ARG USER=appuser
ENV APPUSER=$USER PATH="$PATH:./node_modules/.bin"
WORKDIR /app
RUN useradd --skel /dev/null --create-home $APPUSER
RUN chown $APPUSER:$APPUSER /app
USER $APPUSER
COPY --chown=$APPUSER ./tsconfig.json ./
RUN yarn add cypress typescript
RUN cypress install
RUN mkdir cypress-outputs
CMD [ "cypress", "run" ]
