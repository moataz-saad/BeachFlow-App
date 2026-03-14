const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); 

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('beach_added', 'beach_updated', 'booking_confirmed'),
        defaultValue: 'beach_added'
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'Notifications' // عشان نضمن إنه يقرأ الجدول اللي عملناه يدوي
});

module.exports = Notification;