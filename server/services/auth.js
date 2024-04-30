const LocalStrategy = require("passport-local");
const UserModel = require("../models/User.js");
const Bcrypt = require("bcrypt");

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
    new LocalStrategy(async function verify(username, password, callback) {
      try {
        const user = await UserModel.findOne({ username: username });
        if (!user) {
          console.log("User not found.");
          return callback(null, false, { message: "User not found." });
        }

        Bcrypt.compare(password, user.password, function (err, result) {
          if (err) {
            console.error("Error hashing password.");
            return callback(err);
          } else if (result) {
            //passwords match
            console.log("successfully logged in", user.username);
            return callback(null, user);
          } else {
            console.log("Incorrect password.");
            return callback(null, false, { message: "Incorrect password." });
          }
        });
      } catch (err) {
        console.error("Error getting the user");
        return callback(err);
      }
    })
  );
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  else res.status(401).send();
}

module.exports = { initPassport, ensureAuthenticated };
