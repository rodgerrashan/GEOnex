const Notifications = require('../models/Notifications');

// Create a new notification
const addNotification = async (req, res) => {
  try {
    const { userId, message, type, link } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ success: false, message: "userId and message are required" });
    }

    const newNotification = new Notifications({
      userId,
      message,
      type: type || "general",
      link: link || ""
    });

    await newNotification.save();
    res.status(201).json({ success: true, message: "Notification added successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get all notifications for a user
const getNotificationsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await Notifications.find({ userId }).sort({ timestamp: -1 });
    res.status(200).json({ success: true, notifications });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching notifications", error: error.message });
  }
};

// Mark specific notification(s) as read
const markAsRead = async (req, res) => {
  try {
    const { ids } = req.body; // array of notification _ids

    if (!Array.isArray(ids)) {
      return res.status(400).json({ success: false, message: "ids must be an array" });
    }

    await Notifications.updateMany(
      { _id: { $in: ids } },
      { $set: { read: true } }
    );

    res.status(200).json({ success: true, message: "Notifications marked as read" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating notifications", error: error.message });
  }
};

// (Optional) Clear all notifications for a user
const clearNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    await Notifications.deleteMany({ userId });
    res.status(200).json({ success: true, message: "All notifications cleared for user" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error clearing notifications", error: error.message });
  }
};

module.exports = {
  addNotification,
  getNotificationsByUserId,
  markAsRead,
  clearNotifications
};
