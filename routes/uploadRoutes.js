import express from "express";

const router = express.Router();

router.post("/upload", (req, res) => {
  res.json({
    message: "Document upload endpoint working"
  });
});

router.get("/", (req, res) => {
  res.json({
    message: "Documents fetched successfully",
    documents: []
  });
});

router.delete("/:id", (req, res) => {
  res.json({
    message: "Document deleted successfully"
  });
});

export default router;