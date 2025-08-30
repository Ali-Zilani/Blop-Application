const JWT = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config({ quiet: true });
const seckretKey = process.env.JWT_SECKRET_KEY;

const createTokenForUser = (user) => {
  const payload = {
    _id: user._id,
    email: user.email,
    profileImageURL: user.profileImageURL,
    role: user.role,
  };
  const token = JWT.sign(payload, seckretKey, { expiresIn: "1d" });
  return token;
};

const validateToken = (token) => {
  const payload = JWT.verify(token, seckretKey);
  return payload;
};

module.exports = {
  createTokenForUser,
  validateToken,
};
