import React from "react";

const System = () => {
  return (
    <div>
      <h2 className="font-semibold text-xl">System</h2>

      {/* Distance Unit */}
      <div className="flex items-center justify-between mt-4">
        <span>Distance Unit</span>
        <select className="text-blue-600 cursor-pointer outline-none px-2 py-1">
          <option>CM</option>
          <option>FEET</option>
        </select>
      </div>
      <hr className="border-gray-300" />

      {/* Coordinates Unit */}
      <div className="flex items-center justify-between mt-4">
        <span>Coordinates Unit</span>
        <select
          className="text-gray-800 cursor-pointer outline-none px-2 py-1"
          disabled
        >
          <option>DEGREES</option>
        </select>
      </div>
      <hr className="border-gray-300" />

      {/* Base Station Coordinates */}
      <div className="flex items-center justify-between mt-4">
        <span>Base Station Coordinates</span>
        <select className="text-blue-600 cursor-pointer outline-none rounded px-2 py-1">
          <option>AUTO</option>
          <option>MANUAL</option>
        </select>
      </div>
      <hr className="border-gray-300" />

      {/* Longitude and Latitude placeholders */}
      <div className="flex flex-col md:flex-row gap-2 mt-6 mx-4">
        <input
          type="text"
          placeholder="Longitude"
          disabled
          className="flex-1 min-w-0 bg-gray-200 rounded-full py-1 px-2 text-center text-gray-800 cursor-not-allowed"
        />
        <input
          type="text"
          placeholder="Latitude"
          disabled
          className="flex-1 min-w-0 bg-gray-200 rounded-full py-1 px-2 text-center text-gray-500 cursor-not-allowed"
        />
      </div>
    </div>
  );
};

export default System;
