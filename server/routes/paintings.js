const express = require("express");
const router = express.Router();
const AuthService = require("../services/auth.js");
const { GridFSBucket } = require("mongoose");
const mongoose = require("mongoose");
const fs = require("fs");
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

function saveImage(fileName, imageData) {
  try {
    // Open a stream to store the image
    const uploadStream = bucket.openUploadStream(fileName);

    // Write the image data to the stream
    uploadStream.write(imageData);

    // Close the stream
    uploadStream.end();

    console.log("Image saved to MongoDB GridFS successfully");
  } catch (error) {
    console.error("Error saving image to MongoDB:", error);
  }
}

// function testSaveImage() {
//   const fileName = "./server/1logo.png";
//   const imageData = fs.readFileSync(fileName);
//   saveImage(fileName, imageData);
// }

async function getImage(fileName, res) {
  try {
    console.log("start of function");
    const downloadStream = bucket.openDownloadStreamByName(fileName);

    console.log("got download stream");

    // Create a write stream to write the downloaded file
    // const writeStream = fs.createWriteStream("wow.webp");
    res.set("Content-Type", "image/png");
    res.set("Content-Disposition", `attachment; filename="${fileName}"`);

    // Pipe the download stream to the write stream
    // downloadStream.pipe(writeStream);
    downloadStream.pipe(res);

    await new Promise((resolve, reject) => {
      downloadStream.on("finish", () => {
        console.log("download stream i sdone");
        resolve();
      });
      downloadStream.on("error", () => {
        console.log("error download stream");
        reject();
      });
    });

    // Wait for the write stream to finish writing the file

    console.log(`File ${fileName} retrieved from MongoDB and saved to ${res}`);
  } catch (error) {
    console.error("Error retrieving file from MongoDB:", error);
    res.status(500).send();
  }
}

async function getAllImages() {
  // testSaveImage();
  // return;
  // const imageFiles = dbConnection.db.collection("fs.files").find();
  const imageFiles = await bucket.find();
  const imageFilesArray = await imageFiles.toArray();
  const imageBuffers = [];
  const promises = [];

  console.log("found num images:", imageFilesArray.length);

  for (const image of imageFilesArray) {
    promises.push(
      new Promise(function (resolve, reject) {
        const downloadStream = bucket.openDownloadStream(image._id);
        let imageData = Buffer.from("");
        downloadStream.on("data", (chunk) => {
          imageData = Buffer.concat([imageData, chunk]);
        });

        // When the download stream ends, add the image buffer to the array
        downloadStream.on("end", () => {
          imageBuffers.push({
            filename: image.filename,
            contentType: image.contentType,
            data: imageData
          });
          resolve();
        });

        // Handle errors
        downloadStream.on("error", (err) => {
          console.error("Error downloading image:", err);
          res.status(500).send("Internal Server Error");
          reject();
        });
      })
    );
  }

  await Promise.all(promises);

  return imageBuffers;
}

async function getImageSaveLocal(fileName, res) {
  try {
    const downloadStream = bucket.openDownloadStreamByName(fileName);

    // Create a write stream to write the downloaded file
    const writeStream = fs.createWriteStream("wow.png");

    // Pipe the download stream to the write stream
    downloadStream.pipe(writeStream);

    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    // Wait for the write stream to finish writing the file

    console.log(`File ${fileName} retrieved from MongoDB and saved to ${res}`);
  } catch (error) {
    console.error("Error retrieving file from MongoDB:", error);
  }
}

router.get("/paintings", async function (req, res) {
  console.log("in get paintings");
  try {
    // const images = await getAllImages();
    // const files = await bucket.find({}).toArray();

    const files = await bucket.find({}).toArray();

    if (files.length === 0) {
      res.status(404).send("No images found");
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

    // res.json(images);

    console.log("about to send", images.length);
    res.status(200).send(images);
  } catch (err) {
    console.error("Error getting images", err);
    res.status(500).send();
  }
  // res.status(200).send({ message: "Here are the paintingsxx" });
});

router.get("/featured", async function (req, res) {
  console.log("getting featured");
  try {
    const images = await bucket.find().limit(1).toArray();
    if (!images?.length) {
      console.log("Featured image not found.");
      return res.status(404).send();
    }
    const featuredImage = images[0];
    console.log("got image", featuredImage);
    const chunks = [];
    const stream = bucket.openDownloadStreamByName(featuredImage.filename);
    const buffer = await new Promise((resolve, reject) => {
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(chunks)));
      stream.on("error", reject);
    });

    res.status(200).send({
      filename: featuredImage.filename,
      data: buffer.toString("base64")
    });
  } catch (err) {
    console.error("Error getting featured painting.", err);
    res.status(500).send();
  }
});

router.get("/paintings/1", async function (req, res) {
  console.log("in get one painting");
  // getImage("1logo.png", res);
  const files = await bucket.find({ filename: "1logo.png" }).toArray();

  if (!files || files.length === 0) {
    console.log("nothing found");
    return res.status(400).send();
  }
  console.log("got file", files.length);
  res.set("Content-Type", "image/png");
  res.set("Content-Disposition", `attachment; filename="1logo.png"`);
  bucket.openDownloadStreamByName("1logo.png").pipe(res);
});

function uploadFile(req, res, next) {
  const uploadHandle = multer().single("file");

  uploadHandle(req, res, (err) => {
    console.error("error happened", err);
    next();
  });
}

// Upload the image
router.post("/paintings", upload.single("file"), function (req, res) {
  if (!req.file) {
    console.log("no file");
    return res.status(400).send("No file uploaded.");
  } else {
    console.log("got file");
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
