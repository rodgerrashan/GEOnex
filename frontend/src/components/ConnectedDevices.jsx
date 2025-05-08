import LoadingSpinner from "./LoadingSpinner";
import React, { useState, useEffect } from "react";

export default function ConnectedDevices() {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deviceId, setDeviceId] = useState("");
    const [connectingDevice, setConnectingDevice] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Mock user ID (in real app, this would come from auth context)
    const userId = "user123";

    useEffect(() => {
        fetchUserDevices();
    }, []);

    const fetchUserDevices = async () => {
        setLoading(true);
        try {
            // Replace with your actual API endpoint
            const response = await fetch(`/api/users/${userId}/devices`);
            if (!response.ok) {
                throw new Error("Failed to fetch devices");
            }
            const data = await response.json();
            setDevices(data);
        } catch (error) {
            console.error("Error fetching devices:", error);
            setError("Failed to load connected devices");
        } finally {
            setLoading(false);
        }
    };

    const handleConnectDevice = async (e) => {
        e.preventDefault();
        if (!deviceId.trim()) {
            setError("Please enter a device ID");
            return;
        }

        setConnectingDevice(true);
        setError("");
        setSuccess("");

        try {
            // First check if device exists and is not connected to a project
            const checkResponse = await fetch(`/api/devices/${deviceId}/check`);
            if (!checkResponse.ok) {
                const errorData = await checkResponse.json();
                throw new Error(errorData.message || "Device not found");
            }

            const deviceData = await checkResponse.json();
            if (deviceData.isConnectedToProject) {
                throw new Error("This device is already connected to a project");
            }

            // Connect device to user
            const connectResponse = await fetch(`/api/users/${userId}/devices`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ deviceId }),
            });

            if (!connectResponse.ok) {
                const errorData = await connectResponse.json();
                throw new Error(errorData.message || "Failed to connect device");
            }

            setSuccess("Device connected successfully!");
            setDeviceId("");
            // Refresh the device list
            fetchUserDevices();
        } catch (error) {
            console.error("Error connecting device:", error);
            setError(error.message);
        } finally {
            setConnectingDevice(false);
        }
    };

    const getDeviceTypeIcon = (type) => {
        if (type === "rover") {
            return (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 10C17 13.3137 14.3137 16 11 16C7.68629 16 5 13.3137 5 10C5 6.68629 7.68629 4 11 4C14.3137 4 17 6.68629 17 10Z" stroke="currentColor" strokeWidth="2" />
                    <path d="M11 16V20" stroke="currentColor" strokeWidth="2" />
                    <path d="M7 20H15" stroke="currentColor" strokeWidth="2" />
                </svg>
            );
        } else if (type === "base") {
            return (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="5" y="8" width="14" height="12" stroke="currentColor" strokeWidth="2" />
                    <path d="M8 8V4" stroke="currentColor" strokeWidth="2" />
                    <path d="M16 8V4" stroke="currentColor" strokeWidth="2" />
                </svg>
            );
        }
        return null;
    };

    const getBatteryIcon = (level) => {
        if (level > 75) {
            return (
                <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="6" width="18" height="12" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
                    <rect x="5" y="8" width="14" height="8" fill="currentColor" />
                    <path d="M23 13V11" stroke="currentColor" strokeWidth="2" />
                </svg>
            );
        } else if (level > 25) {
            return (
                <svg className="w-4 h-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="6" width="18" height="12" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
                    <rect x="5" y="8" width="7" height="8" fill="currentColor" />
                    <path d="M23 13V11" stroke="currentColor" strokeWidth="2" />
                </svg>
            );
        } else {
            return (
                <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="6" width="18" height="12" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
                    <rect x="5" y="8" width="3" height="8" fill="currentColor" />
                    <path d="M23 13V11" stroke="currentColor" strokeWidth="2" />
                </svg>
            );
        }
    };

    const getSignalIcon = (strength) => {
        if (strength > 75) {
            return (
                <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 20h2V10H2v10zm4 0h2V4H6v16zm4 0h2v-8h-2v8zm4 0h2V8h-2v12zm4 0h2v-4h-2v4z" />
                </svg>
            );
        } else if (strength > 25) {
            return (
                <svg className="w-4 h-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 20h2V10H2v10zm4 0h2V4H6v16zm4 0h2v-8h-2v8z" />
                    <path d="M14 20h2V8h-2v12zm4 0h2v-4h-2v4z" fill="none" stroke="currentColor" />
                </svg>
            );
        } else {
            return (
                <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 20h2V10H2v10zm4 0h2V4H6v16z" />
                    <path d="M10 20h2v-8h-2v8zm4 0h2V8h-2v12zm4 0h2v-4h-2v4z" fill="none" stroke="currentColor" />
                </svg>
            );
        }
    };

    return(
        <>
            <div className="flex flex-col gap-6 w-full">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold">Connected Devices</h1>
                        <button 
                            onClick={() => window.location.href = '/register-device'}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                        >
                            Register New Device
                        </button>
                    </div>
                    
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {success && <p className="text-green-500 text-sm">{success}</p>}
                    
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Enter Device ID"
                            value={deviceId}
                            onChange={(e) => setDeviceId(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleConnectDevice}
                            disabled={connectingDevice}
                            className="bg-green-500 text-white px-2 py-2 rounded-md text-sm hover:bg-green-600 transition-colors disabled:bg-gray-400"
                        >
                            {connectingDevice ? "Connecting..." : "Connect"}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-2 w-full ">
                    <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                        <span className="text-sm font-semibold">Device ID</span>
                        <div className="flex gap-6">
                            <span className="text-sm font-semibold">Type</span>
                            <span className="text-sm font-semibold">Battery</span>
                            <span className="text-sm font-semibold">Signal</span>
                            <span className="text-sm font-semibold">Status</span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center w-full py-8">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        devices.length === 0 ? (
                            <p className="text-gray-600 py-4 text-center">No devices connected yet.</p>
                        ) : (
                            devices.map((device) => (
                                <div key={device.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                                    <span className="text-sm font-medium">{device.id}</span>
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-1 w-12">
                                            {getDeviceTypeIcon(device.type)}
                                            <span className="text-xs">{device.type}</span>
                                        </div>
                                        <div className="flex items-center w-8">
                                            {getBatteryIcon(device.batteryLevel)}
                                        </div>
                                        <div className="flex items-center w-8">
                                            {getSignalIcon(device.signalStrength)}
                                        </div>
                                        <div className="w-16 flex justify-end">
                                            <span className={`text-xs px-2 py-1 rounded-full ${device.isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {device.isOnline ? 'Online' : 'Offline'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )
                    )}
                </div>
            </div>
        </>
    );
}