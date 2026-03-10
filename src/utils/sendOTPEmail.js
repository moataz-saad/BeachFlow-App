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
  host: "smtp.gmail.com",
  port: 587,
  secure: true,
  auth: {
    user: userEmail,
    pass: userPass.replace(/\s/g, ""),
  },
  connectionTimeout: 10000, 
  greetingTimeout: 5000,
  socketTimeout: 10000,
  dnsTimeout: 5000,
  family: 4 
});

    const mailOptions = {
      from: `"Beach Flow" <${userEmail}>`,
      to: email,
      subject: "Verification Code",
      text: `Your OTP is: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center;">
          <h2>Welcome to Beach Flow</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #007bff;">${otp}</h1>
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

