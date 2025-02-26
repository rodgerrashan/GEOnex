const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  User_Id: { type: Number, unique: true, required: true },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Role: { type: String, enum: ["admin", "user"], required: true },
  Created_At: { type: Date, default: Date.now },
  Last_Login: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);