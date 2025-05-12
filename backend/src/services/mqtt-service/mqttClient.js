const awsIot = require("aws-iot-device-sdk");
const path = require("path");
require("dotenv").config();
const { sendToClients } = require("../socket-service/socketServer");


const device = awsIot.device({
    keyPath: path.resolve(__dirname, process.env.AWS_PRIVATE_KEY) ,
    certPath: path.resolve(__dirname,process.env.AWS_CERT ) ,
    caPath: path.resolve(__dirname, process.env.AWS_ROOT_CA),
    clientId: process.env.AWS_CLIENT_ID,
    host: process.env.AWS_IOT_ENDPOINT,
    protocol: 'mqtts'
});


const init = () => {
    
    device.on('connect', () => {
        console.log('Connected to AWS IoT Core');

        const topics = [
            process.env.AWS_TOPIC_ROVER_LIVE,
            process.env.AWS_TOPIC_BASE_LIVE,
            process.env.AWS_TOPIC_BASE_CORRECTIONS,
        ]

        topics.forEach(topic => {
            device.subscribe(topic, (err) => {
                if (err) {
                    console.error(`Error subscribing to topic ${topic}:`, err);
                } else {
                    // console.log(`Subscribed to topic`, topic);
                }
            });
        });
    });

    device.on('message', (topic, payload) => {
        // console.log(`Received message on ${topic}:`, payload.toString());
        const parts = topic.split('/'); // ['tracking', 'rover', 'status', 'rover1']

        const deviceType = parts[1];
        const action = parts[0];
        const status = parts[2];
        const deviceId = parts[3];
        const value = payload.toString();
        const deviceName = `${deviceId}`;

        // Debug print
        console.log('Device:', deviceName);
        console.log('Type:', deviceType);
        console.log('Action:', action);
        console.log('Value:', value);
        console.log('status:', status);


        sendToClients(deviceName, deviceType, action, value, status);

    

    });
    
    device.on('error', (error) => {
        console.error('MQTT Error:', error);
    });





}
module.exports = {device, init};