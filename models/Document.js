import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true
    },

    originalName: {
      type: String,
      required: true
    },

    fileType: {
      type: String,
      required: true
    },

    fileSize: {
      type: Number,
      required: true
    },

    filePath: {
      type: String,
      required: true
    },

    cleanTextPath: {
      type: String,
      default: ""
    },

    metadataPath: {
      type: String,
      default: ""
    },

    title: {
      type: String,
      default: "Untitled Document"
    },

    authors: {
      type: String,
      default: "Not Available"
    },

    pageCount: {
      type: Number,
      default: 0
    },

    textLength: {
      type: Number,
      default: 0
    },

    chunks: {
      type: [String],
      default: []
    },

    qualityReport: {
      extractionSuccess: {
        type: Boolean,
        default: false
      },

      emptyText: {
        type: Boolean,
        default: false
      },

      scannedPdfPossible: {
        type: Boolean,
        default: false
      },

      duplicateFile: {
        type: Boolean,
        default: false
      }
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Document", documentSchema);