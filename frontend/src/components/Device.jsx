import React from "react";

const Device = () => {
  return (
    <div>
      <div>
        <h2 className="font-semibold text-xl">Device</h2>

        {/* Sampling Interval */}
        <div className="flex items-center justify-between mt-4">
          <span>Sampling Interval</span>
          <select className="text-blue-600 cursor-pointer outline-none rounded px-2 py-1">
            <option>1s</option>
            <option>2s</option>
            <option>5s</option>
          </select>
        </div>
        <hr className="border-gray-300" />

        {/* RTK Correction Source */}
        <div className="flex items-center justify-between mt-4">
          <span>RTK Correction Source</span>
          <select className="text-blue-600 cursor-pointer outline-none rounded px-2 py-1">
            <option>BASE</option>
            <option>NTRIP</option>
          </select>
        </div>
        <hr className="border-gray-300" />

        {/* NTRIP Credentials */}
        <div className="space-y-2 mt-6">
          <label className="block font-medium text-lg">NTRIP Credentials</label>
          <input
            type="text"
            placeholder="URL"
            disabled
            className="w-full bg-gray-200 rounded-full py-2 px-4 text-gray-500 cursor-not-allowed"
          />
          <input
            type="text"
            placeholder="User Name"
            disabled
            className="w-full bg-gray-200 rounded-full py-2 px-4 text-gray-500 cursor-not-allowed"
          />
          <input
            type="password"
            placeholder="Password"
            disabled
            className="w-full bg-gray-200 rounded-full py-2 px-4 text-gray-500 cursor-not-allowed"
          />
          
        </div>
      </div>

      <hr className="border-gray-300 mt-4 mb-4" />

      {/* Firmware Update */}
      <label className="block font-medium text-lg">Firmware Update</label>
      <button className="w-full bg-black text-white rounded-full py-2 mt-4 hover:bg-gray-900 transition">
        CHECK UPDATES
      </button>
    </div>
  );
};

export default Device;
