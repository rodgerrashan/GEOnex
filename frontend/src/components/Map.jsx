import React from "react";

const Map = ({ data = {}, onChange }) => {
  const {
    accuracyCircles = "Show",   // "Show" | "Hide"
    provider        = "OpenStreetMap", // fixed for now
    theme           = "Light",  // "Light" | "Dark"
  } = data;

  return (
    <div>
      <h2 className="font-semibold text-xl">Map</h2>

      {/* Accuracy circles */}
      <div className="flex items-center justify-between mt-4">
        <span>Accuracy Circles</span>
        <select
          value={accuracyCircles}
          onChange={(e) => onChange("accuracyCircles", e.target.value)}
          className="text-blue-600 cursor-pointer rounded px-2 py-1 dark:text-indigo-400 dark:bg-gray-800 outline-none"
        >
          <option value="Show">Show</option>
          <option value="Hide">Hide</option>
        </select>
      </div>
      <hr className="border-gray-300 dark:border-gray-600" />

      {/* Provider (readonly) */}
      <div className="flex items-center justify-between mt-4">
        <span>Provider</span>
        <span className="text-gray-500 dark:text-gray-300">{provider}</span>
      </div>
      <hr className="border-gray-300 dark:border-gray-600" />

      {/* Theme */}
      <div className="flex items-center justify-between mt-4">
        <span>Theme</span>
        <select
          value={theme}
          onChange={(e) => onChange("theme", e.target.value)}
          className="text-blue-600 cursor-pointer rounded px-2 py-1 outline-none dark:text-indigo-400 dark:bg-gray-800"
        >
          <option value="Light">Light</option>
          <option value="Dark">Dark</option>
        </select>
      </div>
    </div>
  );
};

export default Map;
