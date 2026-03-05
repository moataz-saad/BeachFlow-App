const { Booking, Beach,Notification } = require('../models/index');

exports.createBooking = async (req, res, next) => {
    try {
        const { beachId, bookingDate, totalPrice } = req.body;

        // 1. نجيب بيانات الشاطئ وسعته القصوى
        const beach = await Beach.findByPk(beachId);
        if (!beach) return res.status(404).json({ message: "الشاطئ غير موجود" });

        // 2. نحسب عدد الحجوزات المؤكدة في التاريخ المختار لهذا الشاطئ
        const confirmedBookingsCount = await Booking.count({
            where: {
                beachId: beachId,
                bookingDate: bookingDate, // التاريخ اللي اليوزر اختاره من Flutter
                status: 'confirmed'
            }
        });
        // بعد نجاح إنشاء الحجز وتأكيده
        await Notification.create({
            userId: req.user.id, // الإشعار لليوزر ده بس
            title: "تم تأكيد حجزك ✅",
            message: `حجزك في شاطئ ${beach.name} بتاريخ ${bookingDate} أصبح مؤكداً. استمتع بيومك!`,
            type: 'booking_confirmed'
        });

        // 3. نتحقق هل فيه مكان فاضي؟
        const availableSlots = beach.maxCapacity - confirmedBookingsCount;

        if (availableSlots <= 0) {
            return res.status(400).json({ 
                message: `نعتذر، الشاطئ مكتمل العدد في تاريخ ${bookingDate}` 
            });
        }

        // 4. إنشاء الحجز إذا كان متاحاً
        const newBooking = await Booking.create({
            beachId,
            userId: req.user.id,
            bookingDate,
            totalPrice,
            status: 'confirmed'
        });

        res.status(201).json({
            message: "✅ تم الحجز بنجاح",
            bookingId: newBooking.id,
            remainingSlotsForToday: availableSlots - 1
        });

    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ message: "حدث خطأ أثناء الحجز", error: error.message });
    }
};












// exports.createBooking = async (req, res, next) => {
//     try {
//         const { beachId, bookingDate, totalPrice } = req.body;

//         // 1. إنشاء الحجز في قاعدة البيانات
//         const newBooking = await Booking.create({
//             beachId: beachId,
//             userId: req.user.id, // بييجي من الـ Token
//             bookingDate: bookingDate,
//             totalPrice: totalPrice,
//             status: 'confirmed' // هنخليها confirmed فوراً عشان نجرب التذكرة حالاً
//         });

//         // 2. رد مؤقت بدل ما نكلم Paymob اللي مطلع 403
//         res.status(201).json({
//             message: "✅ تم إنشاء الحجز بنجاح (وضع التجربة)",
//             bookingId: newBooking.id,
//             status: newBooking.status
//         });

//     } catch (error) {
//         console.error("Error creating booking:", error);
//         res.status(500).json({ message: "فشل إنشاء الحجز", error: error.message });
//     }
// };

exports.getUserBookings = async (req, res, next) => {
    try {
        // بنجيب كل الحجوزات اللي الـ userId بتاعها هو نفس اليوزر اللي عامل Token
        const bookings = await Booking.findAll({
            where: { userId: req.user.id },
            include: [
                {
                    model: Beach,
                    as: 'beach',
                    attributes: ['id', 'name', 'location', 'imageUrl'] // اختار البيانات اللي تظهر عن الشاطئ
                }
            ],
            order: [['createdAt', 'DESC']] // عشان الحجوزات الجديدة تظهر فوق
        });

        if (!bookings || bookings.length === 0) {
            return res.status(200).json({
                message: "ليس لديك أي حجوزات حالياً",
                bookings: []
            });
        }

        res.status(200).json({
            message: "تم جلب الحجوزات بنجاح",
            count: bookings.length,
            bookings: bookings
        });
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({ message: "حدث خطأ أثناء جلب الحجوزات", error: error.message });
    }
};















// const { Booking, Beach, User } = require("../models/index");

// const axios = require('axios'); // هتحتاج تثبت axios: npm install axios

// exports.createBooking = async (req, res, next) => {
// // داخل ملف الـ controller
// try {
//     const authResponse = await axios.post('https://accept.paymob.com/api/auth/tokens', 
//     {
//         api_key: "egy_sk_test_e6b63131df236499e4b8c1179749a5439ad1b0e8065f15bbef958b7934d96c0d==" // جرب تحطه يدوي المرة دي للتأكد
//     }, 
//     {
//         headers: { 'Content-Type': 'application/json' }
//     });

//     const token = authResponse.data.token;
//     console.log("✅ Success! Token is:", token);

// } catch (error) {
//     console.log("❌ Paymob Error Details:", error.response?.data || error.message);
//     next(error);
// }
// };

// exports.getUserBookings = async (req, res, next) => {
//     try {
//         res.status(200).json({ message: "هنا ستظهر حجوزاتك" });
//     } catch (error) { next(error); }
// };