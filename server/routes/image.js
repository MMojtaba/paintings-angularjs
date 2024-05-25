const express = require("express");
const router = express.Router();
const AuthService = require("../services/auth.js");
const mongoose = require("mongoose");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const ImageModel = require("../models/Image.js");

const dbPath = process.env.DB_PATH || "mongodb://127.0.0.1/pjs-db";

const dbConnection = mongoose.createConnection(dbPath);

// Initialize GridFSBucket
let bucket;
dbConnection.once("open", () => {
  console.log("Connected to database for GridFS");
  bucket = new mongoose.mongo.GridFSBucket(dbConnection.db, {
    bucketName: "images",
  });
});

// Puts image in a format that can be used by the frontend
function parseImageBeforeSend(image, buffer) {
  // TODO: use actual file type instead of png
  const content = `data:image/png;base64, ${buffer.toString("base64")}`;
  const parsedImage = JSON.parse(JSON.stringify(image));
  parsedImage.content = content;
  return parsedImage;
}

// Gets images from gridfs based on the given ImageModel objects provided
async function getImages(imageInfos) {
  // TODO: add caching
  const images = await Promise.all(
    imageInfos.map(async (info) => {
      const chunks = [];
      const stream = bucket.openDownloadStream(info.fileId);
      const buffer = await new Promise((resolve, reject) => {
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", reject);
      });

      return parseImageBeforeSend(info, buffer);
    })
  );

  return images;
}

// Get multiple images
router.get("/images", async function (req, res) {
  try {
    const limit = req.query.limit || 10;
    const parsedQuery = {};
    if (Object.hasOwn(req.query, "isFeatured"))
      parsedQuery.isFeatured = req.query.isFeatured;

    // console.log("query is", parsedQuery);

    const imageInfos = await ImageModel.find(parsedQuery).limit(limit);

    if (imageInfos.length === 0) {
      return res.status(404).send("No image found");
    }

    const images = await getImages(imageInfos);

    return res.status(200).send(images);
  } catch (err) {
    console.error("Error getting images", err);
    return res.status(500).send();
  }
});

// Get specified image with the given id
router.get("/images/:id", async function (req, res) {
  const fileId = req.params.id;
  try {
    const imageInfo = await ImageModel.findOne({ fileId: fileId });

    if (!imageInfo) return res.status(404).send("Image not found.");

    const images = await getImages([imageInfo]);

    return res.status(200).send(images?.at(0));
  } catch (err) {
    console.error("Error getting image", err);
    return res.status(500).send("Error getting image.");
  }
});

// Upload the image
router.post("/images", upload.single("file"), function (req, res) {
  if (!req.file) {
    console.error("No file provided for saving.");
    return res.status(400).send("No file provided.");
  }

  const { title, descr, category, isFeatured } = req.body;

  const uploadStream = bucket.openUploadStream(req.file.originalname);
  uploadStream.write(req.file.buffer);
  uploadStream.end();

  uploadStream.on("finish", async () => {
    try {
      const imageObjData = {
        fileId: uploadStream.id,
        fileName: uploadStream.filename,
        title,
        descr,
        category,
        isFeatured,
      };

      const newImage = new ImageModel(imageObjData);

      await newImage.save();
      console.log("Saved image.");

      res.status(200).send("File uploaded successfully.");
    } catch (err) {
      console.error("Error saving file.", err);
      return res.status(500).send("Error saving file.");
    }
  });

  uploadStream.on("error", (err) => {
    console.error("Error uploading file:", err);
    res.status(500).send("Error uploading file.");
  });
});

module.exports = router;
