const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

// Get user profile
router.get("/profile", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "User profile fetched",
    user: req.user
  });
});

// Update user profile
router.put("/profile", authMiddleware, (req, res) => {
  // مجرد مثال تجريبي، لسه ما فيش DB
  const { name, email } = req.body;
  req.user.name = name || req.user.name;
  req.user.email = email || req.user.email;

  res.status(200).json({
    message: "User profile updated",
    user: req.user
  });
});

module.exports = router;