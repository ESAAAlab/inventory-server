(function () {
  'use strict'
  module.exports = function (sequelize, DataTypes) {
    var UserType = sequelize.define('userType', {
      description: DataTypes.STRING
    })
    return UserType
  }
}())
