#!/usr/bin/env bash

set -e

if ! which wget > /dev/null; then
  apt-get update && apt-get install -y --no-install-recommends wget
fi

if ! which inotifywait > /dev/null; then
  apt-get update && apt-get install -y --no-install-recommends inotify-tools
fi

while true; do
  ./pact-stub-server "${@}" &
  inotifywait \
    --event attrib \
    --event create \
    --event delete \
    --event modify \
    --event move \
    --recursive /app/pacts
  [[ $(jobs -pr) == "" ]] || kill "$(jobs -pr)"
done
