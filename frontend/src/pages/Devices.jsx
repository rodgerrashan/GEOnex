import React from "react";
import ConnectedDevices from "../components/ConnectedDevices";
import RegisteredDevices from "../components/RegisteredDevices";
import MapDeviceData from "../components/MapDeviceData";
import CriticalAlerts from "../components/CriticalAlerts";


const Devices = () => {
  return (
    <div className="min-h-screen p-1 text-gray-900 dark:text-gray-100">
      <div className="mb-10">
        <h1 className="text-4xl font-semi-bold">Devices</h1>
        <p className="text-md mt-1">Track your all devices from here</p>
      </div>
      
      <div className="flex flex-wrap gap-4">
        {/* Left column */}
        <div className="flex-1 min-w-[300px]">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-4 ">
            <MapDeviceData/>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg ">
            <ConnectedDevices />
          </div>
          
        </div>

        {/* Right column */}
        <div className="flex-1 min-w-[300px]">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-4">
            <CriticalAlerts/>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <RegisteredDevices/>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Devices;
