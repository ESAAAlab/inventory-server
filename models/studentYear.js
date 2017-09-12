(function () {
  'use strict'
  module.exports = function (sequelize, DataTypes) {
    var StudentYear = sequelize.define('studentYear', {
      year: DataTypes.INTEGER,
      section: DataTypes.STRING,
      description: DataTypes.STRING
    })
    return StudentYear
  }
}())
