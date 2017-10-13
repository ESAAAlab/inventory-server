(function () {
  'use strict'
  module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('user', {
      barcode: { type: DataTypes.STRING, unique: true },
      title: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      isRegistered: DataTypes.BOOLEAN,
      email: DataTypes.STRING,
      cellPhone: DataTypes.STRING,
      homePhone: DataTypes.STRING,
      workPhone: DataTypes.STRING,
      addressStreet: DataTypes.STRING,
      addressCity: DataTypes.STRING,
      addressState: DataTypes.STRING,
      addressPostcode: DataTypes.STRING,
      loginUsername: DataTypes.STRING,
      loginPassword: DataTypes.STRING,
      loginSalt: DataTypes.STRING,
      loginMD5: DataTypes.STRING,
      loginSHA1: DataTypes.STRING,
      loginSHA256: DataTypes.STRING
    }, {
      classMethods: {
        associate: function (models) {
          User.belongsTo(models.userType)
          User.belongsTo(models.studentYear)

          User.belongsToMany(models.document, {as: 'pictures', through: 'userPictures'})
          User.belongsToMany(models.document, {as: 'documents', through: 'userDocuments'})

          User.belongsToMany(models.note, {as: 'notes', through: 'userNotes'})

          User.belongsToMany(models.transaction, {as: 'lendings', through: 'userLendings'})
        }
      }
    })
    return User
  }
}())
