(function () {
  'use strict'
  module.exports = function (sequelize, DataTypes) {
    var Supplier = sequelize.define('supplier', {
      companyName: DataTypes.STRING,
      isManufacturer: DataTypes.BOOLEAN,
      email: DataTypes.STRING,
      phone1: DataTypes.STRING,
      phone2: DataTypes.STRING,
      addressStreetNum: DataTypes.STRING,
      addressField1: DataTypes.STRING,
      addressField2: DataTypes.STRING,
      addressField3: DataTypes.STRING
    }, {
      classMethods: {
        associate: function (models) {
          Supplier.hasMany(models.user, {as: 'Contacts'})
          Supplier.hasMany(models.document, {as: 'Pictures'})
          Supplier.hasMany(models.document, {as: 'Documents'})
          Supplier.hasMany(models.note, {as: 'Notes'})
        }
      }
    })
    return Supplier
  }
}())
