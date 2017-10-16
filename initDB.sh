#!/bin/sh

# Generate fr_FR.UTF-8 Locale
/etc/init.d/postgresql stop

apt-get update
apt-get install postgresql-contrib-9.4

echo "fr_FR.UTF-8 UTF-8" >> /etc/locale.gen
locale-gen

chown postgres:postgres /data/
su - postgres -c 'mkdir /data/pgsql'
su - postgres -c 'mkdir /data/pgsql/main'
su - postgres -c '/usr/lib/postgresql/9.4/bin/initdb -D /data/pgsql/main --encoding=UTF8 --locale=fr_FR.UTF8'
/etc/init.d/postgresql start

#Change passwords and user for your configuration
#su - postgres
#psql -c "ALTER USER postgres PASSWORD 'password';"
#psql -c "CREATE USER inventory WITH PASSWORD 'inventory';"
#psql -c "CREATE DATABASE inventory_dev;"
#psql -c "CREATE DATABASE inventory_prod;"
#psql -c "GRANT ALL PRIVILEGES ON DATABASE inventory_dev, inventory_prod to inventory;"
#psql -d inventory_dev -c "CREATE EXTENSION unaccent;"
#psql -d inventory_prod -c "CREATE EXTENSION unaccent;"
