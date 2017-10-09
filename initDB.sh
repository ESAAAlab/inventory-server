#!/bin/sh

chown postgres:postgres /data/
su - postgres -c 'mkdir /data/pgsql'
su - postgres -c 'mkdir /data/pgsql/main'
su - postgres -c '/usr/lib/postgresql/9.4/bin/initdb -D /data/pgsql/main'
/etc/init.d/postgresql restart

#Change passwords and user for your configuration
#su - postgres
#psql -c "ALTER USER postgres PASSWORD 'password';"
#psql -c "CREATE USER inventory WITH PASSWORD 'inventory';"
#psql -c "CREATE DATABASE inventory_dev;"
#psql -c "CREATE DATABASE inventory_prod;"
#psql -c "GRANT ALL PRIVILEGES ON DATABASE inventory_dev, inventory_prod to inventory;"
