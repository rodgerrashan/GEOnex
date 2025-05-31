// src/services/user-service/index.js
const express = require('express');
const app = express();
require("dotenv").config();
const {connectDb} = require('./src/config/db');

const notificationRouter = require('./src/routes/notificationRoutes');

app.use(express.json());
app.use('/api/notifications',notificationRouter);

connectDb();


const PORT = process.env.SERVER_PORT || 5008;
app.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
});
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'notification-service' });
});