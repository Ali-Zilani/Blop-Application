const { Router } = require("express");
const router = Router();
const path = require("path");
const fs = require("fs");

const Blog = require("../models/blog.js");
const Comment = require("../models/comment.js");
//uploading file using multer
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../public/uploads", req.user._id);

    // ensure folder exists
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + file.originalname;
    cb(null, filename);
  },
});
const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  res.render("addBlog", { user: req.user });
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  // console.log("File:", req.file);
  // console.log("Body:", req.body);
  const { title, content } = req.body;
  const blog = await Blog.create({
    title,
    content,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.user._id}/${req.file.filename}`,
  });
  res.redirect(`/blog/${blog._id}`);
});

router.get("/:id", async (req, res) => {
  const blogId = req.params.id;
  const blog = await Blog.findById(blogId).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "commentedBy"
  );
  //console.log(blog.createdBy);
  res.render("blog", { user: req.user, blog, comments });
});

//Handling comment routes
router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    commentedBy: req.user._id,
  });
  res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router;
