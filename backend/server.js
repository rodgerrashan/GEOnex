// server.js - Main entry point
const express = require('express');
require("dotenv").config();
const cors = require('cors');
const connectDB = require('./src/config/db');
const projectRoutes = require('./src/services/project-service/routes/projectRoutes');
const pointRoutes = require('./src/services/point-service/routes/pointRoutes');
const mqttService = require('./src/services/mqtt-service/mqttClient');
const socketService = require('./src/services/socket-service/socketServer');

const { createProxyMiddleware } = require("http-proxy-middleware");

connectDB();

const app = express();

// Create a single HTTP server instance
const server = require('http').createServer(app);

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/points', pointRoutes);

// Initialize socket server with the HTTP server instance
socketService.init(server);

// Initialize MQTT connection
mqttService.init();

const pointsUrl = process.env.API_POINTS_URL   
const projectsUrl = process.env.API_PROJECTS_URL 

// Proxy to the points
app.use('/api/points', createProxyMiddleware({ target: pointsUrl, changeOrigin: true }));
app.use('/api/projects', createProxyMiddleware({ target: projectsUrl, changeOrigin: true }));

// Start the server using the HTTP server instance, not app.listen()
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`WebSocket server is ready for connections`);
});