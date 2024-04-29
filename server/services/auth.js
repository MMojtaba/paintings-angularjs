const LocalStrategy = require("passport-local");
const UserModel = require("../models/User.js");
const bcrypt = require("bcrypt");

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
            console.log("user not found");
            return callback(null, false, { message: "User not found" });
          }

          bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
              console.error("errr");
              return callback(err);
            } else if (result) {
              //success
              return callback(null, user);
            } else {
              console.log("Incorrect password");
              return callback(null, false, { message: "Incorrect password" });
            }
          });
        })
        .catch(function (err) {
          console.error("Error getting the user.");
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
