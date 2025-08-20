const express = require("express");
const app = express();
const path = require("path");
const connectToMongoDB = require("./MongoDBConnection.js");

connectToMongoDB();

app.set("view engine", "ejs");
app.set("views", "views");

app.get("/", (req, res) => {
  return res.render("home");
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
