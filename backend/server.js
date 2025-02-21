require("dotenv").config();
const awsIot = require("aws-iot-device-sdk");
const WebSocket = require("ws");

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// AWS IoT Configuration
const device = awsIot.device({
    keyPath: process.env.AWS_PRIVATE_KEY,
    certPath: process.env.AWS_CERT,
    caPath: process.env.AWS_ROOT_CA,
    clientId: process.env.AWS_CLIENT_ID,
    host: process.env.AWS_IOT_ENDPOINT
});

// Connect to AWS IoT Core
device.on("connect", () => {
    console.log("✅ Connected to AWS IoT Core");
    device.subscribe(process.env.AWS_TOPIC);
});

// Listen for MQTT Messages
device.on("message", (topic, payload) => {
    console.log(`📩 Message Received [${topic}]:`, payload.toString());

    // Send Data to Web Clients
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload.toString());
        }
    });
});

// WebSocket Server Connection
wss.on("connection", ws => {
    console.log("🔗 New WebSocket Client Connected");

    ws.on("close", () => {
        console.log("❌ WebSocket Client Disconnected");
    });
});

console.log("🚀 WebSocket Server running on ws://localhost:8080");
