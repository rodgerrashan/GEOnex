import React, { useContext } from "react";
import { Context } from "../context/Context";

const PointRecorded = () => {

  const { setShowPointRecorded } = useContext(Context);

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-lg w-[300px] text-center">
        <h2 className="text-lg font-bold">Point Recorded !</h2>
        <p className="text-green-500">Accuracy: Good</p>

        <div className="mt-4">
          <label className="block text-sm text-gray-700">
            Rename the new point
          </label>
          <input
            type="text"
            value="Point 4"
            className="w-full mt-1 p-2 border rounded-md bg-gray-100 text-center"
            readOnly
          />
        </div>

        {/* Buttons */}
        <div className="mt-4 flex flex-col gap-2">
          <button className="bg-black text-white p-2 rounded-md">
            Rename & Save
          </button>
          <button
            className="border border-black p-2 rounded-md"
            onClick={() => setShowPointRecorded(false)}
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PointRecorded;
