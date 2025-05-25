import React, { useContext, useEffect, useState, useCallback } from "react";
import { CheckCircle, Circle, Bell, X, Settings } from "lucide-react";
import { Context } from "../context/Context";






const DashboardNotifications = ({ userId = "demo-user" }) => {


  const { notifications, getNotificationsData, navigate, markAsRead } = useContext(Context);
  
  const [shownNotificationIds, setShownNotificationIds] = useState(new Set());
  const [showToast, setShowToast] = useState(false);
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const [toastNotifications, setToastNotifications] = useState([]);
  const [notificationSettings, setNotificationSettings] = useState({
    browserNotifications: true,
    toastNotifications: true,
    autoHideDelay: 5000,
    maxToastItems: 3,
    soundEnabled: false
  });
  const [permissionStatus, setPermissionStatus] = useState('default');

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setPermissionStatus(permission);
        return permission === 'granted';
      } catch (error) {
        console.warn('Error requesting notification permission:', error);
        setPermissionStatus('denied');
        return false;
      }
    }
    return false;
  }, []);

  // Check notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  // Fetch notifications data
  useEffect(() => {
    if (userId) {
      try {
        getNotificationsData(userId);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }
  }, [userId, getNotificationsData]);

  // Format date safely
  const formatDate = useCallback((timestamp) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown time';
    }
  }, []);

  // Handle new notifications
  useEffect(() => {
    if (!Array.isArray(notifications)) return;

    const newNotifications = notifications.filter(note => 
      note && note.id && !shownNotificationIds.has(note.id) && !note.read
    );
    
    if (newNotifications.length > 0) {
      // Show browser notification
      if (notificationSettings.browserNotifications && permissionStatus === 'granted') {
        try {
          const notification = new Notification("You have new notifications", {
            body: `${newNotifications.length} new notification${newNotifications.length > 1 ? 's' : ''}`,
            icon: "/favicon.ico",
            tag: 'dashboard-notifications',
            requireInteraction: false
          });

          // Auto close browser notification after 4 seconds
          setTimeout(() => {
            if (notification) notification.close();
          }, 4000);
        } catch (error) {
          console.warn('Error showing browser notification:', error);
        }
      }

      // Show toast notifications
      if (notificationSettings.toastNotifications) {
        setNewNotificationCount(newNotifications.length);
        setToastNotifications(newNotifications);
        setShowToast(true);

        // Auto-hide toast
        setTimeout(() => {
          setShowToast(false);
        }, notificationSettings.autoHideDelay);
      }

      // Update shown notifications
      setShownNotificationIds(prev => {
        const newSet = new Set(prev);
        newNotifications.forEach(note => newSet.add(note.id));
        return newSet;
      });
    }
  }, [notifications, shownNotificationIds, notificationSettings, permissionStatus]);

  const handleMarkAsRead = useCallback((id) => {
    try {
      markAsRead(id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [markAsRead]);

  const handleMarkAllAsRead = useCallback(() => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      unreadNotifications.forEach(note => markAsRead(note._id));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [notifications, markAsRead]);

  const handleCloseToast = useCallback(() => {
    setShowToast(false);
  }, []);

  const handleNavigate = useCallback((path) => {
    try {
      if (path) {
        navigate(path);
      }
    } catch (error) {
      console.error('Error navigating:', error);
    }
  }, [navigate]);

  const getPriorityColor = useCallback((priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  }, []);

  const recentNotifications = React.useMemo(() => {
    if (!Array.isArray(notifications)) return [];
    
    return [...notifications]
      .filter(note => note && note.timestamp)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);
  }, [notifications]);

  const unreadCount = React.useMemo(() => {
    return Array.isArray(notifications) ? notifications.filter(n => n && !n.read).length : 0;
  }, [notifications]);

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
                aria-label="Close notifications"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {toastNotifications.slice(0, notificationSettings.maxToastItems).map((note, index) => (
                <div 
                  key={note.id || index} 
                  className={`text-sm text-gray-700 p-2 rounded cursor-pointer hover:bg-gray-100 transition-colors ${getPriorityColor(note.priority)}`}
                  onClick={() => {
                    handleNavigate(note.link);
                    handleCloseToast();
                  }}
                >
                  <div className="font-medium">{note.message || 'No message'}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatDate(note.timestamp)}
                  </div>
                </div>
              ))}
              {toastNotifications.length > notificationSettings.maxToastItems && (
                <div className="text-xs text-blue-600 text-center py-1">
                  +{toastNotifications.length - notificationSettings.maxToastItems} more notifications
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => {
                  handleNavigate("/notifications");
                  handleCloseToast();
                }}
                className="flex-1 px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
              >
                View All
              </button>
              <button
                onClick={() => {
                  handleMarkAllAsRead();
                  handleCloseToast();
                }}
                className="px-3 py-1.5 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
              >
                Mark All Read
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Notifications Panel */}
      <div className="bg-white p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Bell className="h-6 w-6 text-gray-600 mr-2" />
            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {permissionStatus !== 'granted' && (
              <button
                onClick={requestNotificationPermission}
                className="text-xs px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full hover:bg-yellow-200 transition-colors"
                title="Enable browser notifications"
              >
                Enable Notifications
              </button>
            )}
            <button
              className="text-sm md:text-base lg:text-lg px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
              onClick={() => handleNavigate("/notifications")}
            >
              View All
            </button>
          </div>
        </div>

        {unreadCount > 0 && (
          <div className="mb-4 flex justify-end">
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-3 py-1 rounded transition-colors"
            >
              Mark all as read
            </button>
          </div>
        )}

        <div className="space-y-2">
          {recentNotifications.filter(note => !note.read).length > 0 ? (
            recentNotifications
              .filter(note => !note.read)
              .map((note, index) => (
                <div
                  key={note.id || index}
                  className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer group shadow-sm hover:shadow-md ${getPriorityColor(note.priority)}`}
                  onClick={() => handleNavigate(note.link)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm md:text-base font-medium mb-1 text-gray-900">
                        {note.message || 'No message available'}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <span>{formatDate(note.timestamp)}</span>
                        <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                        {note.priority && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full capitalize">
                            {note.priority}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      className="ml-3 p-1 rounded-full transition-colors text-gray-400 hover:text-green-500 hover:bg-green-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(note._id);
                      }}
                      title="Mark as read"
                      aria-label="Mark notification as read"
                    >
                      <Circle size={18} />
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No unread notifications.</p>
              <p className="text-gray-400 text-xs mt-1">You're all caught up!</p>
            </div>
          )}
        </div>

        {/* Show read notifications if no unread ones */}
        {recentNotifications.filter(note => !note.read).length === 0 && recentNotifications.filter(note => note.read).length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h3>
            <div className="space-y-2">
              {recentNotifications.filter(note => note.read).slice(0, 3).map((note, index) => (
                <div
                  key={note.id || index}
                  className="p-3 rounded-lg bg-gray-50 border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors opacity-75"
                  onClick={() => handleNavigate(note.link)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-700 mb-1">
                        {note.message || 'No message available'}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <span>{formatDate(note.timestamp)}</span>
                        <CheckCircle className="ml-2 w-3 h-3 text-green-500" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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