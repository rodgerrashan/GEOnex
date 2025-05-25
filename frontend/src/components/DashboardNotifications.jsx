import React, { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import dayjs from "dayjs";
import { CheckCircle, Circle, Bell, X } from "lucide-react";

const DashboardNotifications = ({ userId }) => {
  const { notifications, getNotificationsData, navigate, markAsRead } = useContext(Context);
  const [shownNotificationIds, setShownNotificationIds] = useState(new Set());
  const [showToast, setShowToast] = useState(false);
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const [toastNotifications, setToastNotifications] = useState([]);

  useEffect(() => {
    getNotificationsData(userId);
  }, [userId]);

  useEffect(() => {
    const newNotifications = notifications.filter(note => !shownNotificationIds.has(note.id));
    
    if (newNotifications.length > 0) {
      // Show initial browser notification with count
      if (Notification.permission === "granted") {
        new Notification("You have new notifications", {
          body: `${newNotifications.length} new notification${newNotifications.length > 1 ? 's' : ''}`,
          icon: "/favicon.ico" // optional icon
        });
      }

      // Show detailed toast notifications
      setNewNotificationCount(newNotifications.length);
      setToastNotifications(newNotifications);
      setShowToast(true);

      // Update shown notifications
      setShownNotificationIds(prev => {
        const newSet = new Set(prev);
        newNotifications.forEach(note => newSet.add(note.id));
        return newSet;
      });

      // Auto-hide toast after 5 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    }
  }, [notifications, shownNotificationIds]);

  const handleMarkAsRead = (noteId) => {
    markAsRead(noteId);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  const recentNotifications = [...notifications]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  return (
    <>
      {/* Toast Notification Overlay */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 animate-slide-in">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="font-semibold text-gray-900">
                  {newNotificationCount} New Notification{newNotificationCount > 1 ? 's' : ''}
                </h3>
              </div>
              <button
                onClick={handleCloseToast}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {toastNotifications.slice(0, 3).map((note, index) => (
                <div key={note.id} className="text-sm text-gray-700 p-2 bg-gray-50 rounded">
                  <div className="font-medium">{note.message}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {dayjs(note.timestamp).format("MMM D, HH:mm")}
                  </div>
                </div>
              ))}
              {toastNotifications.length > 3 && (
                <div className="text-xs text-blue-600 text-center py-1">
                  +{toastNotifications.length - 3} more notifications
                </div>
              )}
            </div>
            <button
              onClick={() => {
                navigate("/notifications");
                setShowToast(false);
              }}
              className="w-full mt-3 px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
            >
              View All Notifications
            </button>
          </div>
        </div>
      )}

      {/* Main Notifications Panel */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Bell className="h-6 w-6 text-gray-600 mr-2" />
            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900">
              Notifications
            </h2>
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </div>
          <button
            className="text-sm md:text-base lg:text-lg px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            onClick={() => navigate("/notifications")}
          >
            View All
          </button>
        </div>

        <div className="space-y-2">
          {recentNotifications.length > 0 ? (
            recentNotifications.map((note, index) => (
              <div
                key={note.id || index}
                className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer group ${
                  note.read 
                    ? "bg-gray-50 border-gray-100 text-gray-600" 
                    : "bg-blue-50 border-blue-100 text-gray-900 shadow-sm"
                } hover:shadow-md hover:border-blue-200`}
                onClick={() => note.link && navigate(note.link)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm md:text-base font-medium mb-1 ${
                      note.read ? "text-gray-600" : "text-gray-900"
                    }`}>
                      {note.message}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <span>{dayjs(note.timestamp).format("MMM D, YYYY • HH:mm")}</span>
                      {!note.read && (
                        <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                  </div>
                  <button
                    className={`ml-3 p-1 rounded-full transition-colors ${
                      note.read 
                        ? "text-green-500 hover:text-green-600 hover:bg-green-50" 
                        : "text-gray-400 hover:text-green-500 hover:bg-green-50"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(note.id);
                    }}
                    title={note.read ? "Read" : "Mark as read"}
                  >
                    {note.read ? <CheckCircle size={18} /> : <Circle size={18} />}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No notifications yet.</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default DashboardNotifications;