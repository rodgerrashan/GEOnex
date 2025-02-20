import React, { useContext }  from "react";
import { assets } from "../assets/assets";
import { Context } from "../context/Context";

const PointSurvey = () => {
  const { navigate } = useContext(Context);

  return (
    <div>
      <div className="grid grid-cols-2 grid-rows-7 gap-4 h-screen">
        {/* Header row with left group and right button */}
        <div className="col-span-2 flex items-center justify-between">
          {/* Left group: arrow and title */}
          <div className="flex items-center gap-3">
            {/* Left arrow button */}
            <button
              className="text-2xl"
              onClick={() => {
                navigate("/newproject");
              }}
            >
              <img className="w-8 h-8" src={assets.arrow} alt="Go back" />
            </button>

            {/* Title & subtitle */}
            <div>
              <h1 className="text-2xl font-semibold">Point Survey</h1>
              <p className="text-xs mt-1">Feel free to do surveys</p>
            </div>
          </div>

          {/* Right side: "Proceed" Button */}
          <button
            className="flex items-center gap-1 text-s px-10 py-2 bg-black text-white rounded-xl"
            onClick={() => {
              navigate("/newproject");
            }}
          >
            Proceed <span>→</span>
          </button>

        </div>
      </div>
    </div>
  );
};

export default PointSurvey;
