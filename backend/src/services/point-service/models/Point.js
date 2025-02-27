const mongoose = require("mongoose");

const PointSchema = new mongoose.Schema({
  Point_Id: { type: Number, required: true, unique: true },
  Project_Id: { type: Number, required: true },
  Name: { type: String, required: true },
  Type: { type: String, required: true },
  Latitude: { type: Number, required: true },
  Longitude: { type: Number, required: true },
  Survey_Id: { type: Number, required: true },
  Accuracy: { type: Number, required: true },
  Timestamp: { type: String, required: true }
});

module.exports = mongoose.model("Point", PointSchema);
