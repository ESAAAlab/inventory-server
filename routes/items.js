import models from '../models/index'
import utils from '../utils'
import Sequelize from 'sequelize'

module.exports = function (app) {
  /**
   * @api {get} /inventory Get all Items
   * @apiGroup Items
   * @apiSuccess {json} User array, with studentYear, profilePic and transactions
   */
  app.get('/api/v1/inventory', function (req, res) {
    models.item.findAll({
      order: [['updatedAt', 'DESC']]
    }).then(function (sqlResult) {
      res.json(sqlResult)
    })
  })

  /**
   * @api {get} /inventory/search/available/:str Search available Items by name
   * @apiGroup Items
   * @apiParam {String} str Search term.
   * @apiSuccess {json} Item array with transactions
   */
  app.get('/api/v1/inventory/search/available/:str', function (req, res) {
    models.item.findAll({
      where: Sequelize.and(
        Sequelize.or(
          Sequelize.where(Sequelize.fn('unaccent', Sequelize.col('name')), {$ilike: utils.removeAccents(req.params.str) + '%'}),
          Sequelize.where(Sequelize.col('barcode'), {$ilike: '%' + req.params.str})
        ),
        Sequelize.where(Sequelize.col('stockAvailable'), {$gt: 0})
      ),
      include: [
        {model: models.transaction, as: 'stockCounts'},
        {model: models.transaction, as: 'lendings'}
      ],
      order: [['updatedAt', 'DESC']]
    }).then(function (sqlResult) {
      res.json(sqlResult)
    })
  })

  /**
   * @api {get} /inventory/search/:str Search Items by name
   * @apiGroup Items
   * @apiParam {String} str Search term.
   * @apiSuccess {json} Item array with transactions
   */
  app.get('/api/v1/inventory/search/:str', function (req, res) {
    models.item.findAll({
      where:
        Sequelize.or(
          Sequelize.where(Sequelize.fn('unaccent', Sequelize.col('name')), {$ilike: utils.removeAccents(req.params.str) + '%'}),
          Sequelize.where(Sequelize.col('barcode'), {$ilike: '%' + req.params.str})
        ),
      include: [
        {model: models.transaction, as: 'stockCounts'},
        {model: models.transaction, as: 'lendings'}
      ],
      order: [['updatedAt', 'DESC']]
    }).then(function (sqlResult) {
      res.json(sqlResult)
    })
  })

  /**
   * @api {get} /inventory/:id Get single Item
   * @apiGroup Items
   * @apiParam {Number} id Item ID.
   * @apiSuccess {json} Item with transactions
   */
  app.get('/api/v1/inventory/:id', function (req, res) {
    models.item.findOne({
      where: {id: req.params.id},
      include: [
        {model: models.transaction, as: 'stockCounts'},
        {model: models.transaction, as: 'lendings'}
      ]
    }).then(function (sqlResult) {
      res.json(sqlResult)
    })
  })

  // TODO : document this function
  /**
   * @apiIgnore
   * @api {post} /inventory Create Item
   * @apiGroup Items
   * @apiParam {Number} id Item ID.
   * @apiSuccess {json} Item with transactions
   */
  app.post('/api/v1/inventory', function (req, res) {
    models.item.create({
      name: req.body.name,
      model: req.body.model,
      brand: req.body.brand,
      serialNumber: req.body.serialNumber,
      inventoryNumber: req.body.inventoryNumber,
      acquisitionPrice: req.body.acquisitionPrice,
      acquisitionDate: req.body.acquisitionDate,
      description: req.body.description,
      isConsummable: req.body.isConsummable,
      stockMax: req.body.stockMax,
      stockAvailable: req.body.stockAvailable,
      stockUnit: req.body.stockUnit,
      stockStep: req.body.stockStep,
      itemLocationId: req.body.itemLocationId,
      itemCategoryId: req.body.itemCategoryId
    }).then(function (sqlResult) {
      res.send(sqlResult)
    })
  })

  // TODO : document this function
  /**
   * @apiIgnore
   * @api {post} /inventory Create Item
   * @apiGroup Items
   * @apiParam {Number} id Item ID.
   * @apiSuccess {json} Item with transactions
   */
  app.put('/api/v1/inventory/:id', function (req, res) {
    models.item.find({
      where: {
        id: req.params.id
      }
    }).then(function (item) {
      if (item) {
        item.updateAttributes({
          name: req.body.name,
          model: req.body.model,
          brand: req.body.brand,
          serialNumber: req.body.serialNumber,
          inventoryNumber: req.body.inventoryNumber,
          acquisitionPrice: req.body.acquisitionPrice,
          acquisitionDate: req.body.acquisitionDate,
          description: req.body.description,
          isConsummable: req.body.isConsummable,
          stockMax: req.body.stockMax,
          stockAvailable: req.body.stockAvailable,
          stockUnit: req.body.stockUnit,
          stockStep: req.body.stockStep,
          itemLocationId: req.body.itemLocationId,
          itemCategoryId: req.body.itemCategoryId
        }).then(function (sqlResult) {
          res.send(sqlResult)
        })
      }
    })
  })

  /**
   * @api {delete} /inventory/:id Delete Item
   * @apiGroup Items
   * @apiParam {Number} id Item ID.
   * @apiSuccess {Number} 200
   * @apiError {Number} 400
   */
  app.delete('/api/v1/inventory/:id', function (req, res) {
    models.item.destroy({where: {
      id: req.params.id
    }}).then(function (sqlResult) {
      res.sendStatus(sqlResult === 1 ? 200 : 400)
    })
  })
}
