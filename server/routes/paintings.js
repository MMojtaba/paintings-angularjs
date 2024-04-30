const express = require("express");
const router = express.Router();
const AuthService = require("../services/auth.js");

router.get("/paintings", AuthService.ensureAuthenticated, function (req, res) {
  res.status(200).send({ message: "Here are the paintingsxx" });
});

module.exports = router;
