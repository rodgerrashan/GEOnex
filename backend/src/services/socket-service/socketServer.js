const { Server } = require('socket.io');

let io;

const init = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
};

const sendToClients = (deviceName, deviceType, action, value, status) => {
    if (io) {
        const data = {
            deviceName,
            deviceType,
            action,
            value,
            status
        };
        if (action === 'corrections'){
            // Handles base corrections
            io.emit(`corrections:${deviceType}`, data);
        };
        // Handles live tracking of Base and Rover
        if (action === 'tracking') io.emit(`live:${deviceType}`, data);
    
    }
};
module.exports = { init, sendToClients };
