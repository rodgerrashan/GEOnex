import React from 'react';

const projects = [
  { name: 'Road Layout Survey', createdOn: 'Jan 15, 2025', lastModified: 'Feb 10, 2025', status: 'In Progress' },
  { name: 'Building Site Mapping', createdOn: 'Jan 15, 2025', lastModified: 'Feb 10, 2025', status: 'Completed' },
  { name: 'Farm Land Measurement', createdOn: 'Jan 15, 2025', lastModified: 'Feb 10, 2025', status: 'Completed' }
];

const RecentProjects = () => {
  return (
    <div className="bg-white p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Projects</h2>
        <button className="text-xs px-4 py-2" style={{ color: 'blue'}}>View All</button>
      </div>
      <div className="overflow-x-auto">
  <table
    className="w-full text-sm text-left border-separate border-spacing-y-2"
    style={{ borderCollapse: 'separate' }}
  >
    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
      <tr>
        <th scope="col" className="px-6 py-3">Project</th>
        <th scope="col" className="px-6 py-3">Created On</th>
        <th scope="col" className="px-6 py-3">Last Modified</th>
        <th scope="col" className="px-12 py-3">Status</th>
      </tr>
    </thead>
    <tbody>
      {projects.map((project, index) => (
        <tr
          key={index}
          style={{ backgroundColor: 'rgba(197,197,198,1)' }}
        >
          <td className="px-6 py-4 rounded-l-lg">{project.name}</td>
          <td className="px-6 py-4">{project.createdOn}</td>
          <td className="px-6 py-4">{project.lastModified}</td>
          <td className="px-6 py-4 rounded-r-lg">
            <span
              className={`px-3 py-1 text-sm font-semibold ${
                project.status === 'In Progress'
                  ? 'text-blue-700'
                  : 'text-green-700'
              }`}
            >
              {project.status}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


    </div>
  );
};

export default RecentProjects;
