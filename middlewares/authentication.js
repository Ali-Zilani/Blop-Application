//creating a middleware which will check whether req.user exists or not ie signed in..
//this will check token at each req/res

const { validateToken } = require("../services/authentication.js");

const checkForAuthenticationCookie = (cookieName) => {
  return (req, res, next) => {
    try {
      const token = req.cookies[cookieName];
      if (token) {
        const userPayload = validateToken(token);
        req.user = userPayload;
      }
    } catch (err) {
      console.error("Authentication error:", err.message);
    }
    next();
  };
};

module.exports = {
  checkForAuthenticationCookie,
};
