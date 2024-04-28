const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
// const routes = null;
const router = express.Router();
const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

const passport = require("passport");
const LocalStrategy = require("passport-local");
const crypto = require("crypto");
const session = require("express-session");

const UserModel = require("./models/User.js");

const app = express();

const PORT = 3000;
const dbPath = "mongodb://127.0.0.1/paintings-angularjs-db";
mongoose
  .connect(dbPath)
  .then(() => {
    console.log("connection to database successful");
  })
  .catch((err) => console.log(err));

passport.use(
  new LocalStrategy(function verify(username, password, callback) {
    UserModel.findOne({ username: username })
      .then(function (user) {
        if (!user) {
          console.log("User not found.");
          return callback(null, false, { message: "User not found." });
        }
        if (user.password !== password) {
          console.log("Incorrect password.");
          return callback(null, false, { message: "Incorrect password." });
        }
        // Success
        return callback(null, user);
      })
      .catch(function (err) {
        console.error("Error getting the user");
        return callback(err);
      });
  })
);

app.use(express.static(path.join(__dirname, "../client")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use("/api", routes);

app.use(
  session({
    secret: "fadsfsfs",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.authenticate("session"));

passport.serializeUser(function (user, callback) {
  process.nextTick(function () {
    callback(null, { id: user._id, username: user.username });
  });
});

passport.deserializeUser(function (user, callback) {
  process.nextTick(function () {
    return callback(null, user);
  });
});

router.post(
  "/api/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);

app.post("/api/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.status(200).send("Logged out.");
  });
});

app.get("/api/paintings", EnsureAuthenticated, (req, res, next) => {
  res.status(200).send({ message: "Here are the paintings" });
});

function EnsureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  else res.status(401).send();
}

router.post("/api/register", (req, res) => {
  const { username, password } = req.body;
  console.log("in post register", username, password);
  if (!username || !password)
    return res.status(400).send("Username or password not provided.");

  UserModel.create({ username, password })
    .then(function (user) {
      console.log("Success registering ", user?.username);
      res.status(200).send("Created user!");
    })
    .catch(function (err) {
      console.error("Error creating user", err);
      res.status(500).send("Error registering.");
    });
});

router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "index.html"));
});

app.use(router);

app.listen(PORT, (error) => {
  if (!error) console.log("Success");
  else console.log("Error, error");
});
