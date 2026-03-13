const { Booking, Beach, Notification } = require('../models/index');

exports.createBooking = async (req, res, next) => {
    try {
        // بنستلم عدد الكراسي والشمسيات من اليوزر
        const { beachId, bookingDate, chairsCount = 0, umbrellasCount = 0 } = req.body;

        const beach = await Beach.findByPk(beachId);
        if (!beach) return res.status(404).json({ message: "الشاطئ غير موجود" });

        // 1. حساب السعر الإجمالي بأمان في السيرفر
        let calculatedPrice = beach.price; // سعر دخول الفرد/التذكرة الأساسية

        // لو الشاطئ فيه كراسي واليوزر طلب كراسي، نضيف سعرهم
        if (beach.hasChairs && chairsCount > 0) {
            calculatedPrice += (chairsCount * beach.chairPrice);
        }

        // لو الشاطئ فيه شمسيات واليوزر طلب شمسيات، نضيف سعرهم
        if (beach.hasUmbrellas && umbrellasCount > 0) {
            calculatedPrice += (umbrellasCount * beach.umbrellaPrice);
        }

        // 2. التحقق من السعة الاستيعابية
        const confirmedBookingsCount = await Booking.count({
            where: {
                beachId: beachId,
                bookingDate: bookingDate,
                status: 'confirmed'
            }
        });

        const availableSlots = beach.maxCapacity - confirmedBookingsCount;

        if (availableSlots <= 0) {
            return res.status(400).json({ 
                message: `نعتذر، الشاطئ مكتمل العدد في تاريخ ${bookingDate}` 
            });
        }

        // 3. إنشاء الحجز بالسعر المحسوب
        const newBooking = await Booking.create({
            beachId,
            userId: req.user.id,
            bookingDate,
            chairsCount,      // حفظ العدد في الداتا بيز
            umbrellasCount,   // حفظ العدد في الداتا بيز
            totalPrice: calculatedPrice, // السعر النهائي
            status: 'confirmed'
        });

        // 4. إرسال الإشعار
        await Notification.create({
            userId: req.user.id, 
            title: "تم تأكيد حجزك ✅",
            message: `تم حجز شاطئ ${beach.name}. السعر الإجمالي: ${calculatedPrice} ج.م. استمتع بيومك!`,
            type: 'booking_confirmed'
        });

        res.status(201).json({
            message: "✅ تم الحجز بنجاح",
            booking: newBooking,
            remainingSlots: availableSlots - 1
        });

    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ message: "حدث خطأ أثناء الحجز", error: error.message });
    }
};
