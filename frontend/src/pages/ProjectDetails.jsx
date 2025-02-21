import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { Context } from "../context/Context";

const ProjectDetails = () => {
  const { navigate } = useContext(Context);

  return (
    <div>
      <div className="grid grid-cols-3 grid-rows-7 gap-4 h-screen">
        <div className="col-span-3 flex items-center gap-3">
          {/* Left arrow button */}
          <button
            className="text-2xl"
            onClick={() => {
              navigate("/projects");
            }}
          >
            <img className="w-8 h-8" src={assets.arrow} alt="goback" />
          </button>

          {/* Title & subtitle */}
          <div>
            <h1 className="text-2xl font-semibold">Project Name</h1>
            <p className="text-xs mt-1">Here goes project description</p>
          </div>
        </div>

        {/* Actions Section (Left) */}
        <div className="col-span-1 row-span-6 bg-white p-4 rounded-lg flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Actions</h2>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100">
            <img className="w-8 h-8" src={assets.map} alt="View on Map" />
            <div>
              <h3 className="font-semibold">View on Map</h3>
              <p className="text-xs text-gray-600">
                See map and continue surveying
              </p>
            </div>
          </div>

          {/* Points */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100">
            <img className="w-8 h-8" src={assets.points} alt="Points" />
            <div>
              <h3 className="font-semibold">Points</h3>
              <p className="text-xs text-gray-600">
                See taken points, edit and delete
              </p>
            </div>
          </div>

          {/* Export Data */}
          <div className="bg-gray-100 p-3 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <img
                className="w-8 h-8"
                src={assets.export_data}
                alt="Export Data"
              />
              <div>
                <h3 className="font-semibold">Export Data</h3>
                <p className="text-xs text-gray-600">Select export format</p>
              </div>
            </div>
            <select className="w-full mb-2 p-2 rounded border border-gray-300 text-sm">
              <option value="dwg">dwg</option>
              <option value="png">png</option>
              <option value="pdf">pdf</option>
              <option value="jpeg">jpeg</option>
            </select>
            <button className="bg-black text-white px-8 py-1.5 rounded-xl text-sm">
              Export
            </button>
          </div>

          {/* Delete Project */}
          <div className="bg-red-100 p-3 rounded-lg">
            <h3 className="font-semibold text-red-600">Delete Project</h3>
            <p className="text-xs text-gray-600">
              This action cannot be undone
            </p>
          </div>
        </div>

        {/* Overview Section (Right) */}
        <div className="col-span-1 row-span-3 bg-white p-4 rounded-lg flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Overview</h2>
          <div className="flex justify-between">
            <span className="font-semibold">Created On</span>
            <span>Jan 15, 2025</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Last Modified</span>
            <span>10 mins ago</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Status</span>
            <span className="text-blue-600">In Progress</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Number of Points</span>
            <span>25</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Survey Time</span>
            <span>10 hrs</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
