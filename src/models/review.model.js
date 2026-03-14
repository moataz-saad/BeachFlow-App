module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define("Review", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    rating: {
      type: DataTypes.FLOAT, // عشان يسمح بكسور زي 4.5
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    // الـ userId والـ beachId هيتضافوا تلقائياً لما نعمل الـ Associations
  });

  return Review;
};