(function () {
  'use strict'
  module.exports = function (sequelize, DataTypes) {
    var Location = sequelize.define('itemLocation', {
      description: DataTypes.STRING
    })
    return Location
  }
}())
