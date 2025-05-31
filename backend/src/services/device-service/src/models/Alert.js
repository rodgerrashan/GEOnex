const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  deviceId: { type: String, ref: "Device" },
  status:{ type: String, required: true }, 
  code: { type: String, required: true }, 
  created_At: { type: Date, default: Date.now },
});

const Alert = mongoose.models.Alert || mongoose.model('Alert', alertSchema);
module.exports = Alert;
