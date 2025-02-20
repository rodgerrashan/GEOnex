import React from "react";

const Devices = () => {
  return (
    <div>
      <div className="grid grid-cols-2 grid-rows-7 gap-4 h-screen">
        <div className="col-span-2 ">
          <h1 className="text-2xl font-semi-bold">Devices</h1>
          <p className="text-xs mt-1">Track your all devices from here</p>
        </div>
        <div className="col-span-1 row-span-3 bg-white p-4 rounded-lg">
          {/* Map section */}
          Map Section
        </div>
        <div className="col-span-1 row-span-2 bg-white p-4 rounded-lg">
          Connected devices
        </div>
        <div className="col-span-1 row-span-2 bg-white p-4 rounded-lg">
          Available devices
        </div>
        <div className="col-span-1 row-span-3 bg-white p-4 rounded-lg">
          RT data
        </div>
        <div className="col-span-1 row-span-2 bg-white p-4 rounded-lg">
          Critical alert
        </div>
      </div>
    </div>
  );
};

export default Devices;
