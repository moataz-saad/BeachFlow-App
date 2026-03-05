
const { connectDB, sequelize } = require("./src/config/db"); // ضفنا src لأن الملف لسه جوه

require('dotenv').config(); // هيقرأ الـ .env اللي جنبه فوراً

const app = require("./app"); // بقوا جيران


const start = async () => {
  await connectDB();
sequelize.sync()
  .then(() => {
    console.log("✅ Database updated Successfully!");
    // السطر ده مهم جداً عشان نتأكد إن السيرفر كمل وما وقفش هنا
    app.listen(5000, () => {
      console.log("🚀 Server is running on port 5000");
    });
  })
  .catch((err) => {
    console.error("❌ SQL Sync Error Details:");
    console.error(err); // هيطبع لك الخطأ بالتفصيل الممل
    process.exit(1); // عشان يقفل لو فيه خطأ فعلي
  });
};
start();


