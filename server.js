import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Folder setup */
const uploadsPath = path.join(__dirname, "uploads");
const documentsPath = path.join(__dirname, "documents");
const rawTextPath = path.join(__dirname, "documents", "raw_text");
const metadataPath = path.join(__dirname, "documents", "metadata");

[uploadsPath, documentsPath, rawTextPath, metadataPath].forEach((folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
});

/* Middleware */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

/* Static files */
app.use("/uploads", express.static(uploadsPath));
app.use("/documents", express.static(documentsPath));

/* Test route */
app.get("/", (req, res) => {
  res.send("Research Workspace Backend Running Successfully 🚀");
});

/* API routes */
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/documents", uploadRoutes);
app.use("/api/chat", chatRoutes);

/* Server start */
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("Upload folder ready:", uploadsPath);
      console.log("Document processing folders ready");
    });
  })
  .catch((error) => {
    console.log("Server startup failed:", error.message);
  });