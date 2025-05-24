import React, { useContext, useEffect } from "react";
import { Context } from "../context/Context";
import dayjs from "dayjs";

const DashboardNotifications = ({ userId }) => {
  const { notifications, getNotificationsData, navigate } = useContext(Context);

  useEffect(() => {
    getNotificationsData(userId);
  }, [userId]);

  const recentNotifications = [...notifications]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  return (
    <div className="bg-white p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold">Notifications</h2>
        <button
          className="text-sm md:text-base lg:text-lg px-4 py-2 text-blue-600"
          onClick={() => navigate("/notifications")}
        >
          View All
        </button>
      </div>
      <ul className="divide-y divide-gray-200">
        
        {recentNotifications.length > 0 ? (
          recentNotifications.map((note, index) => (
            <li key={index} className="py-3 cursor-pointer hover:bg-gray-100 px-2 rounded-md"
                onClick={() => note.link && navigate(note.link)}>
              <div className="flex justify-between items-center">
                <div className="text-sm md:text-base">{note.message}</div>
                <div className="text-xs text-gray-500">
                  {dayjs(note.timestamp).format("MMM D, YYYY HH:mm")}
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="text-gray-500 text-sm">No notifications yet.</li>
        )}
      </ul>
    </div>
  );
};

export default DashboardNotifications;
