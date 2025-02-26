const device = require('./mqttClient');

device.on('message', (topic, payload) => {
    try {
        const message = JSON.parse(payload.toString());
        console.log('Processed Message:', message);
        
    } catch (error) {
        console.error('Error processing message:', error);
    }
});

module.exports = {};
