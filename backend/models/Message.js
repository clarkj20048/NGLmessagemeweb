const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 1,
      max: 120,
    },
    profileImage: {
      type: String,
      required: true,
      trim: true,
    },
    anonymousName: {
      type: String,
      trim: true,
      maxlength: 80,
      default: "",
    },
    message: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
