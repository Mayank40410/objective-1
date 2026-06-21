import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true
    },

    fileName: {
      type: String,
      required: true
    },

    chunkText: {
      type: String,
      required: true
    },

    chunkIndex: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Chunk", chunkSchema);