const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const connectToMongoDB = require("./MongoDBConnection.js");
const UserRoute = require("./routes/user.js");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication.js");

connectToMongoDB();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.get("/", (req, res) => {
  return res.render("home", { user: req.user });
});

app.use("/user", UserRoute);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
