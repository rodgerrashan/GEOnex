import React, { useContext, useMemo } from "react";
import { assets } from "../assets/assets";
import RecentProjects from "../components/RecentProjects";
import { Context } from "../context/Context";

const Dashboard = () => {
  const { navigate, userData } = useContext(Context);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  // Use a constant or get this from context instead of hardcoding
  const userId = '681e012572b69cef1e2c116b'; // Replace with actual user ID

  // Memoize the RecentProjects component to prevent unnecessary re-renders
  const memoizedRecentProjects = useMemo(() => {
    return <RecentProjects userId={userId} />;
  }, [userId]); // Only re-render if userId changes

  return (
    <div>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4
        md:grid-rows-[80px_100px_auto]"
      >
        <div className="col-span-1 md:col-span-2 lg:col-span-4 
          flex items-center justify-between">
          {/* Left side: Title & Subtitle */}
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semi-bold">
              Hello {userData ? userData.name : 'User'}
            </h1>
            <p className="text-sm md:text-base lg:text-lg mt-1">
              Welcome to Site Measurement IoT
            </p>
          </div>

          {/* Right side: "Add New Project" Button */}
          <button
            className="flex text-sm md:text-lg lg:text-xl
            items-center gap-1 text-s px-4 py-2 bg-black text-white rounded-lg"
            onClick={() => {
              navigate(`/${userId}/newproject`)
            }}
          >
            <span>+</span>
            Add New Project
          </button>
        </div>

        <div className="col-span-1 bg-white rounded-lg flex gap-2 p-2 truncate">
          <img className="w-16 h-16" src={assets.base} alt="Base" />
          <div style={{ lineHeight: "0.8" }}>
            <p className="text-sm md:text-base lg:text-lg" style={{ margin: "0", marginTop: "-4px"  }}>
              Base Station
            </p>
            <p
              className="font-semibold text-xl md:text-2xl lg:text-2xl"
              style={{ margin: "0", marginTop: "-4px" }}
            >
              BS192
            </p>
            <p
              className="text-xs md:text-sm lg:text-base"
                style={{
                color: "blue",
                margin: "0",
                marginTop: "-3px",
              }}
            >
              Signal Strength: Good
            </p>
            <p
            className="text-xs md:text-sm lg:text-base"
              style={{ 
                margin: "0", 
                marginTop: "-4px" }}
            >
              Connected
            </p>
          </div>
        </div>

        <div className="col-span-1 bg-white rounded-lg flex gap-2 p-2">
          <div>
            <p className="font-semi-bold text-3xl md:text-4xl lg:text-5xl">1</p>
          </div>
          <div>
            <p className="font-semi-bold text-lg md:text-xl lg:text-2xl">Client Connected</p>
            <p className="text-sm md:text-base lg:text-lg mt-1">RC002</p>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white p-4 rounded-lg">
          {memoizedRecentProjects}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;