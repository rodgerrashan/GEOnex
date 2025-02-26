const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);
const deviceSchema = require("../../device-service/models/Device");


const projectSchema = new mongoose.Schema({
    Project_Id: { type: Number, unique: true, required: true },
    User_Id: { type: Number, ref: "User", required: true },
    Name: { type: String, required: true },
    Created_On: { type: Date, default: Date.now },
    Last_Modified: { type: Date, default: Date.now },
    Status: { type: String, required: true },
    Survey_Time: { type: String, required: true },
    Description: { type: String },
    Total_Points: { type: Number },
    Devices: [deviceSchema.schema] 
  });

  projectSchema.plugin(AutoIncrement, {inc_field: 'Project_Id'});
  const Project = mongoose.model("Project", projectSchema);
  module.exports = Project;