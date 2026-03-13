const QRCode = require('qrcode');
const { Booking, Beach, User } = require("../models/index");
exports.generateTicket = async (req, res, next) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findByPk(bookingId, {
            include: [
                { model: Beach, as: 'beach' }, // لازم يطابق اللي في الـ index.js حرفياً
                { model: User, as: 'user' }
            ]
});

        if (!booking) {
            return res.status(404).json({ message: "عفواً، لا يوجد حجز بهذا الرقم" });
        }

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
                customerName: booking.user.name, 
                beachName: booking.beach.name,   
                date: booking.bookingDate,
                totalPrice: booking.totalPrice,
                status: booking.status,
                qrCode: qrImage
            }
        });

    } catch (error) {
        console.error("Ticket Error:", error);
        next(error);
    }
};