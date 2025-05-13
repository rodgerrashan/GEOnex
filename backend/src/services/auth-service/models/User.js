const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String,required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "surveyor", "projectManager"], required: true },
  verifyOtp:{type:String, default:''},
  verifyOtpExpireAt:{type:Number, default:0},
  isAccountVerified:{type:Boolean, default:false},
  resetOtp:{type:String, default:''},
  resetOtpExpiredAt:{type:Number, default:0},
  created_At: { type: Date, default: Date.now },
  connectedDevices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Device", default: [] }]
  //Last_Login: { type: Date, default: Date.now }
});

const User = mongoose.models.user || mongoose.model('user',userSchema);
module.exports = User;
