import React, { useContext } from "react";
import { Context } from "../context/Context";
import dayjs from "dayjs";

// const projects = [
//   {
//     name: "Road Layout Survey",
//     createdOn: "Jan 15, 2025",
//     lastModified: "Feb 10, 2025",
//     status: "In Progress",
//   },
//   {
//     name: "Building Site Mapping",
//     createdOn: "Jan 15, 2025",
//     lastModified: "Feb 10, 2025",
//     status: "Completed",
//   },
//   {
//     name: "Farm Land Measurement",
//     createdOn: "Jan 15, 2025",
//     lastModified: "Feb 10, 2025",
//     status: "Completed",
//   },
//   {
//     name: "Farm Land Measurement",
//     createdOn: "Jan 15, 2025",
//     lastModified: "Feb 10, 2025",
//     status: "Pending",
//   },
//   {
//     name: "Farm Land Measurement",
//     createdOn: "Jan 15, 2025",
//     lastModified: "Feb 10, 2025",
//     status: "Completed",
//   },
//   {
//     name: "Farm Land Measurement",
//     createdOn: "Jan 15, 2025",
//     lastModified: "Feb 10, 2025",
//     status: "Completed",
//   },
// ];

const Projects = () => {
  const { navigate, projects } = useContext(Context);

  return (
    <div>
      <div
        className="grid grid-cols-4 gap-4"
        style={{ gridTemplateRows: "80px auto" }}
      >
        <div className="col-span-4 flex items-center justify-between">
          {/* Left side: Title & Subtitle */}
          <div>
            <h1 className="text-2xl font-semi-bold">Projects</h1>
            <p className="text-xs mt-1">Manage your all projects</p>
          </div>

          {/* Right side: "Add New Project" Button */}
          <button
            className="flex items-center gap-1 text-s px-4 py-2 bg-black text-white rounded-lg"
            onClick={() => {
              navigate("/newproject");
            }}
          >
            <span>+</span>
            Add New Project
          </button>
        </div>

        <div className="col-span-3  bg-white p-4 rounded-lg">
          <div className="bg-white p-4 rounded-lg">
            <div className="overflow-x-auto">
              <table
                className="w-full text-sm text-left border-separate border-spacing-y-2"
                style={{ borderCollapse: "separate" }}
              >
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Project
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Created On
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Last Modified
                    </th>
                    <th scope="col" className="px-12 py-3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project, index) => {
                    // Declare variables here
                    const createdOn = dayjs(project.Created_On).format(
                      "MMM D, YYYY"
                    );
                    const lastModified = dayjs(project.Last_Modified).format(
                      "MMM D, YYYY"
                    );

                    // Return JSX
                    return (
                      <tr
                        key={index}
                        style={{ backgroundColor: "rgba(197,197,198,1)" }}
                      >
                        <td className="px-6 py-4 rounded-l-lg">
                          {project.Name}
                        </td>
                        <td className="px-6 py-4">{createdOn}</td>
                        <td className="px-6 py-4">{lastModified}</td>

                        <td className="px-8 py-4 rounded-r-lg">
                          <span
                            className={`px-3 py-1 text-sm font-semibold ${
                              project.Status === "Active"
                                ? "text-blue-700"
                                : project.Status === "Pending"
                                ? "text-orange-500"
                                : "text-green-700"
                            }`}
                          >
                            {project.Status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
