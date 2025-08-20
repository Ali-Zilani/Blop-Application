const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/defaultProfile.png",
    },
    role: {
      type: String,
      default: "USER",
      enum: ["USER", "ADMIN"],
    },
  },
  { timestamps: true }
);
const User = model("user", userSchema);
module.exports = User;
