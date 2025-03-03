import React, { useContext }  from "react";
import { assets } from "../assets/assets";
import RecentProjects from "../components/RecentProjects";
import { Context } from "../context/Context";

const Home = () => {

  const { navigate } = useContext(Context);

  return (
    <div>
      <div
        className="grid grid-cols-4 gap-4"
        style={{ gridTemplateRows: "80px 80px auto" }}
      >
        <div className="col-span-4 flex items-center justify-between">
          {/* Left side: Title & Subtitle */}
          <div>
            <h1 className="text-2xl font-semi-bold">Hello User</h1>
            <p className="text-xs mt-1">Welcome to Site Measurement IoT</p>
          </div>

          {/* Right side: "Add New Project" Button */}
          <button
            className="flex items-center gap-1 text-s px-4 py-2 bg-black text-white rounded-lg"
            onClick={() => {
              navigate('/newproject')
            }}
          >
            <span>+</span>
            Add New Project
          </button>
        </div>

        <div className="col-span-1 bg-white rounded-lg flex gap-2 p-2">
          <img className="w-12 h-12" src={assets.base} alt="Base" />
          <div style={{ lineHeight: "0.8" }}>
            <p className="text-xs" style={{ margin: "0" }}>
              Base Station
            </p>
            <p
              className="font-semibold text-xl"
              style={{ margin: "0", marginTop: "-2px" }}
            >
              BS192
            </p>
            <p
              className="text-xs"
              style={{
                fontSize: "10px",
                color: "blue",
                margin: "0",
                marginTop: "-2px",
              }}
            >
              Signal Strength: Good
            </p>
            <p
              className="text-xs"
              style={{ fontSize: "10px", margin: "0", marginTop: "-2px" }}
            >
              Connected
            </p>
          </div>
        </div>

        <div className="col-span-1 bg-white rounded-lg flex gap-2 p-2">
          <div>
            <p className="font-semi-bold text-3xl">1</p>
          </div>
          <div>
            <p className="font-semi-bold text-lg">Client Connected</p>
            <p className="text-xs mt-1">RC002</p>
          </div>
        </div>

        <div className="col-span-3  bg-white p-4 rounded-lg">
          <RecentProjects />
        </div>
      </div>
    </div>
  );
};

export default Home;
