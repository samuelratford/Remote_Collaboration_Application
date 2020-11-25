// This code is written by Samuel Ratford in its entirety

const router = require("express").Router();
let User = require("../models/userModel");
const mongoose = require("mongoose");

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

router.route("/getData").post((req, res) => {
  if (req.body.username === "") {
    res.send(false);
  } else {
    User.find(
      { username: req.body.username, password: req.body.password },
      (err, docs) => {
        let toSend = {
          username: docs[0].username,
          name: docs[0].name,
          allowedExtensions: docs[0].allowedExtensions,
        };
        if (err) {
          res.send(err);
        } else {
          res.send(toSend);
        }
      }
    );
  }
});

router.route("/register").post((req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.username;
  const allowedExtensions = [];

  const newUser = new User({ username, password, name, allowedExtensions });

  newUser.save((err, user) => {
    if (err) return console.error(err);
    console.log(user.username + " saved to users collection.");
  });
});

router.route("/login").post((req, res) => {
  User.exists(
    { username: req.body.username, password: req.body.password },
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    }
  );
  // console.log("test");
});

module.exports = router;
