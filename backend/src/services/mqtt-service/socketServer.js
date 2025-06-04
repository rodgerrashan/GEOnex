const { Server } = require("socket.io");

let io;

const init = (server) => {
    io = new Server(server, {
        cors: {
            origin: ["https://api.geonex.site", "http://localhost:5173"],
            methods: ["GET", "POST"],
            credentials: true,
        },
        transports: ["polling", "websocket"]
    });

    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        // Handle subscriptions for multiple devices
        socket.on("subscribe", (deviceIds) => {
            if (Array.isArray(deviceIds)) {
                deviceIds.forEach((deviceId) => {
                    console.log(`Client ${socket.id} subscribed to device: ${deviceId}`);
                    socket.join(deviceId); // Join the room named after the device ID
                });
            } else if (typeof deviceIds === "string") {
                console.log(`Client ${socket.id} subscribed to device: ${deviceIds}`);
                socket.join(deviceIds);
            } else {
                console.warn("Invalid subscription format");
            }
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });

    return io;
};

const sendToClients = (deviceName, deviceType, value, status) => {
    console.log("Sending data to clients:");

    if (!io) return;

    // Parse the value if it's a JSON string
    let parsedValue = value;
    if (typeof value === 'string' && value.trim().startsWith('{')) {
        try {
            parsedValue = JSON.parse(value);
        } catch (e) {
            console.error("Failed to parse value:", e);
        }
    }

    // Construct the data object
    const data = {
        deviceName,
        deviceType,
        status,
        timestamp: new Date().toISOString(),
        latitude: parsedValue?.latitude || null,
        longitude: parsedValue?.longitude || null,
        battery: parsedValue?.battery || null,
        signal: parsedValue?.wifi || null,
        satellites: parsedValue?.satallites || null,
        colatitude: parsedValue?.colatitude || null,
        colongitude: parsedValue?.colongitude || null
    };

    
    
    if (deviceName) {
        console.log(`Emitting to room [${deviceName}]:`, data);
        if(data.latitude === null || data.longitude === null){
            console.warn("Won't submit to clients due to null safety.");
        }else{
            io.to(deviceName).emit("device-data", data); 
        }
        
    }
};

module.exports = { init, sendToClients };
