import React, { useContext } from "react";
import { Context } from "../context/Context";

const PointRecorded = () => {
  const { setShowPointRecorded } = useContext(Context);

  return (
    <div>
      <div className="bg-white p-2 rounded-2xl shadow-lg w-[280px] text-center">
        {/* Title */}
        <h2 className="text-lg font-bold">Point Recorded !</h2>
        <p className="text-green-500 text-sm font-semibold mt-1">
          Accuracy: Good
        </p>

        {/* Divider */}
        <div className="border-t border-black my-3"></div>

        <div className="mt-4 px-4">
          <label className="block text-sm text-gray-700">
            Rename the new point
          </label>
          <input
            type="text"
            value="Point 4"
            className="w-full  mt-1 p-1 border rounded-xl text-sm text-center"
            style={{ backgroundColor: "rgba(232, 232, 232, 1)" }}
            readOnly
          />
        </div>


        {/* Buttons */}
        <div className="mt-4 px-4 flex flex-col gap-2 ">
          <button className="bg-black text-white p-2 rounded-xl text-sm">
            Rename & Save
          </button>

          <button
            className="border border-black p-1 rounded-xl text-sm mb-2"
            style={{ backgroundColor: "rgba(232, 232, 232, 1)" }}
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
