const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

module.exports = sequelize.define("Beach", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING },
  price: { type: DataTypes.FLOAT },
  imageUrl: { type: DataTypes.STRING },
  description: {
    type: DataTypes.TEXT,
    allowNull: true},
  adminId: {
    type: DataTypes.INTEGER,
    references: {
    model: 'Users',
    key: 'id',
    allowNull: true
  }
},maxCapacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100
},
  rating: {
  type: DataTypes.FLOAT,
  defaultValue: 0 
},
hasChairs: { type: DataTypes.BOOLEAN, defaultValue: false },
chairPrice: { type: DataTypes.FLOAT, defaultValue: 0 },
hasUmbrellas: { type: DataTypes.BOOLEAN, defaultValue: false },
umbrellaPrice: { type: DataTypes.FLOAT, defaultValue: 0 },
});

