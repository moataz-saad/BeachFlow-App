const nodemailer = require("nodemailer");
const sendOTPEmail = async (email, otp) => {
  try {
    const emailPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s/g, "") : "";
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, 
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: emailPass, 
      },
    });

    const mailOptions = {
      from: `"Beach Flow" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verification Code",
      text: `Your OTP is: ${otp}`,
      html: `<b>Your verification code is: ${otp}</b>`, // يفضل إضافة HTML برضه
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email Sent: " + info.response);
  } 
  catch (error) {
    console.error("❌ Nodemailer Details:", error.message);
    throw error; 
  }
};

module.exports = sendOTPEmail;





// const sendOTPEmail = async (email, otp) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 465, // منفذ Gmail الآمن
//       secure: true, 
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS.replace(/\s/g, ""), // بيمسح أي مسافات أوتوماتيك لو نسيت
//       },
//     });

//     const mailOptions = {
//       from: `"Beach Flow" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Verification Code",
//       text: `Your OTP is: ${otp}`,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log("✅ Email Sent: " + info.response);
//   } catch (error) {
//     console.error("❌ Nodemailer Details:", error.message);
//     throw error; // بنرمي الخطأ عشان الـ Controller يحس بيه
//   }
// };

// module.exports = sendOTPEmail;
