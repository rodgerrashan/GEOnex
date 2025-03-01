import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Devices from "./pages/Devices";
import Projects from "./pages/Projects";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import NewProject from "./pages/NewProject";
import PointSurvey from "./pages/PointSurvey";
import ProjectDetails from "./pages/ProjectDetails";
import TakenPoints from "./pages/TakenPoints";

const App = () => {
  return (
    <div>
      <div className="flex w-full"
      style={{ backgroundColor: 'rgba(232, 232, 232, 1)' }}
      >
        <Navbar />
        <div className="w-[75%] mx-auto ml-[max(5vw,25px)] my-8">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/devices" element={<Devices />} />

            <Route path="/projects" element={<Projects />} />

            <Route path="/settings" element={<Settings />} />

            <Route path="/login" element={<Login />} />

            <Route path="/newproject" element={<NewProject />} />

            <Route path="/pointsurvey" element={<PointSurvey />} />

            <Route path="/projectdetails" element={<ProjectDetails />} />

            <Route path="/takenpoints" element={<TakenPoints />} />

          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
