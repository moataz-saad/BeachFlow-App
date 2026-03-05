const QRCode = require('qrcode');
// تأكد من المسار ده (لازم يروح لملف الـ index اللي جوه الـ models)
const { Booking, Beach, User } = require("../models/index");
exports.generateTicket = async (req, res, next) => {
    try {
        const { bookingId } = req.params;

        // 1. جلب بيانات الحجز مع العلاقات
const booking = await Booking.findByPk(bookingId, {
    include: [
        { model: Beach, as: 'beach' }, // لازم يطابق اللي في الـ index.js حرفياً
        { model: User, as: 'user' }
    ]
});

        // 2. تأكد إن الحجز موجود
        if (!booking) {
            return res.status(404).json({ message: "عفواً، لا يوجد حجز بهذا الرقم" });
        }

        // 3. تأكد إن بيانات اليوزر والشاطئ موجودة (Check for null)
        if (!booking.user || !booking.beach) {
            return res.status(400).json({ 
                message: "بيانات الحجز غير مكتملة (يوجد نقص في بيانات المستخدم أو الشاطئ)",
                debug: {
                    hasUser: !!booking.user,
                    hasBeach: !!booking.beach
                }
            });
        }

        // 4. لو كله تمام، ولد الـ QR Code
        const ticketData = JSON.stringify({
            ticketId: booking.id,
            customer: booking.user.name,
            beach: booking.beach.name,
            date: booking.bookingDate,
            status: booking.status
        });

        const qrImage = await QRCode.toDataURL(ticketData);

        res.status(200).json({
            message: "تم توليد التذكرة",
            data: {
                bookingId: booking.id,
                customerName: booking.user.name, // المفروض يظهر "معتز" مثلاً
                beachName: booking.beach.name,   // اسم الشاطئ
                date: booking.bookingDate,
                totalPrice: booking.totalPrice,
                status: booking.status,
                qrCode: qrImage // كود الصورة
            }
        });

    } catch (error) {
        console.error("Ticket Error:", error);
        next(error);
    }
};