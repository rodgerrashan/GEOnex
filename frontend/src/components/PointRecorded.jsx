import React, { useState, useContext } from "react";
import { Context } from "../context/Context";
import axios from "axios";
import { toast } from "react-toastify";

const PointRecorded = ({ sensorData, projectId }) => {
  const { backendUrl, setShowPointRecorded, fetchPoints  } = useContext(Context);

  const [pointName, setPointName] = useState("New Point");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    // Ensure sensor data is available
    if (!sensorData.latitude || !sensorData.longitude) {
      toast.error("No sensor data available to record a point.");
      return;
    }
    setLoading(true);
    const payload = {
      ProjectId: projectId,
      Name: pointName,
      Type: "recorded",
      Latitude: sensorData.latitude,
      Longitude: sensorData.longitude,
      Accuracy: sensorData.accuracy || null,
      Timestamp: new Date().toISOString(),
    };

    try {
      const response = await axios.post(`${backendUrl}/api/points`, payload);
      if (response.data._id) {
        toast.success("Point recorded successfully.");
        // Refresh the points list so the new point appears on the map
        await fetchPoints(projectId);
        setShowPointRecorded(false);
      } else {
        toast.error("Failed to record point.");
      }
    } catch (error) {
      console.error("Error recording point:", error);
      toast.error("Error recording point.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-white p-2 rounded-2xl shadow-lg 
      w-full md:w-[280px] 
      text-center">
        {/* Title */}
        <h2 className="sm:text-lg md:text-xl font-bold">Point Recorded !</h2>
        <p className="text-green-500 text-sm  md:text-base font-semibold mt-1">
          Accuracy: Good
        </p>

        {/* Divider */}
        <div className="border-t border-black my-3"></div>

        <div className="mt-4 px-4">
          <label className="block text-sm md:text-base text-gray-700">
            Rename the new point
          </label>
          <input
            type="text"
            value={pointName}
            onChange={(e) => setPointName(e.target.value)}
            className="w-full  mt-1 p-1 border rounded-xl text-sm md:text-base text-center"
            style={{ backgroundColor: "rgba(232, 232, 232, 1)" }}
          />
        </div>


        {/* Buttons */}
        <div className="mt-4 px-4 flex flex-col gap-2 ">
          <button className="bg-black text-white p-2 rounded-xl text-sm md:text-base"
          onClick={handleSave}
          disabled={loading}
          >
            {loading ? "Saving..." : "Rename & Save"}
          </button>

          <button
            className="border border-black p-1 rounded-xl text-sm md:text-base mb-2"
            style={{ backgroundColor: "rgba(232, 232, 232, 1)" }}
            onClick={() => setShowPointRecorded(false)}
            disabled={loading}
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PointRecorded;
