(function () {
  'use strict'
  module.exports = function (sequelize, DataTypes) {
    var Document = sequelize.define('document', {
      type: DataTypes.STRING,
      content: DataTypes.TEXT
    }, {
      classMethods: {
        associate: function (models) {
          Document.belongsToMany(models.user, {as: 'users', through: 'userPictures'})
          Document.belongsToMany(models.user, {as: 'users', through: 'userDocuments'})

          Document.belongsToMany(models.item, {as: 'items', through: 'itemPictures'})
          Document.belongsToMany(models.item, {as: 'items', through: 'itemDocuments'})
        }
      }
    })
    return Document
  }
}())
