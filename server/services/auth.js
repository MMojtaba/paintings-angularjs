const LocalStrategy = require("passport-local");
const UserModel = require("../models/User.js");
const crypto = require("crypto");

function initPassport(passport) {
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
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  else res.status(401).send();
}

module.exports = { initPassport, ensureAuthenticated };
