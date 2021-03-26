#!/bin/bash

export MIX_ENV=prod
export PORT=4787

echo "Stopping old copy of app, if any..."

_build/prod/rel/event_server/bin/event_server stop || true

echo "Starting app..."  

_build/prod/rel/event_server/bin/event_server start
