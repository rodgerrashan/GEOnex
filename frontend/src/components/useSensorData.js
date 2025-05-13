import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const useSensorData = (WS_URL, deviceIds = []) => {
  const [sensorData, setSensorDataList] = useState([]);
 
  const [connectionStatus, setConnectionStatus] = useState("Disconnected ❌");
  const socketRef = useRef(null);


  const updateSensorDataList = (newData) => {
    console.log("Updating sensor data list with:", newData);
    setSensorDataList(prevList => {
      // Find if an entry with the same deviceName exists
      const existingDeviceIndex = prevList.findIndex(
        entry => entry.deviceName === newData.deviceName
      );

      // if deviceName: 'N/A is true do not add device
      if (newData.deviceName === 'N/A') {
        return prevList;
      }
      

      if (existingDeviceIndex !== -1) {
        // Update existing entry
        const updatedList = [...prevList];
        updatedList[existingDeviceIndex] = {
          ...updatedList[existingDeviceIndex],
          ...newData,
          timestamp: newData.timestamp || 'N/A,'
        };
        return updatedList;
      } else {
        // Add new entry
        return [...prevList, {
          
          deviceName: newData.deviceName || 'Unknown Device',
          deviceType: newData.deviceType || 'N/A',
          action: newData.action || 'N/A',
          status: newData.status || 'N/A',
          timestamp: newData.timestamp || 'N/A',
          latitude: newData.latitude || 'N/A',
          longitude: newData.longitude || 'N/A',
          battery: newData.battery || 'N/A',
          signal: newData.signal || 'N/A',
        }];
      }
    });
  };

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
      updateSensorDataList(parsedData);
      

   
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
