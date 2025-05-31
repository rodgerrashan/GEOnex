// server.js - Main entry point
const express = require('express');
require("dotenv").config();
const cors = require('cors');
const cookieParser=require('cookie-parser');
const connectDB = require('./src/config/db');
const projectRoutes = require('./src/services/project-service/routes/projectRoutes');
const pointRoutes = require('./src/services/point-service/routes/pointRoutes');
const mqttService = require('./src/services/mqtt-service/mqttClient');
const socketService = require('./src/services/socket-service/socketServer');
const deviceServices = require('./src/services/device-service/routes/deviceRoutes');        

const { createProxyMiddleware } = require("http-proxy-middleware");
const authRouter = require('./src/services/auth-service/routes/authRoutes');
const userRouter = require('./src/services/auth-service/routes/userRoutes');
const notificationRouter = require('./src/services/notification-service/src/routes/notificationRoutes');

const exportRoutes = require("./src/services/export-service/routes/exportRoutes");

connectDB();

const app = express();

// Create a single HTTP server instance
const server = require('http').createServer(app);

const allowedOrigins = ['http://localhost:5173']

app.use(cors({origin: allowedOrigins, credentials:true}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/points', pointRoutes);
app.use('/api/devices', deviceServices); 
app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);
app.use('/api/notifications',notificationRouter);
app.use('/api/export',exportRoutes);

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