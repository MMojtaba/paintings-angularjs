// Libraries
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
require("dotenv").config();

// Routes
const authRoutes = require("./routes/auth.js");
const imageRoutes = require("./routes/image.js");

// Services
const AuthService = require("./services/auth.js");

const app = express();

// Set constants
const PORT = process.env.APP_PORT || 3000;
const dbPath = process.env.DB_PATH || "mongodb://127.0.0.1/pjs-db";

// Init database
mongoose
  .connect(dbPath)
  .then(function () {
    console.log("Connection to database successful");
  })
  .catch(function (err) {
    console.log("Error connecting to the database", err);
  });

// Host client
app.use(express.static(path.join(__dirname, "../client")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Authentication
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
AuthService.initPassport(passport);
app.use(passport.session());

// Add routes
app.use("/api", authRoutes);
app.use("/api", imageRoutes);

// Client route
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client", "index.html"));
});

// Start server
app.listen(PORT, function (err) {
  if (err) console.log("Error starting Server", err);
  else console.log("Started server at http://localhost:" + PORT);
});
