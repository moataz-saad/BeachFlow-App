const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Booking = sequelize.define("Booking", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  bookingDate: {
    type: DataTypes.DATEONLY, 
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "confirmed", "canceled"),
    defaultValue: "pending",
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  timestamps: true,
},
chairsCount: { type: DataTypes.INTEGER, defaultValue: 0 },
umbrellasCount: { type: DataTypes.INTEGER, defaultValue: 0 },
totalPrice: { type: DataTypes.FLOAT, allowNull: false }
);
                                

module.exports = Booking;
