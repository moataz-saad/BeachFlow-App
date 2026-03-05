const express = require("express");
const cors = require("cors");
const app = express();
const notificationRoutes = require('./src/routes/notification.routes'); 

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./src/routes/auth.routes"));
app.use("/api/beach", require("./src/routes/beach.routes"));
app.use("/api/bookings", require("./src/routes/booking.routes"));
app.use("/api/payment", require("./src/routes/payment.routes"));
app.use("/api/tickets", require("./src/routes/ticket.routes"));
app.use('/api/favorites', require('./src/routes/favorite.routes'));
app.use(require("./src/middleware/error.middleware"));
app.use('/api/notifications', notificationRoutes);
module.exports = app;