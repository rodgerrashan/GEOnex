const awsIot = require("aws-iot-device-sdk");
const path = require("path");
require("dotenv").config();


const device = awsIot.device({
    keyPath: path.resolve(__dirname, process.env.AWS_PRIVATE_KEY) ,
    certPath: path.resolve(__dirname,process.env.AWS_CERT ) ,
    caPath: path.resolve(__dirname, process.env.AWS_ROOT_CA),
    clientId: process.env.AWS_CLIENT_ID,
    host: process.env.AWS_IOT_ENDPOINT
});


const init = () => {
    
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


}
module.exports = {device, init};