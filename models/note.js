(function () {
  'use strict'
  module.exports = function (sequelize, DataTypes) {
    var Note = sequelize.define('note', {
      type: DataTypes.STRING,
      description: DataTypes.STRING
    }, {
      classMethods: {
        associate: function (models) {
          Note.belongsToMany(models.user, {as: 'notes', through: 'userNotes'})
          Note.belongsToMany(models.item, {as: 'items', through: 'itemNotes'})
          Note.belongsToMany(models.item, {as: 'items', through: 'itemMaintenances'})
          Note.belongsToMany(models.item, {as: 'items', through: 'itemCommentaries'})
        }
      }
    })
    return Note
  }
}())
