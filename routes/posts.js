const express = require("express");
const Post = require("../models/Post");
const User = require("../models/User");
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

//Get Posts id
router.get("/:postId", async (req, res) => {
  try {
    const findPosts = await Post.find({ _id: req.params.postId });
    res.json(findPosts);
  } catch (err) {
    res.json({ message: err });
  }
});

//Submit Post data
router.post("/", async (req, res) => {
  if (!(req.body.userName && req.body.content && req.body.media)) {
    res.status(400).send("Bad Request");
    return;
  }

  const post = new Post({
    userName: req.body.userName,
    content: req.body.content,
    media: req.body.media,
    likes:0
  });

  await User.findOne({ userName: post.userName })
    .then(async (profile) => {
      if (!profile) {
        res.status(400).send("User doesn't exist");
      } else {
        try {
          const addedPost = await post.save();
          res.json(addedPost);
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

//Find Post by userName
router.get("/user/:userName", async (req, res) => {
  try {
    const findPosts = await Post.find({ userName: req.params.userName });
    res.json(findPosts);
  } catch (err) {
    res.json({ message: err });
  }
});

//Update Post data
router.patch("/:postId", async (req, res) => {
  if (!req.body.content) {
    res.status(400).send("Bad Request");
    return;
  }
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

//Update Post comment data
router.patch("/comment/:postId", async (req, res) => {
  if (!(req.body.comment && req.body.comment.length)) {
    res.status(400).send("Bad Request");
    return;
  }
  await Post.findOne({ _id: req.params.postId })
    .then(async (post) => {
      if (!post) {
        res.status(400).send("Post doesn't exist");
      } else {
        try {
          const commentData = [...post.comment, ...req.body.comment];
          const updatedPost = await Post.update(
            { _id: req.params.postId },
            { $set: { comment: commentData } }
          );
          res.json(updatedPost);
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

//Update Post likes data
router.patch("/likes/:postId", async (req, res) => {
  await Post.findOne({ _id: req.params.postId })
  .then(async (post) => {
    if (!post) {
      res.status(400).send("Post doesn't exist");
    } else {
      try {
        const updatedPost = await Post.update(
          { _id: req.params.postId },
          { $set: { likes: post.likes + 1 } }
        );
        res.json(updatedPost);
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
