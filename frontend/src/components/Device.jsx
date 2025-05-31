import React from "react";

const Device = ({ data, onChange }) => {
  return (
    <div>
      <div>
        <h2 className="font-semibold text-xl">Device</h2>

        {/* Sampling Interval */}
        <div className="flex items-center justify-between mt-4">
          <span>Sampling Interval</span>
          <select
            value={data.samplingInterval}
            onChange={(e) => onChange("samplingInterval", e.target.value)}
            className="text-blue-600 cursor-pointer outline-none rounded px-2 py-1 dark:text-indigo-400 dark:bg-gray-800"
          >
            <option>1s</option>
            <option>2s</option>
            <option>5s</option>
          </select>
        </div>
        <hr className="border-gray-300 dark:border-gray-600" />

        {/* RTK Correction Source */}
        <div className="flex items-center justify-between mt-4">
          <span>RTK Correction Source</span>
          <select
            value={data.rtkCorrectionSource}
            onChange={(e) => onChange("rtkCorrectionSource", e.target.value)}
            className="text-blue-600 cursor-pointer outline-none rounded px-2 py-1 dark:text-indigo-400 dark:bg-gray-800"
          >
            <option>BASE</option>
            <option>NTRIP</option>
          </select>
        </div>
        <hr className="border-gray-300 dark:border-gray-600" />

        {/* NTRIP Credentials */}
        <div className="space-y-2 mt-6">
          <label className="block font-medium text-lg">NTRIP Credentials</label>
          <input
            type="text"
            placeholder="URL"
            disabled
            className="w-full bg-gray-200 rounded-full py-2 px-4 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400 "
          />
          <input
            type="text"
            placeholder="User Name"
            disabled
            className="w-full bg-gray-200 rounded-full py-2 px-4 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400 "
          />
          <input
            type="password"
            placeholder="Password"
            disabled
            className="w-full bg-gray-200 rounded-full py-2 px-4 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400 "
          />
        </div>
      </div>

      <hr className="border-gray-300 mt-4 mb-4 dark:border-gray-600" />

      {/* Firmware Update */}
      <label className="block font-medium text-lg">Firmware Update</label>
      <button 
      disabled
      className="w-full bg-black text-white rounded-full py-2 mt-4 hover:bg-gray-900 transition cursor-not-allowed">
        CHECK UPDATES
      </button>
    </div>
  );
};

export default Device;
