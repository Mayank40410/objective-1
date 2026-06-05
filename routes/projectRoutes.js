import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  res.json({
    message: "Project created successfully"
  });
});

router.get("/", (req, res) => {
  res.json({
    message: "All projects fetched successfully",
    projects: []
  });
});

router.delete("/:id", (req, res) => {
  res.json({
    message: "Project deleted successfully"
  });
});

export default router;