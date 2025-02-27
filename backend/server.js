// server.js - Main entry point
const express = require('express');
require("dotenv").config();
const cors = require('cors');
const connectDB = require('./src/config/db');
// const authRoutes = require('./services/auth-service/routes/authRoutes');
const projectRoutes = require('./src/services/project-service/routes/projectRoutes');
const pointRoutes = require('./src/services/point-service/routes/pointRoutes');
// const trackingRoutes = require('./services/tracking-service/routes/trackingRoutes');
const mqttService = require('./src/services/mqtt-service/mqttClient');
const socketService = require('./src/services/socket-service/socketServer');


const { createProxyMiddleware } = require("http-proxy-middleware");



connectDB();

const app = express();
const server = require('http').createServer(app);
app.use(cors());
app.use(express.json());


// Routes
// app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/points', pointRoutes);
// app.use('/api/tracking', trackingRoutes);

// Initialize socket server
socketService.init(server);
// Initialize MQTT connection
mqttService.init();


const pointsUrl = process.env.API_POINTS_URL   
const projectsUrl = process.env.API_PROJECTS_URL 

// Proxy to the points
app.use('/api/points', createProxyMiddleware({ target: pointsUrl, changeOrigin: true }));
app.use('/api/projects', createProxyMiddleware({ target: projectsUrl, changeOrigin: true }));


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


