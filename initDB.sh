#!/bin/sh

chown postgres:postgres /data/
su - postgres -c 'mkdir /data/pgsql'
su - postgres -c 'mkdir /data/pgsql/main'
su - postgres -c '/usr/lib/postgresql/9.4/bin/initdb -D /data/pgsql/main'
/etc/init.d/postgresql restart
