const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/db');// تأكد من مسار قاعدة البيانات

const Favorite = sequelize.define('Favorite', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
    // الـ userId والـ beachId هيتحطوا أوتوماتيك من الـ Associations
});

module.exports = Favorite;