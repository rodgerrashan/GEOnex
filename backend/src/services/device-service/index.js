// src/services/user-service/index.js
const express = require('express');
const app = express();
require("dotenv").config();
const {connectDb} = require('./src/config/db');

const deviceRouter = require('./src/routes/deviceRoutes');

app.use(express.json());
app.use('/api/devices',deviceRouter);

connectDb();

const cors = require('cors');

// Allow all origins with credentials
app.use(cors({
  origin: true,  // allows all origins
  credentials: true // allow cookies/auth headers
}));

const PORT = process.env.SERVER_PORT || 5003;
app.listen(PORT, () => {
  console.log(`Device service running on port ${PORT}`);
});


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'device-service' });
});