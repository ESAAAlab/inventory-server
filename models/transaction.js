(function () {
  'use strict'

  module.exports = function (sequelize, DataTypes) {
    var Transaction = sequelize.define('transaction', {
      type: DataTypes.STRING,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      quantity: DataTypes.DOUBLE,
      effectiveEndDate: DataTypes.DATE,
      ended: DataTypes.BOOLEAN
    }, {
      classMethods: {
        associate: function (models) {
          Transaction.hasMany(models.note, {as: 'Notes'})
          Transaction.hasMany(models.document, {as: 'Pictures'})

          Transaction.belongsToMany(models.user, {as: 'lendings', through: 'userLendings'})

          Transaction.belongsToMany(models.item, {as: 'transactions', through: 'itemLendings'})
          //   Transaction.belongsToMany(models.item,{as:'items', through:'itemStock'});
        }
      }
    })
    return Transaction
  }
}())
