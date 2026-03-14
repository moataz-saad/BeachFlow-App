const { Review, Beach } = require("../models");
const { sequelize } = require("../config/db"); 

exports.addReview = async (req, res, next) => {
  try {
    const { beachId, rating, comment } = req.body;
    const userId = req.user.id; 
    
    await Review.create({ 
      rating, 
      comment, 
      UserId: userId,  
      BeachId: beachId 
    });
    const stats = await Review.findAll({
      where: { beachId },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']
      ],
      raw: true
    });

    const newAverage = parseFloat(stats[0].avgRating).toFixed(1);
    await Beach.update(
      { rating: newAverage },
      { where: { id: beachId } }
    );

    res.status(201).json({ 
      status: "success", 
      message: "شكراً لتقييمك!",
      newAverage 
    });
  } catch (error) {
    next(error);
  }
};