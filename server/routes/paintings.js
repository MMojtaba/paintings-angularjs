const express = require("express");
const router = express.Router();
const AuthService = require("../services/auth.js");

router.get("/paintings", AuthService.ensureAuthenticated, function (req, res) {
  res.status(200).send({ message: "Here are the paintingsxx" });
});

router.post("/paintings", function (req, res) {
  //AUTH: AuthService.ensureAuthenticated
  const { title, description, category, image } = req.body;
  console.log("got painting", title, image);
  res.status(200).send();
});

module.exports = router;
