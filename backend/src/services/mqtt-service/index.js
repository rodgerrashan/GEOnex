const mqttService = require('./mqttClient');
const socketService = require('./socketServer');

// src/services/user-service/index.js
const express = require('express');
const app = express();
require("dotenv").config();

app.use(express.json());


// Create a single HTTP server instance
const server = require('http').createServer(app);
socketService.init(server);


const PORT = process.env.SERVER_PORT || 5007;
app.listen(PORT, () => {
  console.log(`MQTT service running on port ${PORT}`);
});


// Initialize MQTT connection
mqttService.init();