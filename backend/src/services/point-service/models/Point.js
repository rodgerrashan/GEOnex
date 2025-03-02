const mongoose = require("mongoose");

const PointSchema = new mongoose.Schema({
  ProjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  Name: { type: String, required: true },
  Type: { type: String },
  Latitude: { type: Number, required: true },
  Longitude: { type: Number, required: true },
  Accuracy: { type: Number, default: null},
  Timestamp: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Point", PointSchema);
