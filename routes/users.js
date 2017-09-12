import models from '../models/index'
import md5 from 'md5'

module.exports = function (app) {
  /**
   * @api {get} /users Get all Users
   * @apiGroup Users
   * @apiSuccess {json} User array, with studentYear, profilePic and transactions
   */
  app.get('/api/v1/users', function (req, res) {
    models.user.findAll({
      include: [
        {model: models.userType, where: {description: 'Étudiant'}},
        {model: models.studentYear},
        {model: models.document, as: 'pictures', where: {type: 'userProfilePic'}},
        {model: models.transaction, as: 'lendings', where: {type: 'lending'}, required: false}
      ],
      order: [['lastName', 'ASC']]
    }).then(function (sqlResult) {
      res.json(sqlResult)
    })
  })

  /**
   * @api {get} /user/name/:str Find user by lastName
   * @apiGroup Users
   * @apiParam {String} str Search term.
   * @apiSuccess {json} User array, with studentYear, profilePic and transactions
   */
  app.get('/api/v1/user/name/:str', function (req, res) {
    models.user.findAll({
      where: {
        $or: {
          lastName: {$ilike: req.params.str + '%'},
          firstName: {$ilike: req.params.str + '%'},
          barcode: {$ilike: '%' + req.params.str}
        }
      },
      order: [['lastName', 'ASC']],
      include: [
        {model: models.userType, where: {description: 'Étudiant'}},
        {model: models.studentYear},
        {model: models.document, as: 'pictures', where: {type: 'userProfilePic'}, required: false},
        {model: models.transaction, as: 'lendings', where: {type: 'lending'}, required: false}
      ]
    }).then(function (sqlResult) {
      res.json(sqlResult)
    })
  })

  /**
   * @api {get} /user/:id Get single User by ID
   * @apiGroup Users
   * @apiParam {Number} id User ID.
   * @apiSuccess {json} User with studentYear, profilePic and transactions
   */
  app.get('/api/v1/user/:id', function (req, res) {
    models.user.findOne({
      where: {id: req.params.id},
      include: [
        {model: models.userType, where: {description: 'Étudiant'}},
        {model: models.studentYear},
        {model: models.document, as: 'pictures', where: {type: 'userProfilePic'}, required: false},
        {model: models.transaction, as: 'lendings', where: {type: 'lending', ended: false}, required: false}
      ],
      order: [['lastName', 'ASC']]
    }).then(function (sqlResult) {
      res.json(sqlResult)
    })
  })

  // TODO : document this method
  /**
   * @apiIgnore unfinished method
   * @api {post} /user Create User
   * @apiGroup Users
   * @apiParam {Number} id User ID.
   * @apiSuccess {json} User with studentYear, profilePic and transactions
   */
  app.post('/api/v1/user', function (req, res) {
    models.user.create({
      barcode: md5(req.body.firstName + req.body.lastName),
      title: req.body.title,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      isRegistered: req.body.isRegistered,
      email: req.body.email,
      cellPhone: req.body.cellPhone,
      homePhone: req.body.homePhone,
      addressStreet: req.body.addressStreet,
      addressCity: req.body.addressCity,
      addressState: req.body.addressState,
      addressPostcode: req.body.addressPostcode,
      loginUsername: req.body.loginUsername,
      loginPassword: req.body.loginPassword, // FOR DEVELOPMENT ONLY, MUST BE REMOVED IN PRODUCTION
      loginSalt: req.body.loginSalt,
      loginMD5: req.body.loginMD5,
      loginSHA1: req.body.loginSHA1,
      loginSHA256: req.body.loginSHA256,
      userTypeId: req.body.userTypeId,
      studentYearId: req.body.studentYearId
    }).then(function (sqlResult) {
      res.send(sqlResult)
    })
  })

  // TODO : document this method
  /**
   * @apiIgnore unfinished method
   * @api {put} /user/:id Update User
   * @apiGroup Users
   * @apiParam {Number} id User ID.
   * @apiSuccess {json} User with studentYear, profilePic and transactions
   */
  app.put('/api/v1/user/:id', function (req, res) {
    models.user.find({
      where: {
        id: req.params.id
      }
    }).then(function (item) {
      if (item) {
        item.updateAttributes({
          barcode: md5(req.body.firstName + req.body.lastName),
          title: req.body.title,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          isRegistered: req.body.isRegistered,
          email: req.body.email,
          cellPhone: req.body.cellPhone,
          homePhone: req.body.homePhone,
          addressStreet: req.body.street,
          addressCity: req.body.city,
          addressState: req.body.state,
          addressPostcode: req.body.postcode,
          loginUsername: req.body.username,
          loginPassword: req.body.password, // FOR DEVELOPMENT ONLY, MUST BE REMOVED IN PRODUCTION
          loginSalt: req.body.salt,
          loginMD5: req.body.md5,
          loginSHA1: req.body.sha1,
          loginSHA256: req.body.sha256,
          userTypeId: req.body.userTypeId,
          studentYearId: req.body.studentYearId
        }).then(function (sqlResult) {
          res.send(sqlResult)
        })
      }
    })
  })

  /**
   * @api {delete} /user/:id Delete User
   * @apiGroup Users
   * @apiParam {Number} id User ID.
   * @apiSuccess {Number} 200
   * @apiError {Number} 400
   */
  app.delete('/api/v1/user/:id', function (req, res) {
    models.user.destroy({where: {
      id: req.params.id
    }}).then(function (sqlResult) {
      res.sendStatus(sqlResult === 1 ? 200 : 400)
    })
  })
}
