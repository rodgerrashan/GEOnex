import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const useSensorData = (WS_URL) => {
    const [sensorData, setSensorData] = useState({
        deviceId: "Loading...",
        latitude: null,
        longitude: null,
        altitude: "Loading...",
        speed: "Loading...",
        status: "Loading...",
        lastUpdate: null
    });

    const [connectionStatus, setConnectionStatus] = useState("Connecting...");

    useEffect(() => {
        console.log("Connecting to WebSocket at:", WS_URL);
        const socket = io(WS_URL, { 
            transports: ["websocket"],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 10000
    });

    socket.on("connect", () => {
        console.log("WebSocket Connected:", socket.id);
        setConnectionStatus("Connected ✅");
        
        // Subscribe to tracking events
        socket.emit("subscribe", "tracking");
    });

    socket.on("connect_error", (error) => {
        console.error("Connection Error:", error);
        setConnectionStatus(`Connection Error: ${error.message} ❌`);
    });

    socket.on("disconnect", () => {
        console.log("WebSocket Disconnected");
        setConnectionStatus("Disconnected ❌");
    });

    // Flexible data handler that can work with both data formats
    const handleData = (data) => {
        console.log("Received data:", data);

        // Check if data contains a value property that is a string containing JSON
        let parsedData = data;
        if (
            data.value &&
            typeof data.value === "string" &&
            data.value.trim().startsWith("{")
        ){
        try {
            const valueObj = JSON.parse(data.value);
            // Merge the parsed object with the original data
            parsedData = { ...data, ...valueObj };
        } catch (e) {
            console.error("Failed to parse value:", e);
        }
      }

      setSensorData({
        deviceId: parsedData.deviceId || "N/A",
        // Set latitude and longitude as numbers (or null if missing)
        latitude: parsedData.latitude ? parseFloat(parsedData.latitude) : null,
        longitude: parsedData.longitude ? parseFloat(parsedData.longitude) : null,
        altitude: parsedData.altitude || "N/A",
        speed: parsedData.speed || "N/A",
        status: parsedData.status || "N/A",
        lastUpdate: new Date().toLocaleTimeString(),
      });
    };

    // Listen for live tracking updates and corrections
    socket.on("live", handleData);
    socket.on("corrections", handleData);

    return () => {
        console.log("Disconnecting socket");
        socket.disconnect();
    };
  }, [WS_URL]);

  return { sensorData, connectionStatus };
};

export default useSensorData;
