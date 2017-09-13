var db = require('./scripts/db.js')

var myArgs = process.argv.slice(2)
switch (myArgs[0]) {
  case 'drop':
    db.drop()
    break
  case 'sync':
    db.sync()
    break
  case 'inventory':
    db.randomInventory(myArgs[1])
    break
  case 'users':
    db.randomUsers(myArgs[1])
    break
  default:
    console.log('Sorry, that is not something I know how to do.')
}

/*
su - postgres
psql -c "ALTER USER postgres PASSWORD 'dzer38'"";

Then

CREATE USER inventory WITH PASSWORD 'inventory';
CREATE DATABASE inventory_dev;
CREATE DATABASE inventory_test;
CREATE DATABASE inventory_prod;
GRANT ALL PRIVILEGES ON DATABASE inventory_dev to inventory;
GRANT ALL PRIVILEGES ON DATABASE inventory_test to inventory;
GRANT ALL PRIVILEGES ON DATABASE inventory_prod to inventory;
 */
