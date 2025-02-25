const mqtt = require('mqtt');

const MQTT_BROKER_URL = process.env.AWS_IOT_ENDPOINT;
const MQTT_TOPIC = 'esp8266/pub';



const client = mqtt.connect(MQTT_BROKER_URL, {
    clientId: `tracking-service-${Math.random().toString(16).slice(2)}`,
    key: process.env.AWS_PRIVATE_KEY,
    cert: process.env.AWS_CERT,
    ca: process.env.AWS_ROOT_CA,
});

client.on('connect', () => {
    console.log('Connected to AWS IoT MQTT Broker');
    client.subscribe(MQTT_TOPIC, (err) => {
        if (!err) {
            console.log(`Subscribed to topic: ${MQTT_TOPIC}`);
        }
    });
});

client.on('message', async (topic, message) => {
    try {
        const data = JSON.parse(message.toString());
        const {deviceId, latitude, longitude, timestamp } = data;

        console.log('Received tracking data:', data);
        
    } catch (error) {
        console.error('Failed to process MQTT message:', error);
    }
});

module.exports = { startMqttListener: () => client };
