const express = require('express');
const app = express();
require("dotenv").config();
const connectDB = require('./src/config/db');
const cookieParser = require('cookie-parser');


const cors = require('cors');


// Trust proxy (EC2 + HTTPS via Nginx or ALB)
app.set('trust proxy', 1);


const allowedOrigins = [
  'http://localhost:5173',           // For local dev
  'https://geonex.vercel.app'        // For production
];

// app.use(cors({
//   origin: [
//     'http://localhost:5173',
//     'https://geonex.site',
//     'https://api.geonex.site',
//     'https://www.geonex.site'
//   ],
//   credentials: true
// }));

app.use(cors({
  origin: true, // Allow all origins temporarily
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());

const authRouter = require('./src/routes/authRoutes');
const userRouter = require('./src/routes/userRoutes');

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'auth-service' });
});


const PORT = process.env.USER_SERVICE_PORT || 5002;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`User service running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect to database:', err);
});
