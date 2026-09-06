import express from "express";

import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

import auth from "./routes/auth.js";

import Product from "./routes/product.js";

import Cart from "./routes/cart.js";

import multer from "multer";

import * as uuid from "uuid";

import type { Request, Response, NextFunction } from "express";
import type { CustomError } from "./types/common.js";
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(express.json());
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "./uploads");
  },
  filename(_req, file, callback) {
    callback(null, uuid.v4() + "-" + file.originalname);
  },
});

const fileFilter = (_req: any, file: any, cb: any) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
app.use(multer({ storage: storage, fileFilter: fileFilter }).single("avatar"));

app.use("/auth", auth);

app.use("/products", Product);

app.use("/cart", Cart);

app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  (error: CustomError, _req: Request, res: Response, _next: NextFunction) => {
    console.log(error);
    const message = error.message || "Something went wrong";
    const status = error.statusCode || 500;
    const data = error.data || null;

    return res.status(status).json({ message: message, data: data });
  },
);
const startServer = async () => {
  try {
    const uri = process.env.DB_CONNECT2 || "";
    await mongoose.connect(uri);
    console.log("Connected to DB");
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

startServer();
