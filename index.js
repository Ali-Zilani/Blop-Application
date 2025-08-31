const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const connectToMongoDB = require("./MongoDBConnection.js");
const UserRoute = require("./routes/user.js");
const BlogRoute = require("./routes/blog.js");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication.js");
const Blog = require("./models/blog.js");

connectToMongoDB();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  //console.log(req.user);
  const allBlogs = await Blog.find({}).sort({
    createdAt: -1,
  });
  return res.render("home", { user: req.user, blogs: allBlogs });
});

app.get("/profile", async (req, res) => {
  const userId = req.user?._id || null;
  // Fetch user details from database using userId if needed
  const allblogs = await Blog.find({ createdBy: userId }).sort({
    createdAt: -1,
  });
  res.render("profile", { user: req.user, blogs: allblogs });
});

app.get("/my-blogs", async (req, res) => {
  const userId = req.user?._id || null;
  const allblogs = await Blog.find({ createdBy: userId }).sort({
    createdAt: -1,
  });
  res.render("my-blogs", { user: req.user, blogs: allblogs });
});
app.use("/user", UserRoute);
app.use("/blog", BlogRoute);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
