import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  fileName: String,
  filePath: String,
  chunks: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Document", documentSchema);