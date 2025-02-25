const awsIot = require("aws-iot-device-sdk");
const EventEmitter = require("events");

const mqttClient = new EventEmitter();

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
    device.subscribe(process.env.AWS_TOPIC);
    console.log("[Success]  ✅ Connected to AWS IoT Core");
});

device.on("message", (topic, payload) => {
    const message = JSON.parse(payload.toString());
    console.log(`Received from ${topic}`, message);

    if (topic.startsWith('siteSurvey/response')) {
        mqttClient.emit('location-response', message);
    }
});

const requestLocation = (deviceId) => {
    device.publish(`siteSurvey/request/${deviceId}`, JSON.stringify({ action: 'get_location' }));

};

module.exports = {
    mqttClient,
    requestLocation
}

