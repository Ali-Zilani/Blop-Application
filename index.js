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

app.get("/", async (req, res) => {
  //console.log(req.user);
  let allBlogs = { message: "No Blogs bcz user didn't singin" };
  const userId = req.user?._id || null;
  if (userId)
    allBlogs = await Blog.find({ createdBy: userId }).sort({
      createdAt: -1,
    });
  return res.render("home", { user: req.user, blogs: allBlogs });
});

app.use("/user", UserRoute);
app.use("/blog", BlogRoute);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
