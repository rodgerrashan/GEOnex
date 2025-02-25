// server.js - Main entry point
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./services/auth-service/routes/authRoutes');
const projectRoutes = require('./services/project-service/routes/projectRoutes');
const trackingRoutes = require('./services/tracking-service/routes/trackingRoutes');
const mqttService = require('./services/mqtt-service/mqttClient');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tracking', trackingRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Initialize MQTT connection
mqttService.init();
