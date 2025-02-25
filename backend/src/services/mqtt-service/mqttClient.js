const awsIot = require("aws-iot-device-sdk");

// AWS IoT Configuration
const device = awsIot.device({
    keyPath: process.env.AWS_PRIVATE_KEY,
    certPath: process.env.AWS_CERT,
    caPath: process.env.AWS_ROOT_CA,
    clientId: process.env.AWS_CLIENT_ID,
    host: process.env.AWS_IOT_ENDPOINT
});


device.on('connect', () => {
    console.log('Connected to AWS IoT Core');
    device.subscribe('iot/data'); 
});

device.on('message', (topic, payload) => {
    console.log(`Received message on ${topic}:`, payload.toString());
});

device.on('error', (error) => {
    console.error('MQTT Error:', error);
});

module.exports = device;