const mqttService = require('./mqttClient');
const socketService = require('./socketServer');

const express = require('express');
const app = express();
require("dotenv").config();

app.use(express.json());

// Create and share the HTTP server
const server = require('http').createServer(app);

// Initialize WebSocket
socketService.init(server);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'mqtt-service' });
});

// Initialize MQTT connection
mqttService.init();

// Start server
const PORT = process.env.SERVER_PORT || 5007;
server.listen(PORT, () => {
  console.log(`MQTT + WebSocket server running on port ${PORT}`);
});
