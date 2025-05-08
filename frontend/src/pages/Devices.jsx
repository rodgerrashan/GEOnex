import React from "react";
import ConnectedDevices from "../components/ConnectedDevices";

const Devices = () => {
  return (
    <div className="min-h-screen p-1">
      <div className="mb-10">
        <h1 className="text-4xl font-semi-bold">Devices</h1>
        <p className="text-md mt-1">Track your all devices from here</p>
      </div>
      
      <div className="flex flex-wrap gap-4">
        {/* Left column */}
        <div className="flex-1 min-w-[300px]">
          <div className="bg-white p-4 rounded-lg mb-4 h-[400px]">
            {/* Map section */}
            Map Section
          </div>
          <div className="bg-white p-4 rounded-lg mb-4">
            <ConnectedDevices />
          </div>
          <div className="bg-white p-4 rounded-lg">
            Available devices
          </div>
        </div>

        {/* Right column */}
        <div className="flex-1 min-w-[300px]">
          <div className="bg-white p-4 rounded-lg mb-4 h-[400px]">
            RT data
          </div>
          <div className="bg-white p-4 rounded-lg">
            Critical alert
          </div>
        </div>
      </div>
    </div>
  );
};

export default Devices;
