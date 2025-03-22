const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  mobile: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/, // Ensures a 10-digit number
  },
  dob: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
