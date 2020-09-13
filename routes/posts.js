const express = require("express");
const Post = require("../models/Post");
const router = express.Router();

//Get Posts list
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.json({ message: err });
  }
});

//Submit Post data
router.post("/", async (req, res) => {
  const post = new Post({
    userName: req.body.userName,
    content: req.body.content,
  });
  try {
    const addedPost = await post.save();
    res.json(addedPost);
  } catch (err) {
    res.json({ message: err });
  }
});

//Find Post by userName
router.get("/:userName", async (req, res) => {
  try {
    const findPosts = await Post.find({ userName: req.params.userName });
    res.json(findPosts);
  } catch (err) {
    res.json({ message: err });
  }
});

//Update Post data
router.patch("/:postId", async (req, res) => {
  try {
    const updatedPost = await Post.update(
      { _id: req.params.postId },
      { $set: { content: req.body.content } }
    );
    res.json(updatedPost);
  } catch (err) {
    res.json({ message: err });
  }
});

//Delete the Post data
router.delete("/:postId", async (req, res) => {
  try {
    const deletedPost = await Post.remove({ _id: req.params.postId });
    res.json(deletedPost);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
