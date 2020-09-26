const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();

const saltRadius = 10;

//Get user list
router.get("/", async (req, res) => {
  try {
    const user = await User.find();
    res.json(user);
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

//Signup user
router.post("/signup", async (req, res) => {
  if (!(req.body.userName && req.body.password && req.body.name)) {
    res.status(400).send("Bad Request");
    return;
  }

  const newUser = new User({
    userName: req.body.userName,
    password: req.body.password,
    name: req.body.name,
  });

  await User.findOne({ userName: newUser.userName })
    .then(async (profile) => {
      if (!profile) {
        bcrypt.hash(newUser.password, saltRadius, async (err, hash) => {
          if (err) {
            console.log(err.message);
          } else {
            newUser.password = hash;
            await newUser
              .save()
              .then(() => {
                res.status(200).send(newUser);
              })
              .catch((err) => {
                console.log("Error is ", err.message);
              });
          }
        });
      } else {
        res.send("User already exists...");
      }
    })
    .catch((err) => {
      console.log("Error is", err.message);
    });
});

//Log In User
router.post("/login", async (req, res) => {
  const newUser = new User({
    userName: req.body.userName,
    password: req.body.password,
  });

  await User.findOne({ userName: newUser.userName })
    .then((profile) => {
      if (!profile) {
        res.send("User not exist");
      } else {
        bcrypt.compare(
          newUser.password,
          profile.password,
          async (err, result) => {
            if (err) {
              console.log("Error is", err.message);
            } else if (result == true) {
              res.send({ status: "success", profile });
            } else {
              res.send("User Unauthorized Access");
            }
          }
        );
      }
    })
    .catch((err) => {
      console.log("Error is ", err.message);
    });
});

module.exports = router;
