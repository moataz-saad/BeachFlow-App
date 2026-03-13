const nodemailer = require("nodemailer");

const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false, // بورت 587 في بريفو لازم يكون false
      auth: {
        user: process.env.EMAIL_USER, // اللي هو الـ Login في الصورة
        pass: process.env.EMAIL_PASS  // الـ SMTP Key اللي آخره f7DqFv
      }
    });

    const mailOptions = {
      from: `"Beach Flow" <no-reply@beachflow.com>`, // ممكن تغير ده لأي اسم
      to: email,
      subject: "Verification Code - Beach Flow",
      html: `
        <div style="font-family: sans-serif; text-align: center; direction: rtl;">
          <h2 style="color: #007bff;">أهلاً بك في Beach Flow</h2>
          <p>كود التحقق الخاص بك هو:</p>
          <h1 style="background: #f4f4f4; padding: 10px; display: inline-block;">${otp}</h1>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ الإيميل اتبعت بنجاح عن طريق Brevo!");
  } catch (error) {
    console.error("❌ فشل إرسال الإيميل:", error.message);
  }
};

module.exports = sendOTPEmail;
