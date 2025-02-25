const device = require('./mqttClient');

device.on('message', (topic, payload) => {
    try {
        const message = JSON.parse(payload.toString());
        console.log('Processed Message:', message);
        // Here you can process the data, store it in MongoDB, or send it to the frontend.
    } catch (error) {
        console.error('Error processing message:', error);
    }
});

module.exports = {};
