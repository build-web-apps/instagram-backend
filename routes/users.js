const express = require("express");
const User = require("../models/User");
const router = express.Router();

//Get user list
router.get("/", async (req, res) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (err) {
    res.json({ message: err });
  }
});

//Submit user data
router.post("/", async (req, res) => {
  const user = new User({
    userName: req.body.userName,
    password: req.body.password,
  });
  try {
    const addedUser = await user.save();
    res.json(addedUser);
  } catch (err) {
    res.json({ message: err });
  }
});

//Find user by userName
router.get("/:userName", async (req, res) => {
  try {
    const findUser = await User.find({ userName: req.params.userName });
    res.json(findUser);
  } catch (err) {
    res.json({ message: err });
  }
});

//Update user data
router.patch("/:userName", async (req, res) => {
  try {
    const updatedUser = await User.update(
      { userName: req.params.userName },
      { $set: { password: req.body.password } }
    );
    res.json(updatedUser);
  } catch (err) {
    res.json({ message: err });
  }
});

//Delete the user data
router.delete("/:userName", async (req, res) => {
  try {
    const deletedUser = await User.remove({ userName: req.params.userName });
    res.json(deletedUser);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
