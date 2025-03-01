const { Server } = require("socket.io");

let io;

const init = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
        transports: ["websocket"], 
    });

    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        socket.on("subscribe", (eventName) => {
            console.log(`Client subscribed to: ${eventName}`);
            socket.join(eventName);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });

    return io;
};

const sendToClients = (deviceName, deviceType, action, value, status) => {
    if (!io) return;
    
    // Parse the value if it's a JSON string
    let parsedValue = value;
    if (typeof value === 'string' && value.trim().startsWith('{')) {
        try {
            parsedValue = JSON.parse(value);
        } catch (e) {
            console.error("Failed to parse value:", e);
            // Keep the original value if parsing fails
        }
    }

    // Create the data object with the parsed value properties at the top level
    const data = { 
        deviceName, 
        deviceType, 
        action, 
        status,
        timestamp: new Date().toISOString()
    };
    
    // If parsedValue is an object, add its properties directly to the data object
    if (parsedValue && typeof parsedValue === 'object') {
        Object.assign(data, parsedValue);
    } else {
        // Otherwise, just add the value as is
        data.value = value;
    }

    if (action === "corrections") {
        console.log("Emitting corrections:", data);
        io.emit("corrections", data);
    } else if (action === "tracking") {
        console.log("Emitting tracking:", data);
        io.emit("live", data);
    }
};

module.exports = { init, sendToClients };