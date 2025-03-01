import React, { useContext, useState} from "react";
import { assets } from "../assets/assets";
import { Context } from "../context/Context";
import axios from "axios";
import { toast } from "react-toastify";

const NewProject = () => {
  const { navigate, backendUrl } = useContext(Context);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    try {
      // Create payload with project name and description
      const payload = {
        Name: projectName,
        Description: description,
      };

      // POST to your create project endpoint
      const response = await axios.post( backendUrl + '/api/projects/', payload);
      console.log("Project created:", response.data);
      // On success, navigate to the survey page.
      navigate("/pointsurvey");
    } catch (error) {
      toast.error(
        `Error creating project: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 grid-rows-7 gap-4 h-screen">
        <div className="col-span-2 flex items-center gap-3">
          {/* Left arrow button */}
          <button
            className="text-2xl"
            onClick={() => {
              navigate("/");
            }}
          >
            <img className="w-8 h-8" src={assets.arrow} alt="goback" />
          </button>

          {/* Title & subtitle */}
          <div>
            <h1 className="text-2xl font-semibold">Add New Project</h1>
            <p className="text-xs mt-1">Setup your new project</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="col-span-1 row-span-6 bg-white p-4 rounded-lg flex flex-col gap-4">
          {/* Project Name */}
          <div className="flex items-center gap-10">
            <label className="text-sm font-semibold" htmlFor="projectName">
              Project Name
            </label>
            <input
              id="projectName"
              type="text"
              className="flex-1 rounded-xl p-1  pl-5 text-sm "
              style={{ backgroundColor: "rgba(232, 232, 232, 1)" }}
              value={projectName}
              placeholder="Enter project name"
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          <div className="relative">
            <select
              id="baseStation"
              className="
                    appearance-none
                    w-full
                    rounded-xl
                    p-2
                    text-sm
                    pr-8 
                    "
              style={{ backgroundColor: "rgba(232, 232, 232, 1)" }}
              defaultValue=""
            >
              <option value="">Select the Base Station</option>
              <option value="BS001">BS001</option>
              <option value="BS002">BS002</option>
              <option value="BS192">BS192</option>
            </select>

            {/* Custom down arrow image */}
            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
              <img src={assets.down} alt="Down arrow" className="w-4 h-4" />
            </div>
          </div>


          {/* Available Client Devices */}
          <div>
            <p className="text-sm font-semibold">Available Client Devices</p>
            <div className="flex flex-col gap-2 mt-2 p-2 rounded-xl"
                style={{ backgroundColor: "rgba(232, 232, 232, 1)" }}
            >
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="clientDevice" value="RC002" />
                <span>
                  RC002
                  <span className="ml-10 text-xs text-gray-500 ">
                    Description #001 Lynx
                  </span>
                </span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="clientDevice" value="RC059" />
                <span>
                  RC059
                  <span className="ml-10 text-xs text-gray-500 ">
                    Descr #0239 Sheen
                  </span>
                </span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="clientDevice" value="RC058" />
                <span>
                  RC058
                  <span className="ml-10 text-xs text-gray-500">
                    Description_01L
                  </span>
                </span>
              </label>
            </div>
          </div>


          {/* Description */}
          <div>
            <label
              className="block text-sm font-semibold"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              className="mt-1 w-full h-32 rounded-lg p-2 text-sm"
              placeholder="Short description of the project"
              style={{ backgroundColor: "rgba(232, 232, 232, 1)" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Start Survey Button */}
          <button
            className="mt-auto w-full bg-black text-white py-2 rounded-md text-sm font-semibold"
            onClick={handleSubmit}
          >
            Start Survey
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewProject;
