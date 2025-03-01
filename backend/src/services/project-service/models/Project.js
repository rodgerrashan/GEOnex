const mongoose = require("mongoose");
const deviceSchema = require("../../device-service/models/Device");


const projectSchema = new mongoose.Schema({
    Project_Id: { type: Number, unique: true,required: false },
    User_Id: { type: Number, ref: "User",required: false },
    Name: { type: String, required: true },
    Created_On: { type: Date, required: true },
    Last_Modified: { type: Date, required: true },
    Status: { type: String, default: "Active" },
    Survey_Time: { type: String,required: false  },
    Description: { type: String },
    Total_Points: { type: Number },
    Devices: [deviceSchema.schema] 
  });


  const Project = mongoose.model("Project", projectSchema);
  module.exports = Project;