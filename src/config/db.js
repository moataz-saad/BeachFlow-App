const { Sequelize } = require("sequelize");
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

// Railway بتوفر متغير اسمه DATABASE_URL فيه كل حاجة
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // السطر ده هو اللي هيحل مشكلة الـ Crash في الربط
    }
  }
});

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
