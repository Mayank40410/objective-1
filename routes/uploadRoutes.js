import express from "express";
import multer from "multer";
import fs from "fs";
import pdf from "pdf-parse";
import Document from "../models/Document.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

function splitText(text) {
  const words = text.split(" ");
  const chunks = [];

  for (let i = 0; i < words.length; i += 120) {
    chunks.push(words.slice(i, i + 120).join(" "));
  }

  return chunks;
}

router.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdf(dataBuffer);

    const chunks = splitText(data.text);

    const document = await Document.create({
      fileName: req.file.originalname,
      filePath: req.file.path,
      chunks
    });

    res.json({
      message: "PDF uploaded and processed successfully",
      document
    });
  } catch (error) {
    res.status(500).json({
      message: "PDF processing failed",
      error: error.message
    });
  }
});

router.get("/", async (req, res) => {
  const documents = await Document.find().sort({ createdAt: -1 });
  res.json(documents);
});

export default router;