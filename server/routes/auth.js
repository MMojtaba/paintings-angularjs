const express = require("express");
const router = express.Router();
const passport = require("passport");
const Bcrypt = require("bcrypt");

const UserModel = require("../models/User.js");

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/"
  })
);

router.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.status(200).send("Logged out.");
  });
});

router.post("/register", (req, res) => {
  const { username, password } = req.body;
  console.log("in post register", username, password);
  if (!username || !password)
    return res.status(400).send("Username or password not provided.");

  const saltRounds = 10;
  Bcrypt.hash(password, saltRounds, function (err, hash) {
    UserModel.create({ username, password: hash })
      .then(function (user) {
        console.log("Success registering ", user?.username);
        res.status(200).send("Created user!");
      })
      .catch(function (err) {
        console.error("Error creating user", err);
        res.status(500).send("Error registering.");
      });
  });
});

module.exports = router;
