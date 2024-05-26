const express = require("express");
const router = express.Router();
const AuthService = require("../services/auth.js");
const mongoose = require("mongoose");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const ImageModel = require("../models/Image.js");

const dbPath = process.env.DB_PATH || "mongodb://127.0.0.1/pjs-db";

// For caching images
const imageCache = {};

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
  const parsedImage = JSON.parse(JSON.stringify(image));
  if (buffer) {
    const content = `data:image/png;base64, ${buffer.toString("base64")}`;
    parsedImage.content = content;
  }
  return parsedImage;
}

// function updateImageMeta(image, newData) {
//   image.title = newData.title;
//   image.descr = newData.descr;
//   image.isFeatured = newData.isFeatured;
//   image.category = newData.category;
//   return image;
// }

// Gets images from gridfs based on the given ImageModel objects provided
async function getImages(imageInfos) {
  const images = await Promise.all(
    imageInfos.map(async (info) => {
      // Use cache if available
      if (imageCache[info.fileId]) {
        const parsed = parseImageBeforeSend(info);
        parsed.content = imageCache[info.fileId];
        return parsed;
      } else {
        // Clear cache if too large
        if (Object.keys(imageCache).length > 50) imageCache = {};

        const chunks = [];
        const stream = bucket.openDownloadStream(info.fileId);
        const buffer = await new Promise((resolve, reject) => {
          stream.on("data", (chunk) => chunks.push(chunk));
          stream.on("end", () => resolve(Buffer.concat(chunks)));
          stream.on("error", reject);
        });

        const parsed = parseImageBeforeSend(info, buffer);

        // Cache image
        imageCache[info.fileId] = parsed.content;
        return parsed;
      }
    })
  );

  return images;
}

// Get multiple images
router.get("/images", async function (req, res) {
  try {
    const limit = req.query.limit || 10;
    const { category, keyword, startDate, endDate } = req.query;
    const parsedQuery = { $and: [] };
    if (Object.hasOwn(req.query, "isFeatured"))
      parsedQuery.$and.push({ isFeatured: req.query.isFeatured });
    if (category) parsedQuery.$and.push({ category });

    if (startDate) parsedQuery.$and.push({ createdAt: { $gte: startDate } });
    if (endDate) parsedQuery.$and.push({ createdAt: { $lte: endDate } });

    // Search for keyword in title and description
    if (keyword) {
      const regex = new RegExp(keyword, "i");
      parsedQuery.$and.push({ $or: [{ title: regex }, { descr: regex }] });
    }

    let finalQuery = {};
    if (parsedQuery.$and.length) finalQuery = parsedQuery;
    const imageInfos = await ImageModel.find(finalQuery).limit(limit);

    if (imageInfos.length === 0) {
      return res.status(404).send("No image found");
    }

    const images = await getImages(imageInfos);
    // res.set("Cache-Control", "public, max-age=3600");

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
    console.log("image info is", imageInfo);
    const images = await getImages([imageInfo]);

    console.log("about to return", images[0]?.descr);

    return res.status(200).send(images?.at(0));
  } catch (err) {
    console.error("Error getting image", err);
    return res.status(500).send("Error getting image.");
  }
});

router.put("/images", async function (req, res) {
  console.log("here", req.body);
  const { fileId, title, descr, category, isFeatured } = req.body;
  if (!fileId)
    return res.status(400).send({ message: "fileId field is required." });
  console.log("body is", req.body);
  try {
    await ImageModel.updateOne(
      { fileId },
      {
        $set: {
          title,
          descr,
          category,
          isFeatured,
        },
      }
    );
    console.log("updated image");

    return res.status(200).send({ message: "Image updated!" });
  } catch (err) {
    console.error("Error updating image.", err);
    return res.status(500).send({ message: "Error updating image." });
  }
});

router.delete("/images", async function (req, res) {
  const fileId = req.query.fileId;
  if (!fileId)
    return res
      .status(400)
      .send({ message: "Please provide the id of the image to remove." });

  try {
    await bucket.delete(new mongoose.Types.ObjectId(fileId));
    await ImageModel.deleteOne({ fileId });
    if (imageCache[fileId]) delete imageCache[fileId];
    return res.status(200).send({ message: "Successfully deleted file." });
  } catch (err) {
    console.error("Error deleting image.", err);
    return res.status(500).send({ message: "Error deleting image." });
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

      res.status(200).send({ imageFileId: imageObjData.fileId });
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
