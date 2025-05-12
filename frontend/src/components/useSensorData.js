import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const useSensorData = (WS_URL, deviceIds = []) => {
  const [sensorData, setSensorData] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected ❌");
  const socketRef = useRef(null);

  useEffect(() => {
    console.log("Connecting to WebSocket at:", WS_URL);
    const socket = io(WS_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("WebSocket Connected:", socket.id);
      setConnectionStatus("Connected ✅");

      // Subscribe to each deviceId room
      if (Array.isArray(deviceIds) && deviceIds.length > 0) {
        deviceIds.forEach((deviceId) => {
          console.log(`Subscribing to deviceId: ${deviceId}`);
          socket.emit("subscribe", deviceId);
        });
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Connection Error:", error);
      setConnectionStatus(`Connection Error: ${error.message} ❌`);
    });

    socket.on("disconnect", () => {
      console.log("WebSocket Disconnected");
      setConnectionStatus("Disconnected ❌");
    });

    // Unified handler for incoming device data
    const handleDeviceData = (data) => {
      console.log("Received device-data:", data);

      // Try to parse value if it's a JSON string
      let parsedData = data;
      

      // Append new sensor data to the list
    setSensorData((prev) => [
      ...prev,
      {
        deviceName: parsedData.deviceName || 'N/A',
        deviceType: parsedData.deviceType || 'N/A',
        action: parsedData.action || 'N/A',
        status: parsedData.status || 'N/A',
        timestamp: parsedData.timestamp || new Date().toISOString(),
        latitude: parsedData.latitude || 'N/A',
        longitude: parsedData.longitude || 'N/A'
      },
      
    ]);
    console.log("Updated sensorData:", sensorData);
    };

    // Listen for room-based events for each device
    if (Array.isArray(deviceIds)) {
      deviceIds.forEach((deviceId) => {
        socket.on("device-data", handleDeviceData); // If backend sends room message as "device-data"
      });
    }

    // Optional: fallback to global events
    socket.on("live", handleDeviceData);
    socket.on("corrections", handleDeviceData);

    return () => {
      console.log("Disconnecting socket");
      socket.disconnect();
    };
  }, [WS_URL, JSON.stringify(deviceIds)]);

  return { sensorData, connectionStatus };
};

export default useSensorData;
