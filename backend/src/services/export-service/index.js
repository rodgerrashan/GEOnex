// src/services/user-service/index.js
const express = require('express');
const app = express();
require("dotenv").config();
const {connectDb} = require('./src/config/db');

const exportRoutes = require('./src/routes/exportRoutes');

app.use(express.json());
app.use('/api/export',exportRoutes);

connectDb();


const cors = require('cors');

// Allow all origins with credentials
app.use(cors({
  origin: true,  // allows all origins
  credentials: true // allow cookies/auth headers
}));

const PORT = process.env.SERVER_PORT || 5006;
app.listen(PORT, () => {
  console.log(`Export service running on port ${PORT}`);
}
);