const express = require("express");
const router = express.Router();
const passport = require("passport");
const Bcrypt = require("bcrypt");
const AuthService = require("../services/auth.js");

const UserModel = require("../models/User.js");

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
  })
);

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) return next(err);
    res.status(200).send("Logged out.");
  });
});

router.post(
  "/register",
  AuthService.ensureAuthenticated,
  async function (req, res) {
    const { username, password } = req.body;
    console.log("in post register", username, password);
    if (!username || !password)
      return res.status(400).send("Username or password not provided.");

    const saltRounds = 10;
    try {
      const hash = await Bcrypt.hash(password, saltRounds);
      const user = await UserModel.create({ username, password: hash });
      console.log("Success creating user", user?.username);
      res.status(200).send("Created user!");
    } catch (err) {
      console.error("Error creating user", err);
      res.status(500).send("Error registering.");
    }
  }
);

// For frontend to check if the user is authenticated
router.get("/auth", AuthService.ensureAuthenticated, async function (req, res) {
  res.status(200).send({ username: req.user.username });
});

module.exports = router;
