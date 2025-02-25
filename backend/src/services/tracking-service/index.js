const express = require('express');
const cors = require('cors');
const trackingRoutes = require('./routes/trackingRoutes');
const { startMqttListener } = require('./mqttHandler');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/tracking', trackingRoutes);

const PORT = process.env.PORT || 5003;

startMqttListener().on('connect', () => {
    app.listen(PORT, () => {
        console.log(`Tracking service running on port ${PORT}`);
    });
});