import React from "react";

const Network = () => {
  return (
    <div>
      <h2 className="font-semibold text-xl">Network</h2>

      <div className="flex items-center justify-between mt-4">
        <span>MQTT URL</span>
        <select className="text-blue-600 cursor-pointer outline-none rounded px-2 py-1">
          <option>Default</option>
          <option>Custom</option>
        </select>
      </div>
      <hr className="border-gray-300" />

      <label className="block font-medium text-lg mt-4">Custom MQTT URL</label>
      <input
        type="text"
        placeholder="Custom MQTT broker URL"
        disabled
        className="w-full bg-gray-200 rounded-full mt-4 mb-4 py-2 px-4 text-gray-500 cursor-not-allowed"
      />
      <hr className="border-gray-300" />

      <button className="w-full bg-red-500 text-white rounded-full py-2 mt-4 hover:bg-gray-900 transition">
        RESET NETWORK
      </button>
    </div>
  );
};

export default Network;
