const express = require("express");
const Post = require("../models/Post");
const User = require("../models/User");
const router = express.Router();

//Find posts for userName based on his following
router.get("/:userName", async (req, res) => {
  if (!req.params.userName) {
    res.status(400).send("Bad Request");
    return;
  }
  await User.findOne({ userName: req.params.userName })
    .then(async (user) => {
      if (!user) {
        res.status(400).send("User doesn't exist");
      } else {
        try {
          const postData = await Post.find({
            userName: { $in: user.following },
          });
          res.json(postData);
        } catch (err) {
          res.json({ message: err });
        }
      }
    })
    .catch((err) => {
      console.log("Error is", err.message);
      res.json({ message: err.message });
    });
});

module.exports = router;
