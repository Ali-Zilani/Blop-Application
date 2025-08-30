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

app.use("/user", UserRoute);
app.use("/blog", BlogRoute);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
