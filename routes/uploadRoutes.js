import express from "express";
import multer from "multer";
import fs from "fs";
import { PDFParse } from "pdf-parse";
import Document from "../models/Document.js";

const router = express.Router();

const uploadFolder = "uploads";

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadFolder,
  filename: (req, file, cb) => {
    const safeFileName = file.originalname.replace(/\s+/g, "-");
    cb(null, Date.now() + "-" + safeFileName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  }
});

function splitText(text) {
  const cleanedText = text.replace(/\s+/g, " ").trim();
  const words = cleanedText.split(" ");
  const chunks = [];

  for (let i = 0; i < words.length; i += 120) {
    const chunk = words.slice(i, i + 120).join(" ");

    if (chunk.trim()) {
      chunks.push(chunk);
    }
  }

  return chunks;
}

router.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No PDF file uploaded"
      });
    }

    const dataBuffer = fs.readFileSync(req.file.path);

    const parser = new PDFParse({
      data: dataBuffer
    });

    const result = await parser.getText();

    await parser.destroy();

    const extractedText = result.text || "";

    if (!extractedText.trim()) {
      return res.status(400).json({
        message: "PDF uploaded, but no readable text was found"
      });
    }

    const chunks = splitText(extractedText);

    const document = await Document.create({
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      chunks
    });

    res.status(201).json({
      message: "PDF uploaded and processed successfully",
      document
    });

  } catch (error) {
    console.error("PDF Upload Error:", error);

    res.status(500).json({
      message: "PDF processing failed",
      error: error.message
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const documents = await Document.find().sort({
      createdAt: -1
    });

    res.json(documents);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch documents",
      error: error.message
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found"
      });
    }

    if (document.filePath && fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    await Document.findByIdAndDelete(req.params.id);

    res.json({
      message: "Document deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Document deletion failed",
      error: error.message
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found"
      });
    }

    if (document.filePath && fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    await Document.findByIdAndDelete(req.params.id);

    res.json({
      message: "PDF deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "PDF delete failed",
      error: error.message
    });
  }
});

export default router;