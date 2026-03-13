const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// تأكد أن الوظائف (register, login, verifyOTP) موجودة فعلاً في الـ controller
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/verify", authController.verifyOTP);

module.exports = router;