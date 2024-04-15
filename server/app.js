const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
// const routes = null;
const router = express.Router();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const app = express();
const PORT = 3000;

const dbPath = "mongodb://127.0.0.1/my_database";
mongoose
  .connect(dbPath)
  .then(() => {
    console.log("connection successful");
    const UserSchema = new Schema({
      name: String,
      password: String
    });
    const UserModel = mongoose.model("User", UserSchema);
    const user1 = new UserModel({ name: "John", password: "Doe" });
    user1.save();
  })
  .catch((err) => console.log(err));

// app.use(express.static("../client/index.html"));
// app.use('/static', express.static('public'))
app.use(express.static(path.join(__dirname, "../client")));
console.log("dir name is", __dirname);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use("/api", routes);

router.get("/api/hello", (req, res) => {
  console.log("yes");
  res.send("Hello World!");
});

router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "index.html"));
});

app.use(router);

app.listen(PORT, (error) => {
  if (!error) console.log("Success");
  else console.log("Error, error");
});
