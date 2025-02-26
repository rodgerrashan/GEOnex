const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Status: { type: String, enum: ["Online", "Offline"], required: true },
    Type: { type: String, required: true },
    Battery_Percentage: { type: Number, min: 0, max: 100 },
    Signal_Strength: { type: String, required: true },
    Last_Update: { type: Date, default: Date.now },
    Hardware_Id: { type: Number, required: true }
  });

const Device = mongoose.model("Device", deviceSchema);
module.exports = Device;