const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createTokenForUser } = require("../services/authentication");

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

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  // Hash the password and set the salt here
  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
  this.salt = salt;
  this.password = hashedPassword;
  next();
});
//mongoose virtual function
userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not found");

    const salt = user.salt;
    const hashedPassword = user.password;
    const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    if (hashedPassword !== userProvidedHash)
      throw new Error("Incorrect Password");
    const token = createTokenForUser(user);
    user.token = token; // added token to user Object
    return user;
  }
);

const User = model("user", userSchema);
module.exports = User;
