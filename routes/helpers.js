import models from '../models/index'

module.exports = function (app) {
  /**
   * @api {get} /studentYears Get StudentYear objects
   * @apiGroup Helpers
   * @apiSuccess {json} StudentYear array
   */
  app.get('/api/v1/studentYears', function (req, res) {
    models.studentYear.findAll({
      order: [['description', 'ASC']]
    }).then(function (sqlResult) {
      res.json(sqlResult)
    })
  })

  /**
   * @api {get} /userTypes Get UserType objects
   * @apiGroup Helpers
   * @apiSuccess {json} UserType array
   */
  app.get('/api/v1/userTypes', function (req, res) {
    models.userType.findAll({
      order: [['description', 'ASC']]
    }).then(function (sqlResult) {
      res.json(sqlResult)
    })
  })

  /**
   * @api {get} /itemCategories Get ItemCategory objects
   * @apiGroup Helpers
   * @apiSuccess {json} ItemCategory array
   */
  app.get('/api/v1/itemCategories', function (req, res) {
    models.itemCategory.findAll(
      {order: [['parentId', 'ASC'], ['id', 'ASC']]}
    ).then(function (sqlResult) {
      res.json(sqlResult)
    })
  })

  /**
   * @api {get} /itemLocations Get ItemLocation objects
   * @apiGroup Helpers
   * @apiSuccess {json} ItemLocation array
   */
  app.get('/api/v1/itemLocations', function (req, res) {
    models.itemLocation.findAll(
      {order: [['description', 'ASC']]}
    ).then(function (sqlResult) {
      res.json(sqlResult)
    })
  })

  /**
   * @api {get} /totalItems Get the sum of all Item stockMax
   * @apiGroup Helpers
   * @apiSuccess {json} Number The sum of all stockMax
   */
  app.get('/api/v1/allStockMax', function (req, res) {
    models.item.sum('stockMax')
      .then(function (sqlResult) {
        res.json(sqlResult)
      })
  })

  /**
   * @api {get} /totalItems Get the sum of all Item stockAvailable
   * @apiGroup Helpers
   * @apiSuccess {json} Number The sum of all stockAvailable
   */
  app.get('/api/v1/allStockAvailable', function (req, res) {
    models.item.sum('stockAvailable')
      .then(function (sqlResult) {
        res.json(sqlResult)
      })
  })

  /**
   * @api {get} /totalItems Get the sum of all Item stockAvailable
   * @apiGroup Helpers
   * @apiSuccess {json} Number The sum of all stockAvailable
   */
  app.get('/api/v1/openTransactions', function (req, res) {
    models.transaction.count({
      where: {ended: false}
    }).then(function (sqlResult) {
      res.json(sqlResult)
    })
  })
}
