const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const authMiddleware = require('../middleware/auth.middleware'); // الميدل وير بتاعك

// لازم authMiddleware يكون موجود هنا عشان يملى req.user
router.get('/my-notifications', authMiddleware, notificationController.getUserNotifications);

module.exports = router;