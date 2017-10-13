import models from '../models/index'

module.exports = function (app) {
  /**
   * @api {get} /transaction/user/:id Get Transactions by User ID
   * @apiGroup Transaction
   * @apiParam {Number} id User ID.
   * @apiSuccess {json} Transaction array with User & Item included.
   */
  app.get('/api/v1/transaction/user/:id', function (req, res) {
    models.transaction.findAll({
      where: {ended: false},
      include: [
        {model: models.user, as: 'lendings', where: {id: req.params.id}, required: true},
        {model: models.item, as: 'transactions', required: true}
      ],
      order: [['createdAt', 'DESC']]
    }).then(function (sqlResult) {
      res.json(sqlResult)
    })
  })

  /**
   * @api {get} /transaction/item/:id Get Transactions by Item ID
   * @apiGroup Transaction
   * @apiParam {Number} id Item ID.
   * @apiSuccess {json} Transaction array with Item & User included.
   */
  app.get('/api/v1/transaction/item/:id', function (req, res) {
    models.transaction.findAll({
      include: [
        {model: models.item, as: 'transactions', where: {id: req.params.id}, required: true},
        {model: models.user, as: 'lendings'}
      ],
      order: [['startDate', 'DESC']]
    }).then(function (sqlResult) {
      res.json(sqlResult)
    })
  })

  /**
   * @api {get} /transaction/latest/:limit Get latest Transactions
   * @apiGroup Transaction
   * @apiParam {Number} limit Number of items returned
   * @apiSuccess {json} Transaction array with User & Item included.
   */
  app.get('/api/v1/transaction/latest/:isEnded/:limit', function (req, res) {
    models.transaction.findAll({
      where: {ended: req.params.isEnded},
      include: [
        {model: models.user, as: 'lendings', required: true},
        {model: models.item, as: 'transactions', required: true}
      ],
      order: [['createdAt', 'DESC']],
      limit: req.params.limit
    }).then(function (sqlResult) {
      res.json(sqlResult)
    })
  })

  /**
   * @api {get} /transaction/latest/:limit Get latest Transactions
   * @apiGroup Transaction
   * @apiParam {Number} limit Number of items returned
   * @apiSuccess {json} Transaction array with User & Item included.
   */
  app.get('/api/v1/transaction/latest/:limit', function (req, res) {
    models.transaction.findAll({
      include: [
        {model: models.user, as: 'lendings', required: true},
        {model: models.item, as: 'transactions', required: true}
      ],
      order: [['createdAt', 'DESC']],
      limit: req.params.limit
    }).then(function (sqlResult) {
      res.json(sqlResult)
    })
  })

  /**
   * @api {get} /transaction/oldest/:limit Get oldest Transactions
   * @apiGroup Transaction
   * @apiParam {Number} limit Number of items returned
   * @apiSuccess {json} Transaction array with User & Item included.
   */
  app.get('/api/v1/transaction/oldest/:isEnded/:limit', function (req, res) {
    models.transaction.findAll({
      where: {ended: req.params.isEnded},
      include: [
        {model: models.user, as: 'lendings', required: true},
        {model: models.item, as: 'transactions', required: true}
      ],
      order: [['createdAt', 'ASC']],
      limit: req.params.limit
    }).then(function (sqlResult) {
      res.json(sqlResult)
    })
  })

  /**
   * @api {post} /transaction/ Create a new Transaction
   * @apiGroup Transaction
   * @apiParam {Number} itemId ID of Item lended
   * @apiParam {Number} userId ID of User lending
   * @apiParam {Number} quantity Number of items lended
   * @apiSuccess {json} Transaction object
   */
  app.post('/api/v1/transaction', function (req, res) {
    var defaultEndDate = new Date()
    defaultEndDate.setDate(defaultEndDate.getDate() + 3)
    models.item.findOne({
      where: {id: req.body.itemId}
    }).then(function (sqlItem) {
      models.user.findOne({
        where: {id: req.body.userId}
      }).then(function (sqlUser) {
        models.transaction.create({
          type: 'lending',
          startDate: new Date(),
          endDate: defaultEndDate,
          ended: false,
          quantity: req.body.quantity
        }).then(function (sqlTransaction) {
          sqlItem.addLending(sqlTransaction)
          sqlUser.addLending(sqlTransaction)
          sqlItem.updateAttributes({
            stockAvailable: sqlItem.stockAvailable - req.body.quantity
          }).then(function (sqlResult) {
            res.json(sqlTransaction)
          })
        })
      })
    })
  })

  /**
   * @api {put} /transaction/:id End a transaction
   * @apiGroup Transaction
   * @apiParam {Number} id ID of transaction to end
   * @apiSuccess {json} Transaction object
   */
  app.put('/api/v1/transaction/:id', function (req, res) {
    models.transaction.findOne({
      where: {id: req.params.id},
      include: [
        {model: models.item, as: 'transactions', required: false}
      ]
    }).then(function (transaction) {
      var item = transaction.transactions[0]
      item.updateAttributes({
        stockAvailable: item.stockAvailable + transaction.quantity
      }).then(function (sqlResult) {
        transaction.updateAttributes({
          ended: true,
          effectiveEndDate: new Date()
        }).then(function (sqlResult) {
          res.send(sqlResult)
        })
      })
    })
  })
}
