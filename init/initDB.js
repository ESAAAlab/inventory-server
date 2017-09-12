var models = require('../server/models/index')
var fixtures = require('sequelize-fixtures')
var request = require('request')
var throttledRequest = require('throttled-request')(request)
var md5 = require('md5')
var jsonQuery = require('json-query')

var Mockaroo = require('mockaroo')

var nbUsers = 200
var nbInventory = 1000

throttledRequest.configure({
  requests: 5,
  milliseconds: 2000
})

initSQL()

function initSQL () {
  console.log('dropping tables')
  models.sequelize.drop()
  console.log('synching tables')
  models.sequelize.sync({force: true}).then(
    function () {
      seedDB()
    }
  )
}

function seedDB () {
  fixtures.loadFile('./init.json', models).then(function () {
    createRandomInventory(nbInventory)
  })
};

function createRandomInventory (nb) {
  var client = new Mockaroo.Client({
    apiKey: 'xxx' // see http://mockaroo.com/api/docs to get your api key
  })

  client.generate({
    count: nb,
    fields: [
      {
        name: 'brand',
        type: 'Company Name'
      },
      {
        name: 'model',
        type: 'App Name'
      },
      {
        name: 'name',
        type: 'Formula',
        value: 'brand+" "+model'
      },
      {
        name: 'serialNumber',
        type: 'ISBN'
      },
      {
        name: 'barcode',
        type: 'Formula',
        value: 'digest(name+" "+serialNumber,"MD5")'
      },
      {
        name: 'materialCode',
        type: 'Credit Card #'
      },
      {
        name: 'inventoryNumber',
        type: 'Credit Card #'
      },
      {
        name: 'acquisitionPrice',
        type: 'Number',
        min: 0,
        max: 5000,
        decimals: 2
      },
      {
        name: 'acquisitionDate',
        type: 'Date',
        min: '1/1/2000',
        max: '08/31/2016',
        format: '%m/%d/%Y'
      },
      {
        name: 'description',
        type: 'Paragraphs',
        max: 1
      },
      {
        name: 'isConsummable',
        type: 'Boolean'
      },
      {
        name: 'stockMax',
        type: 'Number',
        min: 0,
        max: 100,
        decimals: 0
      },
      {
        name: 'stockAvailable',
        type: 'Formula',
        value: 'random(0,stockMax)'
      },
      {
        name: 'stockStep',
        type: 'Formula',
        value: 'random(1,stockMax)'
      },
      {
        name: 'stockUnit',
        type: 'Custom List',
        values: ['pc', 'g', 'Kg', 'L']
      },
      {
        name: 'itemCategoryId',
        type: 'Number',
        min: 8,
        max: 40,
        decimals: 0
      },
      {
        name: 'itemLocationId',
        type: 'Formula',
        value: 'if itemCategoryId <= 20 then 1 else 2 end'
      }
    ]
  }).then(function (records) {
    console.log(records)
    for (var i in records) {
      var item = records[i]
      models.item.create({
        name: item.name,
        model: item.model,
        brand: item.brand,
        serialNumber: item.serialNumber,
        materialCode: item.materialCode,
        barcode: item.barcode,
        inventoryNumber: item.inventoryNumber,
        acquisitionPrice: item.acquisitionPrice,
        acquisitionDate: item.acquisitionDate,
        description: item.description,
        isConsummable: item.isConsummable,
        stockStep: item.stockStep,
        stockUnit: item.stockUnit,
        itemCategoryId: item.itemCategoryId,
        itemLocationId: item.itemLocationId
      }).then(function (sqlitem) {
        var qres = jsonQuery('[barcode=' + sqlitem.barcode + ']', {
          data: records
        })
        models.transaction.create({
          type: 'stockCount',
          startDate: new Date(),
          ended: true,
          quantity: records[qres.key].stockMax
        }).then(function (sqltransaction) {
          sqlitem.addStockCount(sqltransaction)
        })
      })
    }
    createRandomUsers(nbUsers)
  })
}

function createRandomUsers (nb) {
  console.log('querying randomuser.me for ' + nb + ' users')
  var randomUri = 'http://api.randomuser.me/?inc=name,email,phone,cell,location,picture,login&nat=fr&noinfo&results=' + nb
  var maxStudentYear = 11
  var maxUserType = 7
  var currentIndex = 0
  request(randomUri, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var data = JSON.parse(body)
      for (var i in data.results) {
        var user = data.results[i]
        console.log('creating user ' + (i * 1 + 1) + ' : ' + user.name.first + ' ' + user.name.last)
        models.user.create({
          barcode: md5(user.name.first + user.name.last + user.login.salt),
          title: user.name.title,
          firstName: user.name.first,
          lastName: user.name.last,
          isRegistered: Math.random() < 0.5,
          email: user.email,
          cellPhone: user.cell,
          homePhone: user.phone,
          addressStreet: user.location.street,
          addressCity: user.location.city,
          addressState: user.location.state,
          addressPostcode: user.location.postcode,
          loginUsername: user.login.username,
          loginPassword: user.login.password, // FOR DEVELOPMENT ONLY, MUST BE REMOVED IN PRODUCTION
          loginSalt: user.login.salt,
          loginMD5: user.login.md5,
          loginSHA1: user.login.sha1,
          loginSHA256: user.login.sha256,
          userTypeId: Math.ceil(Math.random() * maxUserType),
          studentYearId: Math.ceil(Math.random() * maxStudentYear)
        }).then(function (sqluser) {
          // find picture uri
          var qres = jsonQuery('results.login[md5=' + sqluser.loginMD5 + ']', {
            data: data
          })
          var uri = data.results[qres.key].picture.large
          // download picture and create entry in database
          throttledRequest({uri: uri, encoding: 'binary'}, function (error, response, body) {
            currentIndex++
            var index = currentIndex
            console.log('downloading thumbnail for user ' + index + '/' + nbUsers + ' : ' + sqluser.firstName + ' ' + sqluser.lastName)
            if (!error && response.statusCode === 200) {
              var dataUriPrefix = 'data:' + response.headers['content-type'] + ';base64,'
              var image = Buffer.from(body.toString(), 'binary').toString('base64')
              image = dataUriPrefix + image
              models.document.create({
                type: 'userProfilePic',
                content: image
              }).then(function (pic) {
                sqluser.addPicture(pic)
              })
              console.log('userProfilePic added for user ' + index + '/' + nbUsers + ' : ' + sqluser.firstName + ' ' + sqluser.lastName)
            } else {
              console.error('error downloading picture for user ' + index + '/' + nbUsers + ' : ' + sqluser.firstName + ' ' + sqluser.lastName)
              console.error(error)
            }
          })
        })
      }
    }
  })
}
