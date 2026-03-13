const { Beach, User, Booking } = require("../models/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendOTPEmail = require("../utils/sendOTPEmail");


exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await User.create({ name, email, password: hashedPassword, otp });
    await sendOTPEmail(email, otp);
    res.status(201).json({ message: "تم التسجيل، تفقد إيميلك للكود" });
  }
  catch (error) {    
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
            status: "fail",
            message: "هذا البريد الإلكتروني مسجل لدينا بالفعل"
        });
    }
    console.error(error);
    res.status(500).json({
        status: "error",
        message: "حدث خطأ ما في السيرفر"
    });
}
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) 
        return res.status(401).json({ message: "بيانات خطأ" });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || "SECRET_KEY");
    res.json({ token, user });
  } catch (err) { next(err); }
};

exports.verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ where: { email, otp } });
        if (!user) return res.status(400).json({ message: "كود غير صحيح" });
        user.isVerified = true;
        user.otp = null;
        await user.save();
        res.json({ message: "تم تفعيل الحساب بنجاح" });
    } catch (err) { next(err); }
};
