const nodemailer = require("nodemailer");

const sendOTPEmail = async (email, otp) => {
  try {
    const userEmail = process.env.EMAIL_USER;
    const userPass = process.env.EMAIL_PASS;

    if (!userEmail || !userPass) {
      console.error("❌ ERROR: EMAIL_USER or EMAIL_PASS is not defined in Railway Variables!");
      return; 
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: userEmail,
        pass: userPass.trim().replace(/\s/g, ""),
      },
      tls: {
        rejectUnauthorized: false 
      }
    });

    const mailOptions = {
      from: `"Beach Flow" <${userEmail}>`,
      to: email,
      subject: "Verification Code - Beach Flow",
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #007bff;">Welcome to Beach Flow</h2>
          <p>Your verification code is:</p>
          <h1 style="background: #f8f9fa; display: inline-block; padding: 10px 20px; border-radius: 5px; letter-spacing: 2px;">${otp}</h1>
          <p>This code will expire shortly.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email Sent successfully: " + info.response);
  } catch (error) {
    console.error("❌ Nodemailer Error Detail:", error.message);
  }
};

module.exports = sendOTPEmail;
