const nodemailer = require("nodemailer");

const sendOTPEmail = async (email, otp) => {
  try {
    const userEmail = process.env.EMAIL_USER;
    const userPass = process.env.EMAIL_PASS;

    if (!userEmail || !userPass) {
      console.error("❌ ERROR: EMAIL_USER or EMAIL_PASS missing");
      return; 
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: userEmail,
        pass: userPass.trim().replace(/\s/g, ""),
      },
      pool: true, 
      maxConnections: 1,
      family: 4,
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: `"Beach Flow" <${userEmail}>`,
      to: email,
      subject: "Verification Code",
      html: `
        <div style="font-family: sans-serif; text-align: center; padding: 20px;">
          <h2>Welcome to Beach Flow</h2>
          <p>Your code is: <b style="font-size: 24px; color: #007bff;">${otp}</b></p>
        </div>
      `,
    };

    // جرب نستخدم callback عشان نشوف الإيرور بوضوح لو حصل
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("❌ Nodemailer Error Detail:", error.message);
          reject(error);
        } else {
          console.log("✅ Email Sent: " + info.response);
          resolve(info);
        }
      });
    });

  } catch (error) {
    console.error("❌ Catch Block Error:", error.message);
  }
};

module.exports = sendOTPEmail;
