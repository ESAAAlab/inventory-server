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
