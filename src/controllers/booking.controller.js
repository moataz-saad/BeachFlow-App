const { Booking, Beach, Notification } = require('../models/index');

// 1. دالة إنشاء حجز جديد (POST)
exports.createBooking = async (req, res, next) => {
    try {
        const { beachId, bookingDate, chairsCount = 0, umbrellasCount = 0 } = req.body;

        const beach = await Beach.findByPk(beachId);
        if (!beach) return res.status(404).json({ message: "الشاطئ غير موجود" });

        let calculatedPrice = beach.price; 

        if (beach.hasChairs && chairsCount > 0) {
            calculatedPrice += (chairsCount * beach.chairPrice);
        }

        if (beach.hasUmbrellas && umbrellasCount > 0) {
            calculatedPrice += (umbrellasCount * beach.umbrellaPrice);
        }

        const confirmedBookingsCount = await Booking.count({
            where: { beachId, bookingDate, status: 'confirmed' }
        });

        const availableSlots = beach.maxCapacity - confirmedBookingsCount;
        if (availableSlots <= 0) {
            return res.status(400).json({ message: `نعتذر، الشاطئ مكتمل العدد في تاريخ ${bookingDate}` });
        }

        const newBooking = await Booking.create({
            beachId,
            userId: req.user.id,
            bookingDate,
            chairsCount,
            umbrellasCount,
            totalPrice: calculatedPrice,
            status: 'confirmed'
        });

        await Notification.create({
            userId: req.user.id, 
            title: "تم تأكيد حجزك ✅",
            message: `تم حجز شاطئ ${beach.name}. السعر: ${calculatedPrice} ج.م.`,
            type: 'booking_confirmed'
        });

        res.status(201).json({ message: "✅ تم الحجز بنجاح", booking: newBooking });

    } catch (error) {
        console.error("Create Booking Error:", error);
        res.status(500).json({ message: "حدث خطأ أثناء الحجز", error: error.message });
    }
};

// 2. دالة جلب حجوزات المستخدم (GET)
exports.getUserBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.findAll({
            where: { userId: req.user.id },
            include: [{ model: Beach, as: 'beach', attributes: ['name', 'location', 'imageUrl'] }],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({ bookings });
    } catch (error) {
        console.error("Get Bookings Error:", error);
        res.status(500).json({ message: "حدث خطأ أثناء جلب الحجوزات" });
    }
};
