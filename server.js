import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";


const app = express();


/* ===============================
   Directory setup
================================ */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/* ===============================
   Middlewares
================================ */

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);


app.use(express.json());


/* ===============================
   Static Upload Folder
================================ */

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);


/* ===============================
   Test Route
================================ */

app.get("/", (req, res) => {

  res.send(
    "Research Workspace Backend Running Successfully 🚀"
  );

});


/* ===============================
   API Routes
================================ */


app.use("/api/auth", authRoutes);


app.use("/api/projects", projectRoutes);


app.use("/api/documents", uploadRoutes);


app.use("/api/chat", chatRoutes);



/* ===============================
   Server Start
================================ */


const PORT = process.env.PORT || 5000;


connectDB()
.then(()=>{

    app.listen(PORT, ()=>{

        console.log(
          `Server running on port ${PORT}`
        );

    });

})
.catch((error)=>{

    console.log(
      "Server startup failed:",
      error.message
    );

});