#!/usr/bin/env bash

## connect to the host's system bus from the application container
export DBUS_SYSTEM_BUS_ADDRESS=unix:path=/host/run/dbus/system_bus_socket \
  dbus-send \
  --system \
  --print-reply \
  --reply-timeout=2000 \
  --type=method_call \
  --dest=org.freedesktop.hostname1 \
  /org/freedesktop/hostname1 \
  org.freedesktop.hostname1.SetStaticHostname \
  string:"InventoryServer" boolean:true

su - postgres
psql -h localhost -c "ALTER USER postgres PASSWORD 'password'";
