import React, { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";

const SensorData = () => {
    const [sensorData, setSensorData] = useState({
        latitude: null,
        longitude: null,
        altitude: null,
        speed: null,
    });

    // Connect to WebSocket Server
    const { lastMessage } = useWebSocket("ws://13.61.32.218:8080", {
        shouldReconnect: () => true, 
    });

    useEffect(() => {
        if (lastMessage !== null) {
            try {
                const data = JSON.parse(lastMessage.data);
                setSensorData({
                    latitude: data.latitude || 0,
                    longitude: data.longitude || 0,
                    altitude: data.altitude || 0,
                    speed: data.speed || 0,
                });
            } catch (error) {
                console.error("Error parsing WebSocket message: ", error);
            }
        }
    }, [lastMessage]);

    return (
        <div>
            <h1>Real-Time Sensor Data</h1>
            <p>Latitude: {sensorData.latitude ?? "Loading..."}</p>
            <p>Longitude: {sensorData.longitude ?? "Loading..."}</p>
            <p>Altitude: {sensorData.altitude ?? "Loading..."}</p>
            <p>Speed: {sensorData.speed ?? "Loading..."}</p>
        </div>
    );
};

export default SensorData;