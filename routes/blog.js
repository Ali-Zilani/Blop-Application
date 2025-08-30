const { Router } = require("express");
const router = Router();
const path = require("path");
const fs = require("fs");

//uploading file using multer
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../public/uploads", req.user.name);

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

router.post("/", upload.single("coverImage"), (req, res) => {
  console.log("File:", req.file);
  console.log("Body:", req.body);
  res.redirect("/");
});

module.exports = router;
