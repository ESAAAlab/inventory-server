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
psql -c "ALTER USER postgres PASSWORD 'password';"
psql -c "CREATE USER inventory WITH PASSWORD 'inventory';"
psql -c "CREATE DATABASE inventory_dev;"
psql -c "CREATE DATABASE inventory_prod;"
psql -c "GRANT ALL PRIVILEGES ON DATABASE inventory_dev, inventory_prod to inventory;"
 */
