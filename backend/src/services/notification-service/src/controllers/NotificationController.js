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
    const { userId, numofnotifications } = req.params;

    const limit = parseInt(numofnotifications) || 10; 
    const notifications = await Notifications.find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit);
    res.status(200).json({ success: true, notifications });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching notifications", error: error.message });
  }
};

// Mark specific notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.body; 

    if (!id) {
      return res.status(400).json({ success: false, message: "notification id is required" });
    }

    const notification = await Notifications.findByIdAndUpdate(
      id,
      { $set: { read: true } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({ success: true, message: "Notification marked as read" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating notification", error: error.message });
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
