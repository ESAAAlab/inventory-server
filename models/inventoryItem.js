(function () {
  'use strict'
  module.exports = function (sequelize, DataTypes) {
    var InventoryItem = sequelize.define('item', {
      name: DataTypes.STRING,
      model: DataTypes.STRING,
      brand: DataTypes.STRING,
      serialNumber: DataTypes.STRING,
      materialCode: DataTypes.STRING,
      barcode: DataTypes.STRING,
      inventoryNumber: DataTypes.STRING,
      acquisitionPrice: DataTypes.DOUBLE,
      acquisitionDate: DataTypes.DATE,
      description: DataTypes.TEXT,
      isConsumable: DataTypes.BOOLEAN,
      stockMax: DataTypes.DOUBLE,
      stockAvailable: DataTypes.DOUBLE,
      stockStep: DataTypes.DOUBLE,
      stockUnit: DataTypes.STRING
    }, {
      classMethods: {
        associate: function (models) {
          InventoryItem.belongsTo(models.itemCategory)
          InventoryItem.belongsTo(models.supplier)
          InventoryItem.belongsTo(models.supplier, {as: 'manufacturer'})
          InventoryItem.belongsTo(models.itemLocation)

          InventoryItem.belongsToMany(models.document, {as: 'pictures', through: 'itemPictures'})
          InventoryItem.belongsToMany(models.document, {as: 'documents', through: 'itemDocuments'})
          InventoryItem.belongsToMany(models.note, {as: 'notes', through: 'itemNotes'})
          InventoryItem.belongsToMany(models.note, {as: 'maintenance', through: 'itemMaintenances'})
          InventoryItem.belongsToMany(models.note, {as: 'commentary', through: 'itemCommentaries'})

          InventoryItem.belongsToMany(models.transaction, {as: 'lendings', through: 'itemLendings'})
          InventoryItem.belongsToMany(models.transaction, {as: 'stockCounts', through: 'itemStock'})
        }
      }
    })
    return InventoryItem
  }
}())
