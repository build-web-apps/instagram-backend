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
    findUser.length ? res.json(findUser) : res.status(404).send('User not found');
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
      res.json({ message: err.message });
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
              res.status(200).send(profile);
            } else {
              res.send("User Unauthorized Access");
            }
          }
        );
      }
    })
    .catch((err) => {
      console.log("Error is ", err.message);
      res.json({ message: err.message });
    });
});

//Update follower. following data
router.patch("/follow/:userName", async (req, res) => {
  if (!(req.body.loggedIn && req.params.userName)) {
    res.status(400).send("Bad Request");
    return;
  }

  await User.find({
    userName: { $in: [req.body.loggedIn, req.params.userName] },
  })
    .then(async (profile) => {
      if (profile.length !== 2) {
        res.send("User not exist");
      } else {
        const followingUserindex = profile
          .find((p) => p.userName === req.body.loggedIn)
          .following.indexOf(req.params.userName);
        const followerUserindex = profile
          .find((p) => p.userName === req.params.userName)
          .followers.indexOf(req.body.loggedIn);

        try {
          if (followingUserindex === -1 && followerUserindex === -1) {
            const followingUserData = profile.find(
              (p) => p.userName === req.body.loggedIn
            );
            await User.update(
              { userName: req.body.loggedIn },
              {
                $set: {
                  following: [
                    ...followingUserData.following,
                    req.params.userName,
                  ],
                },
              }
            );

            const followerUserData = profile.find(
              (p) => p.userName === req.params.userName
            );
            await User.update(
              { userName: req.params.userName },
              {
                $set: {
                  followers: [...followerUserData.followers, req.body.loggedIn],
                },
              }
            );
            res.status(200).send("updated user data");
          } else {
            res.status(400).send("Unable to update");
          }
        } catch (err) {
          res.json({ message: err });
        }
      }
    })
    .catch((err) => {
      console.log("Error is ", err.message);
      res.json({ message: err.message });
    });
});

//Update follower, following data
router.patch("/unfollow/:userName", async (req, res) => {
  if (!(req.body.loggedIn && req.params.userName)) {
    res.status(400).send("Bad Request");
    return;
  }

  await User.find({
    userName: { $in: [req.body.loggedIn, req.params.userName] },
  })
    .then(async (profile) => {
      if (profile.length !== 2) {
        res.send("User not exist");
      } else {
        const followingUserindex = profile
          .find((p) => p.userName === req.body.loggedIn)
          .following.indexOf(req.params.userName);
        const followerUserindex = profile
          .find((p) => p.userName === req.params.userName)
          .followers.indexOf(req.body.loggedIn);
        try {
          if (followingUserindex !== -1 && followerUserindex !== -1) {
            const followingUserData = profile.find(
              (p) => p.userName === req.body.loggedIn
            );
            followingUserData.following.splice(followingUserindex, 1);
            await User.update(
              { userName: req.body.loggedIn },
              {
                $set: {
                  following: followingUserData.following,
                },
              }
            );

            const followerUserData = profile.find(
              (p) => p.userName === req.params.userName
            );
            followerUserData.followers.splice(followerUserindex, 1);
            await User.update(
              { userName: req.params.userName },
              {
                $set: {
                  followers: followerUserData.followers,
                },
              }
            );
            res.status(200).send("updated user data");
          } else {
            res.status(400).send("Unable to update");
          }
        } catch (err) {
          res.json({ message: err });
        }
      }
    })
    .catch((err) => {
      console.log("Error is ", err.message);
      res.json({ message: err.message });
    });
});

module.exports = router;
