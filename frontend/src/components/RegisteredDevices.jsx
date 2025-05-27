import LoadingSpinner from "./LoadingSpinner";
import React, { useState, useEffect, useContext } from "react";
import dayjs from 'dayjs';
import { Context } from "../context/Context";

export default function RegisteredDevices() {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [DeviceCode, setDeviceCode] = useState("");
    const [connectingDevice, setConnectingDevice] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { userData } = useContext(Context);

    // Mock user ID (in real app, this would come from auth context)
    const userId = userData.userId;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;


    useEffect(() => {
        fetchUserDevices();
    }, []);


    const fetchUserDevices = async () => {
    setLoading(true);
    try {
        const response = await fetch(`${backendUrl}/api/user/${userId}/registereddevices`);
        if (!response.ok) {
            throw new Error("Failed to fetch registered devices");
        }

        const data = await response.json();
        console.log("Full response:", data);

        // Access the connectedDevices array from the response
        setDevices(data.devices || []);
    } catch (error) {
        console.error("Error fetching devices:", error);
        setError("Failed to load connected devices");
    } finally {
        setLoading(false);
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

    

return (
  <>
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold">Registered Devices</h1>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
      </div>

      {/* Scroll wrapper */}
      <div className="overflow-x-auto w-full">
        <div className="min-w-[600px]">
          {/* Header row */}
          <div className="flex flex-nowrap items-center justify-between bg-gray-100 p-3 rounded-lg min-w-[600px]">
            <span className="flex-shrink-0 w-[25%] text-sm md:text-base font-semibold">Device Name</span>
            <span className="flex-shrink-0 w-[20%] text-sm md:text-base font-semibold text-center">Type</span>
            <span className="flex-shrink-0 w-[20%] text-sm md:text-base font-semibold text-center">Device Code</span>
            <span className="flex-shrink-0 w-[25%] text-sm md:text-base font-semibold text-center">Registered Date</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center w-full py-8 max-h-96">
              <LoadingSpinner />
            </div>
          ) : devices.length === 0 ? (
            <p className="text-gray-600 py-4 text-center">You have no devices registered.</p>
          ) : (
            devices.map((device) => (
              <div
                key={device._id}
                className="flex flex-nowrap items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-gray-100 min-w-[600px]"
              >
                <span className="flex-shrink-0 w-[25%] text-xs md:text-sm lg:text-base font-medium">
                  {device.Name}
                </span>

                <div className="flex items-center gap-1 justify-center flex-shrink-0 w-[20%]">
                  {getDeviceTypeIcon(device.Type)}
                  <span className="text-xs md:text-sm lg:text-base">{device.Type}</span>
                </div>

                <span className="flex-shrink-0 w-[20%] text-xs md:text-sm lg:text-base text-center">
                  {device.DeviceCode}
                </span>

                <span className="flex-shrink-0 w-[25%] text-xs md:text-sm lg:text-base text-center">
                  {dayjs(device.Registered_Date).format("YYYY-MM-DD")}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  </>
);


}