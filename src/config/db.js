const { Sequelize } = require("sequelize");
// بما إن الملف ده جوه src/config، هنرجع مرتين لورا عشان نلاقي الـ .env
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });





// الربط باستخدام البيانات المفصلة من ملف .env
const sequelize = new Sequelize(
  process.env.DB_NAME,     // Beach-Flow-App
  process.env.DB_USER,     // postgres
  process.env.DB_PASSWORD, // zezo123
  {
    host: process.env.DB_HOST, // localhost
    port: process.env.DB_PORT, // 5432
    dialect: "postgres",
    logging: false, 
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL Connected Successfully!");
  } catch (error) {
    console.error("❌ Database Connection Error:", error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };