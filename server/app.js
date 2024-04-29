const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
// const routes = null;
const router = express.Router();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserModel = require("./models/User.js");

const passport = require("passport");
const session = require("express-session");

const AuthService = require("./services/auth.js");

const app = express();
const PORT = 3000;

const dbPath = "mongodb://127.0.0.1/my_database";
mongoose
  .connect(dbPath)
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => console.log(err));

app.use(express.static(path.join(__dirname, "../client")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use("/api", routes);

app.use(
  session({
    secret: "salfhdslfhsdfio",
    resave: false,
    saveUninitialized: false
  })
);

AuthService.initPassport(passport);
app.use(passport.session());

router.get("/api/hello", (req, res) => {
  console.log("yes");
  res.send("Hello World!");
});

app.post("/api/register", (req, res) => {
  const { username, password } = req.body;
  console.log("in register", username, password);

  if (!username || !password)
    return res.status(400).send("Username or passsword not provided.");

  UserModel.create({ username, password })
    .then(function (user) {
      console.log("Successfully created user", user.username);
      res.status(200).send("created user");
    })
    .catch(function (err) {
      console.error("Error creating user", err);
      res.status(500).send("error registering");
    });
});

app.post(
  "/api/login",
  passport.authenticate("local", { successRedirect: "/" })
);

app.post("/api/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.status(200).send("Logged out");
  });
});

app.get("/api/paintings", AuthService.ensureAuthenticated, (req, res) => {
  return res.status(200).send({ message: "here are the paintings" });
});

router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "index.html"));
});

app.use(router);

app.listen(PORT, (error) => {
  if (!error) console.log("Success");
  else console.log("Error, error");
});
