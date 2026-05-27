import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import apiRouter from "./api/index.js";
import cookieParser from "cookie-parser";
import authMiddleware from "./middlewares/authMiddleware.js";
dotenv.config();

const CLIENT_URL = process.env.CLIENT_URL;

const app = express();

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(authMiddleware);
app.use("/api", apiRouter);
app.use("/uploads", express.static("uploads"));

app.get("/health", (req, res) => {
  return res.status(200).send("Hello world!");
});

export default app;
