import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

import Document from "../models/Document.js";
import Chunk from "../models/Chunk.js";
import { createChunks } from "../utils/chunkEngine.js";
import { generateEmbedding } from "../utils/embeddingEngine.js";

const router = express.Router();

const uploadFolder = "uploads";
const rawTextFolder = "documents/raw_text";
const metadataFolder = "documents/metadata";

[uploadFolder, rawTextFolder, metadataFolder].forEach((folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: uploadFolder,

  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "-");
    cb(null, Date.now() + "-" + safeName);
  }
});

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain"
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOCX, and TXT files are allowed"));
    }
  }
});

function cleanText(rawText = "") {
  let text = String(rawText);

  text = text.normalize("NFKD");
  text = text.replace(/https?:\/\/\S+/g, "");
  text = text.replace(/\S+@\S+\.\S+/g, "");
  text = text.replace(/Page\s+\d+/gi, "");
  text = text.replace(/[-_]{3,}/g, "");
  text = text.replace(/[^a-zA-Z0-9\s.,!?;:()\-'"\/]/g, "");
  text = text.replace(/\n+/g, " ");
  text = text.replace(/\s+/g, " ");

  return text.trim();
}

async function extractText(filePath, fileType) {
  if (fileType === "pdf") {
    const buffer = fs.readFileSync(filePath);

    const parser = new PDFParse({
      data: buffer
    });

    const data = await parser.getText();
    await parser.destroy();

    return {
      text: data.text || "",
      pageCount: data.total || 0,
      metadata: {}
    };
  }

  if (fileType === "docx") {
    const result = await mammoth.extractRawText({
      path: filePath
    });

    return {
      text: result.value || "",
      pageCount: 0,
      metadata: {}
    };
  }

  if (fileType === "txt") {
    const text = fs.readFileSync(filePath, "utf-8");

    return {
      text,
      pageCount: 0,
      metadata: {}
    };
  }

  return {
    text: "",
    pageCount: 0,
    metadata: {}
  };
}

router.post("/upload", upload.single("document"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No document uploaded"
      });
    }

    const extension = path
      .extname(req.file.originalname)
      .toLowerCase()
      .replace(".", "");

    const duplicate = await Document.findOne({
      originalName: req.file.originalname,
      fileSize: req.file.size
    });

    const extracted = await extractText(req.file.path, extension);

    const rawText = extracted.text || "";
    const cleanedText = cleanText(rawText);

    const isEmptyText = cleanedText.trim().length === 0;

    const baseName = req.file.originalname.replace(/\.[^/.]+$/, "");
    const timeStamp = Date.now();

    const cleanTextPath = path.join(
      rawTextFolder,
      `${timeStamp}-${baseName}-clean.txt`
    );

    fs.writeFileSync(cleanTextPath, cleanedText, "utf-8");

    const metadataObject = {
      title:
        extracted.metadata?.Title ||
        req.file.originalname.replace(/\.[^/.]+$/, ""),

      authors:
        extracted.metadata?.Author ||
        extracted.metadata?.Creator ||
        "Not Available",

      fileType: extension,
      fileSize: req.file.size,
      pageCount: extracted.pageCount,
      textLength: cleanedText.length,
      cleanTextPath: cleanTextPath.replace(/\\/g, "/")
    };

    const metadataPath = path.join(
      metadataFolder,
      `${timeStamp}-${baseName}-metadata.json`
    );

    fs.writeFileSync(
      metadataPath,
      JSON.stringify(metadataObject, null, 2),
      "utf-8"
    );

    const document = await Document.create({
      fileName: req.file.filename,
      originalName: req.file.originalname,
      fileType: extension,
      fileSize: req.file.size,
      filePath: req.file.path.replace(/\\/g, "/"),
      cleanTextPath: cleanTextPath.replace(/\\/g, "/"),
      metadataPath: metadataPath.replace(/\\/g, "/"),

      title: metadataObject.title,
      authors: metadataObject.authors,
      pageCount: extracted.pageCount,
      textLength: cleanedText.length,

      qualityReport: {
        extractionSuccess: !isEmptyText,
        emptyText: isEmptyText,
        scannedPdfPossible: extension === "pdf" && isEmptyText,
        duplicateFile: Boolean(duplicate)
      }
    });

    await Chunk.deleteMany({
      documentId: document._id
    });

    const chunkObjects = createChunks(
      cleanedText,
      document._id,
      req.file.originalname
    );

    const savedChunks = [];

    for (const chunk of chunkObjects) {
      const embedding = await generateEmbedding(chunk.chunkText);

      const savedChunk = await Chunk.create({
        ...chunk,
        embedding
      });

      savedChunks.push(savedChunk._id);
    }

    document.chunks = chunkObjects.map((item) => item.chunkText);
    await document.save();

    res.status(201).json({
      message: "Document uploaded, cleaned, chunked, embedded, and processed successfully",
      document,
      totalChunks: savedChunks.length
    });

  } catch (error) {
    console.error("Document Upload Error:", error);

    res.status(500).json({
      message: "Document processing failed",
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

router.get("/:id/metadata", async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found"
      });
    }

    const chunkCount = await Chunk.countDocuments({
      documentId: document._id
    });

    res.json({
      title: document.title,
      authors: document.authors,
      fileType: document.fileType,
      fileSize: document.fileSize,
      pageCount: document.pageCount,
      textLength: document.textLength,
      cleanTextPath: document.cleanTextPath,
      metadataPath: document.metadataPath,
      chunkCount,
      qualityReport: document.qualityReport,
      uploadDate: document.createdAt
    });

  } catch (error) {
    res.status(500).json({
      message: "Metadata fetch failed",
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

    if (document.cleanTextPath && fs.existsSync(document.cleanTextPath)) {
      fs.unlinkSync(document.cleanTextPath);
    }

    if (document.metadataPath && fs.existsSync(document.metadataPath)) {
      fs.unlinkSync(document.metadataPath);
    }

    await Chunk.deleteMany({
      documentId: document._id
    });

    await Document.findByIdAndDelete(req.params.id);

    res.json({
      message: "Document and related chunks deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Document deletion failed",
      error: error.message
    });
  }
});

export default router;