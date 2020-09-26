const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
require("dotenv/config");

//Import Routes
const usersRoute = require("./routes/users");
const postsRoute = require("./routes/posts");

const app = express();

//Middleware redirect /posts to postsRoute, likewise can have multiple middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/users", usersRoute);
app.use("/posts", postsRoute);

//Routes
app.get("/", (req, res) => {
  res.send("We are ready");
});

//Upload img snippet
const upload = multer({ dest: __dirname + "/uploads/images" });
var ImgSchema = mongoose.Schema({
  name: {
    type: String,
  },
  imageURL: { type: Buffer },
});
var Img = mongoose.model("PostImg", ImgSchema);

app.post("/add", upload.single("imageURL"), (req, res, next) => {
  const img = new Img({
    name: req.body.name,
    imageURL: req.file.path,
  });
  img
    .save()
    .then((result) => {
      res.status(201).json({
        message: "User registered successfully!",
      });
    })
    .catch((err) => console.log(err));
});

//Mongo connect
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection to the Atlas Cluster is successful!");
  })
  .catch((err) => console.error(err));

//Listen to server
app.listen(3000);
