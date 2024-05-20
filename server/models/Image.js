const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "images.files",
      required: true,
      unique: true,
      index: true
    },
    fileName: { type: String, required: true },
    title: { type: String, required: true },
    descr: { type: String },
    category: { type: String, default: "NA" },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Image = mongoose.model("Image", imageSchema);
module.exports = Image;
