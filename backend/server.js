import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import studentRoutes from "./src/routes/studentRoutes.js";
import { notFound, errorHandler } from "./src/middleware/errorMiddleware.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", message: "Student API is running" });
});
app.use("/api/students", studentRoutes);
app.use(notFound);
app.use(errorHandler);

async function start() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is missing. Add it to backend/.env");
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}
start();
