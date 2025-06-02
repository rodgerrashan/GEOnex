const User = require("../models/User");
const Settings = require("../models/Settings");
// const Device = require("../../device-service/models/Device");
const { get } = require("mongoose");
// const Alert = require("../../device-service/models/Alert");
const bcrypt = require("bcryptjs");

const getUserData = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      userData: {
        name: user.name,
        userId: user._id,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // basic presence checks
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match." });
    }

    // optional strength check
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    // fetch user
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect." });
    }

    // hash & save new password
    user.password = await bcrypt.hash(newPassword, 10);
  
    await user.save();

    return res.json({ success: true, message: "Password updated." });
  } catch (err) {
    console.error("Change-password error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error. Try again later." });
  }
};

// get settings data
const getSettingsData = async (req, res) => {
  try {
    const userId = req.userId;

    let settings = await Settings.findOne({ userId });

    if (!settings) {
      // Optionally create default settings if not found
      settings = new Settings({ userId });
      await settings.save();
    }

    res.json({
      success: true,
      Data: settings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// update current user's settings
const updateSettingsData = async (req, res) => {
  try {
    const userId = req.userId;
    const updates = req.body; // Expect nested object like { system: {...}, device: {...} }

    let settings = await Settings.findOne({ userId });
    if (!settings) {
      settings = new Settings({ userId });
    }

    // Merge nested updates deeply
    function deepMerge(target, source) {
      for (const key of Object.keys(source)) {
        if (
          source[key] instanceof Object &&
          key in target &&
          target[key] instanceof Object
        ) {
          deepMerge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    }
    deepMerge(settings, updates);

    await settings.save();
    res.json({
      success: true,
      Data: settings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// reset settings to default
const resetSettingsData = async (req, res) => {
  try {
    const userId = req.userId;

    // Delete current settings doc
    await Settings.findOneAndDelete({ userId });

    // Create new with defaults
    const settings = new Settings({ userId });
    await settings.save();

    res.json({
      success: true,
      Data: settings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
const Device = require('../models/Device'); 
const Alert = require('../models/Alert'); 

const addDeviceToUser = async (req, res) => {
  const userId = req.params.userId;
  const { DeviceCode } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const device = await Device.findOne({ DeviceCode: DeviceCode });
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    // Check if the device is already assigned to the user
    if (user.connectedDevices.includes(device._id)) {
      return res
        .status(400)
        .json({ message: "Device is already assigned to this user" });
    }

    // Add device to user's connectedDevices
    user.connectedDevices.push(device._id);
    await user.save();

    res.status(200).json({
      message: "Device added to user successfully",
      connectedDevices: user.connectedDevices,
    });
  } catch (error) {
    console.error("Error assigning device to user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserDevices = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId).populate("connectedDevices");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.connectedDevices.length === 0) {
      console.log("No devices found for this user");
      return res
        .status(404)
        .json({ message: "No devices found for this user" });
    }
    console.log("User devices:", user.connectedDevices);
    res.status(200).json({ connectedDevices: user.connectedDevices });
  } catch (error) {
    console.error("Error fetching user devices:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const removeDeviceFromUser = async (req, res) => {
  const userId = req.params.userId;
  const { deviceId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the device is assigned to the user
    if (!user.connectedDevices.includes(deviceId)) {
      return res
        .status(400)
        .json({ message: "Device is not assigned to this user" });
    }

    // Remove device from user's connectedDevices
    user.connectedDevices = user.connectedDevices.filter(
      (device) => device.toString() !== deviceId
    );
    await user.save();

    res.status(200).json({
      message: "Device removed from user successfully",
      connectedDevices: user.connectedDevices,
    });
  } catch (error) {
    console.error("Error removing device from user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserBases = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId).populate("connectedDevices");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter the devices to get only base stations
    const baseStations = user.connectedDevices.filter(
      (device) => device.Type === "base"
    );
    console.log("User base stations:", baseStations);
    res.status(200).json({ connectedDevices: baseStations });
  } catch (error) {
    console.error("Error fetching user base stations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserClientDevices = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId).populate("connectedDevices");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter the devices to get only base stations
    const clientDevices = user.connectedDevices.filter(
      (device) => device.Type === "rover"
    );
    console.log("User base stations:", clientDevices);
    res.status(200).json({ connectedDevices: clientDevices });
  } catch (error) {
    console.error("Error fetching user client Devices:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserRegisteredDevices = async (req, res) => {
  const userId = req.params.userId;

  try {
    const devices = await Device.find({ Registered_User_Id: userId });

    if (!devices || devices.length === 0) {
      return res.status(404).json({ message: "Registered devices not found" });
    }

    console.log(devices);
    res.status(200).json({ devices });
  } catch (error) {
    console.error("Error fetching user registered devices:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserDeviceAlerts = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId).populate("connectedDevices");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get array of device IDs
    const deviceIds = user.connectedDevices.map((device) => device._id);

    // Find the latest 5 alerts for these devices
    const alerts = await Alert.find({
      deviceId: { $in: deviceIds },
    })
      .sort({ created_At: -1 }) // Ensure this matches your schema's timestamp field
      .limit(5);

    if (!alerts || alerts.length === 0) {
      return res
        .status(200)
        .json({ message: "No alerts found for user devices" });
    }

    res.status(200).json({ alerts });
  } catch (error) {
    console.error("Error fetching device alerts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getUserData,
  addDeviceToUser,
  getUserDevices,
  removeDeviceFromUser,
  getUserBases,
  getUserClientDevices,
  getUserRegisteredDevices,
  getUserDeviceAlerts,
  getSettingsData,
  updateSettingsData,
  resetSettingsData,
  changePassword,
};
