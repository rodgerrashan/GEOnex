import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const SensorData = () => {
    const [sensorData, setSensorData] = useState({
        deviceId: "Loading...",
        latitude: "Loading...",
        longitude: "Loading...",
        altitude: "Loading...",
        speed: "Loading...",
        status: "Loading...",
        lastUpdate: null
    });

    const [connectionStatus, setConnectionStatus] = useState("Connecting...");
    
    // Set WebSocket URL (adjust for production)
    const WS_URL =  "http://13.61.32.218:5000";

    
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
            if (data.value && typeof data.value === 'string' && data.value.trim().startsWith('{')) {
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
                latitude: parsedData.latitude || "N/A",
                longitude: parsedData.longitude || "N/A",
                altitude: parsedData.altitude || "N/A",
                speed: parsedData.speed || "N/A",
                status: parsedData.status || "N/A",
                lastUpdate: new Date().toLocaleTimeString()
            });
        };
        
        // Listen for live tracking updates
        socket.on("live", handleData);
        
        // Also listen for corrections
        socket.on("corrections", handleData);
        
        // Debug: Log all events (remove in production)
        socket.onAny((event, ...args) => {
            console.log(`Debug - Event: ${event}`, args);
        });
        
        return () => {
            console.log("Disconnecting socket");
            socket.disconnect();
        };
    }, [WS_URL]);
    
    // Get status color
    const getStatusColor = () => {
        if (connectionStatus.includes("Connected")) return "green";
        if (connectionStatus.includes("Connecting")) return "orange";
        return "red";
    };
    
    return (
        <div style={{ 
            maxWidth: "800px", 
            margin: "0 auto", 
            padding: "20px",
            fontFamily: "Arial, sans-serif" 
        }}>
            <h1>Real-Time Sensor Data</h1>
            
            <div style={{ 
                padding: "10px", 
                marginBottom: "20px", 
                backgroundColor: "#f5f5f5",
                borderRadius: "5px"
            }}>
                <p>WebSocket Status: 
                    <strong style={{ color: getStatusColor() }}> {connectionStatus}</strong>
                </p>
                
                {sensorData.lastUpdate && 
                    <p>Last Update: {sensorData.lastUpdate}</p>
                }
            </div>
            
            <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", 
                gap: "15px" 
            }}>
                <DataCard label="Device ID" value={sensorData.deviceId} />
                <DataCard label="Latitude" value={sensorData.latitude} />
                <DataCard label="Longitude" value={sensorData.longitude} />
                <DataCard label="Altitude" value={sensorData.altitude} />
                <DataCard label="Speed" value={sensorData.speed} />
                <DataCard label="Status" value={sensorData.status} />
            </div>
            
            {connectionStatus.includes("Disconnected") && (
                <button 
                    onClick={() => window.location.reload()}
                    style={{
                        backgroundColor: "#4a90e2",
                        color: "white",
                        border: "none",
                        padding: "10px 15px",
                        borderRadius: "4px",
                        marginTop: "20px",
                        cursor: "pointer"
                    }}
                >
                    Reconnect
                </button>
            )}
        </div>
    );
};

// Helper component for displaying data cards
// eslint-disable-next-line react/prop-types
const DataCard = ({ label, value }) => (
    <div style={{ 
        backgroundColor: "white", 
        padding: "15px", 
        borderRadius: "5px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.12)"
    }}>
        <h3 style={{ margin: "0 0 10px 0", color: "#555" }}>{label}</h3>
        <p style={{ margin: 0, fontWeight: "bold", fontSize: "18px" }}>{value}</p>
    </div>
);

export default SensorData;