#!/bin/sh

chown postgres:postgres /data/
su - postgres
mkdir /data/pgsql
mkdir /data/pgsql/main
/usr/lib/postgresql/9.4/bin/initdb -D /data/pgsql/main && exit
# Start PostgreSQL
/etc/init.d/postgresql start
