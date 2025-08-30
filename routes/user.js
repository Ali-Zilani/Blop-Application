const { Router } = require("express");
const User = require("../models/user.js");
const router = Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  await User.create({
    fullName,
    email,
    password,
  });
  return res.redirect("/");
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.matchPasswordAndGenerateToken(email, password);
    const token = user.token;
    //console.log(token);
    return res.cookie("token", token).redirect("/");
  } catch (err) {
    //console.log(err.message);
    return res.render("signin", { error: err.message });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

module.exports = router;
