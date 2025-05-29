// src/services/user-service/index.js
const express = require('express');
const app = express();
require("dotenv").config();
const connectDB = require('./src/config/db');

const authRouter = require('./src/routes/authRoutes');
const userRouter = require('./src/routes/userRoutes');

app.use(express.json());
app.use('/api/user', userRouter);
app.use('/api/auth',authRouter);

connectDB();


const PORT = process.env.USER_SERVICE_PORT || 5002;
app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});
