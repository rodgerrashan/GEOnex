import LoadingSpinner from "./LoadingSpinner";
import React, { useState, useEffect, useContext } from "react";
import dayjs from "dayjs";
import { Context } from "../context/Context";

export default function CriticalAlerts() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);

    const { userData , backendUrl} = useContext(Context);

    const userId = userData.userId;

  useEffect(() => {
    fetchUserDevices();
  }, []);

    const fetchUserDevices = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${backendUrl}/api/user/${userId}/device-alerts`);
            if (!response.ok) {
                throw new Error("Failed to fetch critical alerts");
            }

      const data = await response.json();
      console.log("Full response:", data);

      // Access the connectedDevices array from the response
      setDevices(data.devices || []);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      setError("Failed to load alerts");
    } finally {
      setLoading(false);
    }
  };

  const getDeviceTypeIcon = (type) => {
    if (type === "rover") {
      return (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17 10C17 13.3137 14.3137 16 11 16C7.68629 16 5 13.3137 5 10C5 6.68629 7.68629 4 11 4C14.3137 4 17 6.68629 17 10Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M11 16V20" stroke="currentColor" strokeWidth="2" />
          <path d="M7 20H15" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    } else if (type === "base") {
      return (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="5"
            y="8"
            width="14"
            height="12"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M8 8V4" stroke="currentColor" strokeWidth="2" />
          <path d="M16 8V4" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-6 w-full text-gray-900 dark:text-gray-100">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold">Alerts</h1>
        </div>

        {error && <p className="text-red-500 dark:text-red-400  text-sm">{error}</p>}
        {success && <p className="text-green-500 dark:text-green-400 text-sm">{success}</p>}
      </div>

      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center justify-between 
        bg-gray-100 p-3 rounded-lg dark:bg-gray-700">
          <span className="text-xs md:text-sm lg:text-base font-semibold">
            Device
          </span>
          <div className="flex gap-6">
            <span className="text-xs md:text-sm lg:text-base font-semibold">
              Status
            </span>
            <span className="text-xs md:text-sm lg:text-base font-semibold">
              Code
            </span>
            <span className="text-xs md:text-sm lg:text-base font-semibold">
              Details
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center w-full py-8 max-h-96">
            <LoadingSpinner />
          </div>
        ) : devices.length === 0 ? (
          <div className="flex flex-col items-center justify-center 
          py-10 bg-green-50 rounded-lg border border-green-100
          dark:bg-green-900/20 dark:border-green-800  ">
            <svg
              className="w-12 h-12 text-green-500 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h3 className="text-sm md:text-base lg:text-lg font-medium text-green-700 dark:text-green-400">
              All Clear!
            </h3>
            <p className="text-green-600 dark:text-green-300 mt-1 text-center">
              Congratulations! You have no alerts at this time.
            </p>
          </div>
        ) : (
          devices.map((device) => (
            <div
              key={device._id}
              className="flex items-center justify-between 
              bg-white p-3 rounded-lg shadow-sm border border-gray-100
              dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium">{device.Name}</span>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1 w-12">
                  {getDeviceTypeIcon(device.Type)}
                  <span className="text-xs">{device.Type}</span>
                </div>
                <div className="flex items-center gap-6 w-12">
                  <span className="text-xs font-small">
                    {device.DeviceCode}
                  </span>
                </div>
                <div className="flex items-center gap-6 w-30">
                  <span className="text-xs font-small">
                    {dayjs(device.Registered_Date).format("YYYY-MM-DD")}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
