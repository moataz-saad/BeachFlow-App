const axios = require('axios');
const { Booking, Beach, User } = require("../models/index");

exports.initiatePayment = async (req, res, next) => {
    try {
        const { bookingId } = req.body;

        // 1. جلب بيانات الحجز (بفضل العلاقات اللي عملناها)
        const booking = await Booking.findByPk(bookingId, {
            include: [
                { model: Beach, as: 'beach' },
                { model: User, as: 'user' }
            ]
        });

        if (!booking) return res.status(404).json({ message: "الحجز غير موجود" });

        // --- الخطوة 1: الحصول على الـ Authentication Token ---
        const authResponse = await axios.post('https://egypt.paymob.com/api/auth/tokens', {
            api_key: process.env.PAYMOB_API_KEY
        });
        const token = authResponse.data.token;

        // --- الخطوة 2: تسجيل الأوردر عند Paymob ---
        const orderResponse = await axios.post('https://egypt.paymob.com/api/ecommerce/orders', {
            auth_token: token,
            delivery_needed: "false",
            amount_cents: booking.totalPrice * 100, // بيموب بيتعامل بالقروش
            currency: "EGP",
            items: [] // ممكن تضيف فيها اسم الشاطئ لو حابب
        });
        const orderId = orderResponse.data.id;

        // --- الخطوة 3: الحصول على الـ Payment Key (اللي بيفتح الـ Iframe) ---
        const paymentKeyResponse = await axios.post('https://egypt.paymob.com/api/acceptance/payment_keys', {
            auth_token: token,
            amount_cents: booking.totalPrice * 100,
            expiration: 3600,
            order_id: orderId,
            billing_data: {
                first_name: booking.user.name.split(' ')[0] || "Guest",
                last_name: booking.user.name.split(' ')[1] || "User",
                email: booking.user.email,
                phone_number: "01000000000", // يفضل تخلي اليوزر يدخله في الحقيقة
                currency: "EGP",
                street: "NA",
                building: "NA",
                floor: "NA", 
                apartment: "NA", 
                city: "NA", 
                country: "NA"
            },
            currency: "EGP",
            integration_id: process.env.PAYMOB_INTEGRATION_ID
        });

        const paymentToken = paymentKeyResponse.data.token;

        // نبعت لليوزر الرابط اللي هيدفع من خلاله
        const paymentUrl = `https://egypt.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentToken}`;

        res.status(200).json({
            message: "تم تجهيز الدفع بنجاح",
            paymentUrl: paymentUrl
        });

    } catch (error) {
        console.error("Paymob Error:", error.response ? error.response.data : error.message);
        next(error);
    }
};