const express = require("express");
const router = express.Router();
const AuthService = require("../services/auth.js");

router.get("/paintings", AuthService.ensureAuthenticated, (req, res, next) => {
  res.status(200).send({ message: "Here are the paintingsxx" });
});

module.exports = router;
