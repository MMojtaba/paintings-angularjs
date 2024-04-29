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
const paintingsRoutes = require("./routes/paintings.js");

// Services
const AuthService = require("./services/auth.js");

const app = express();

// Set constants
const PORT = process.env.APP_PORT || 3000;
const dbPath = process.env.DB_PATH || "mongodb://127.0.0.1/db";

// Init database
mongoose
  .connect(dbPath)
  .then(() => {
    console.log("connection to database successful");
  })
  .catch((err) => console.log(err));

// Host client
app.use(express.static(path.join(__dirname, "../client")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Authentication
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
AuthService.initPassport(passport);
// app.use(passport.initialize());
app.use(passport.session());
// app.use(passport.authenticate("session"));

// Add routes
app.use("/api", authRoutes);
app.use("/api", paintingsRoutes);

// Client route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "index.html"));
});

// Start server
app.listen(PORT, (error) => {
  if (!error) console.log("Success");
  else console.log("Error, error");
});
