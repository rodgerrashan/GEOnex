import React, { useContext, useState, useEffect} from "react";
import { Context } from "../context/Context";
import { assets } from "../assets/assets";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const TakenPoints = () => {
  const { navigate, points, setPoints, fetchPoints, loadingPoints, deletePoint } = useContext(Context);
  const { projectId } = useParams();

  // Fetch points from context when component mounts or projectId changes
  useEffect(() => {
    if (projectId) {
      fetchPoints(projectId);
    }
  }, [projectId]);
 
  // Use the context's deletePoint function
  const handleDeletePoint = async (pointId) => {
    if (!window.confirm("Are you sure you want to delete this point?")) return;
    await deletePoint(projectId, pointId);
  };

  return (
    <div>
      <div
        className="grid grid-cols-4 gap-4"
        style={{ gridTemplateRows: "80px auto" }}
      >
        {/* Header row with left group and right button */}
        <div className="col-span-4 flex items-center justify-between">
          {/* Left group: arrow and title */}
          <div className="flex items-center gap-3">
            {/* Left arrow button */}
            <button
              className="text-2xl"
              onClick={() => {
                navigate(`/pointsurvey/${projectId}`);
              }}
            >
              <img className="w-8 h-8" src={assets.arrow} alt="Go back" />
            </button>

            {/* Title & subtitle */}
            <div>
              <h1 className="text-2xl font-semibold">Taken Points</h1>
              <p className="text-xs mt-1">Play with points</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* refresh button */}
            <button
              className="text-2xl"
              //   onClick={() => {
              //     navigate("/");
              //   }}
            >
              <img className="w-7 h-7" src={assets.refresh} alt="refresh" />
            </button>

            <button
              className="flex items-center gap-1 text-s px-10 py-2 bg-black text-white rounded-xl"
                onClick={() => {
                  navigate(`/project/${projectId}`);
                }}
            >
              Save Changes
            </button>
          </div>
        </div>

        <div className="col-span-4">
          <div className=" p-4 ">
            <div className="overflow-x-auto"></div>
            {loadingPoints && <p>Loading points...</p>}
            {!loadingPoints  && (
              <table
                className="w-full text-sm text-left border-separate border-spacing-y-2"
                style={{ borderCollapse: "separate" }}
              >
                <thead className="text-xs text-gray-700 uppercase">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Point
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Latitude
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Longitude
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Accuracy
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Timestamp
                    </th>
                    <th scope="col" className="px-10 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {points.map((point,index) => (
                    <tr
                      key={point._id || index}
                      style={{ backgroundColor: "rgba(217,217,217,1)" }}
                    >
                      <td className="px-6 py-4 rounded-l-lg">{point.Name}</td>
                      <td className="px-6 py-4">{point.Latitude}</td>
                      <td className="px-6 py-4">{point.Longitude}</td>

                      <td className="px-8 py-4">N/A</td>
                      <td className="px-6 py-4">{new Date(point.Timestamp).toLocaleString()}</td>

                      <td className="px-6 py-4 rounded-r-lg">
                        <button className="text-white text-xs bg-black hover:text-blue-700 mr-2 px-2 py-1 rounded-lg">
                          Rename
                        </button>
                        <button className="text-white text-xs bg-red-500 hover:text-red-700 px-2 py-1 rounded-lg"
                        onClick={() => handleDeletePoint(point._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakenPoints;
