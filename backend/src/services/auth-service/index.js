const express = require('express');
const app = express();
require("dotenv").config();
const connectDB = require('./src/config/db');
const cookieParser = require('cookie-parser');


const cors = require('cors');

// Allow all origins with credentials
app.use(cors({
  origin: true,  // allows all origins
  credentials: true // allow cookies/auth headers
}));

app.use(express.json());
app.use(cookieParser());

const authRouter = require('./src/routes/authRoutes');
const userRouter = require('./src/routes/userRoutes');

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

connectDB();

const PORT = process.env.USER_SERVICE_PORT || 5002;
app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'auth-service' });
});
