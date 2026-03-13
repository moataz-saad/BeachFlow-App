const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");


const Booking = sequelize.define("Booking", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  beachId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  bookingDate: { type: DataTypes.DATEONLY, allowNull: false },
  
  // الخانات الجديدة اللي ضفناها
  chairsCount: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0 
  },
  umbrellasCount: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0 
  },
  
  // الجزئية اللي سألت عليها (مظبوطة)
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
    defaultValue: 'confirmed'
  }
}, {
  timestamps: true, // دي اللي بتعمل createdAt و updatedAt تلقائياً
});
                                

module.exports = Booking;
