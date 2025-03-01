import React, { useContext } from "react";
import { Context } from "../context/Context";
import dayjs from "dayjs";

const RecentProjects = () => {
  const { navigate, projects } = useContext(Context);

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.Last_Modified) - new Date(a.Last_Modified))
    .slice(0, 4);

  return (
    <div className="bg-white p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Projects</h2>
        <button
          className="text-xs px-4 py-2"
          style={{ color: "blue" }}
          onClick={() => {
            navigate("/projects");
          }}
        >
          View All
        </button>
      </div>
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
              <th scope="col" className="px-6 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {recentProjects.map((project, index) => {
              // Declare variables here
              const createdOn = dayjs(project.Created_On).format("MMM D, YYYY");
              const lastModified = dayjs(project.Last_Modified).format(
                "MMM D, YYYY"
              );

              // Return JSX
              return (
                <tr
                  key={index}
                  style={{ backgroundColor: "rgba(197,197,198,1)" }}
                >
                  <td className="px-6 py-4 rounded-l-lg">{project.Name}</td>
                  <td className="px-6 py-4">{createdOn}</td>
                  <td className="px-6 py-4">{lastModified}</td>

                  <td className="px-6 py-4 rounded-r-lg">
                    <span
                      className={`px-1 py-1 text-sm font-semibold ${
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
  );
};

export default RecentProjects;
