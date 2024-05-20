const express = require("express");
const router = express.Router();
const AuthService = require("../services/auth.js");
const mongoose = require("mongoose");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const dbPath = process.env.DB_PATH || "mongodb://127.0.0.1/pjs-db";

const dbConnection = mongoose.createConnection(dbPath);

// Initialize GridFSBucket
let bucket;
dbConnection.once("open", () => {
  console.log("Connected to database for GridFS");
  bucket = new mongoose.mongo.GridFSBucket(dbConnection.db, {
    bucketName: "images"
  });
});

router.get("/images", async function (req, res) {
  try {
    const limit = req.query.limit || 10;
    const files = await bucket.find({}).limit(limit).toArray();

    if (files.length === 0) {
      res.status(404).send("No image found");
      return;
    }

    const images = await Promise.all(
      files.map(async (file) => {
        const chunks = [];
        const stream = bucket.openDownloadStreamByName(file.filename);
        const buffer = await new Promise((resolve, reject) => {
          stream.on("data", (chunk) => chunks.push(chunk));
          stream.on("end", () => resolve(Buffer.concat(chunks)));
          stream.on("error", reject);
        });

        return {
          filename: file.filename,
          data: buffer.toString("base64")
        };
      })
    );

    return res.status(200).send(images);
  } catch (err) {
    console.error("Error getting images", err);
    return res.status(500).send();
  }
});

router.get("/featured", async function (req, res) {
  try {
    const images = await bucket.find().limit(1).toArray();
    if (!images?.length) {
      console.log("Featured image not found.");
      return res.status(404).send();
    }
    const featuredImage = images[0];
    const chunks = [];
    const stream = bucket.openDownloadStreamByName(featuredImage.filename);
    const buffer = await new Promise((resolve, reject) => {
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(chunks)));
      stream.on("error", reject);
    });

    return res.status(200).send({
      filename: featuredImage.filename,
      data: buffer.toString("base64")
    });
  } catch (err) {
    console.error("Error getting featured images.", err);
    return res.status(500).send();
  }
});

// Upload the image
router.post("/images", upload.single("file"), function (req, res) {
  if (!req.file) {
    console.error("No file provided for saving.");
    return res.status(400).send("No file provided.");
  }

  const { title, description, category, isFeatured } = req.body;

  const uploadStream = bucket.openUploadStream(req.file.originalname);
  uploadStream.write(req.file.buffer);
  uploadStream.end();

  uploadStream.on("finish", () => {
    res.send("File uploaded successfully.");
  });

  uploadStream.on("error", (err) => {
    console.error("Error uploading file:", err);
    res.status(500).send("Error uploading file.");
  });
});

module.exports = router;
