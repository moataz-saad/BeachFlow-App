const { connectDB, sequelize } = require("./src/config/db"); 
require('dotenv').config(); 
const app = require("./app"); 


const start = async () => {
  await connectDB();
sequelize.sync()
  .then(() => {
    console.log("✅ Database updated Successfully!");
    app.listen(3000, () => {
      console.log("🚀 Server is running on port 5000");
    });
  })
  .catch((err) => {
    console.error(" SQL Sync Error Details:");
    console.error(err); 
    process.exit(1); 
  });
};
start();


