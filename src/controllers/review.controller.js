const { Review, Beach } = require("../models");
const { sequelize } = require("../config/db"); 

exports.addReview = async (req, res, next) => {
  try {
    const { beachId, rating, comment } = req.body;
    const userId = req.user.id; 
    await Review.create({ 
      rating: parseFloat(rating), 
      comment, 
      userId,  
      beachId 
    });

    const stats = await Review.findAll({
      where: { beachId },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']
      ],
      raw: true
    });

    const avgValue = stats[0].avgRating || 0;
    const newAverage = parseFloat(avgValue).toFixed(1);

    await Beach.update(
      { rating: newAverage },
      { where: { id: beachId } }
    );

    res.status(201).json({ 
      status: "success", 
      message: "تم تسجيل تقييمك بنجاح!",
      data: {
        rating: newAverage,
        beachId
      }
    });

  } catch (error) {
    console.error("Error in addReview:", error);
    next(error);
  }
};