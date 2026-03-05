const { Notification } = require('../models');
const { Op } = require('sequelize');

exports.getUserNotifications = async (req, res) => {
    try {
        // req.user.id بييجي من الـ Auth Middleware (التوكن)
        const userId = req.user.id; 

        const notifications = await Notification.findAll({
            where: {
                [Op.or]: [
                    { userId: userId }, // إشعاراتي أنا بس
                    { userId: null }    // إشعارات عامة (زي إضافة شاطئ جديد)
                ]
            },
            order: [['createdAt', 'DESC']] // الأحدث يظهر فوق
        });

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "فشل في جلب الإشعارات" });
    }
};