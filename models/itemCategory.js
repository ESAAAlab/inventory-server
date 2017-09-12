(function () {
  'use strict'
  module.exports = function (sequelize, DataTypes) {
    var Category = sequelize.define('itemCategory', {
      description: DataTypes.STRING
    }, {
      classMethods: {
        associate: function (models) {
          Category.belongsTo(models.itemCategory, {as: 'parent'})
        }
      }
    })
    return Category
  }
}())
