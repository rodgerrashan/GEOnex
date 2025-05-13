import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const useBaseSensorData = (WS_URL, deviceId) => {
  const [baseSensorData, setSensorData] = useState(
    
      {
        deviceName: "N/A",
        deviceType: "N/A",
        action: "N/A",
        status: "N/A",
        timestamp: new Date().toISOString(),
        latitude: "N/A",
        longitude: "N/A",
        battery: "N/A",
        signal: "N/A",
      },
    
  );
 
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

      console.log(`Subscribing to deviceId: ${deviceId}`);
      socket.emit("subscribe", deviceId);
    });

    socket.on("connect_error", (error) => {
      console.error("Connection Error:", error);
      setConnectionStatus(`Connection Error: ${error.message} ❌`);
    });

    socket.on("disconnect", () => {
      console.log("WebSocket Disconnected");
      setConnectionStatus("Disconnected ❌");
    });

    const handleDeviceData = (data) => {
  console.log("Received base-data:", data);

  // Replace sensor data with new data
  setSensorData(prevData => {
    const newData = {
      deviceName: data.deviceName || 'N/A',
      deviceType: data.deviceType || 'N/A',
      action: data.action || 'N/A',
      status: data.status || 'N/A',
      timestamp: data.timestamp || new Date().toISOString(),
      latitude: data.latitude || 6.6150,
      longitude: data.longitude || 79.968074,
      battery: data.battery || 'N/A',
      signal: data.signal || 'N/A',

    };
    console.log("Updated base sensorData:", newData);
    return newData;
  });
};
    socket.on("device-data", handleDeviceData);

    // Optional: fallback to global events
    socket.on("live", handleDeviceData);
    socket.on("corrections", handleDeviceData);

    return () => {
      console.log("Disconnecting socket");
      socket.disconnect();
    };
  }, [WS_URL, JSON.stringify(deviceId)]);

  return { baseSensorData, connectionStatus };
};

export default useBaseSensorData;
