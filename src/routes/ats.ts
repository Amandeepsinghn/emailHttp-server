import express, { Router } from "express";
import { middleware } from "../middleware";
import {
  getAllData,
  getLatestScore,
  getSingleResume,
  scanResume,
} from "../controllers/atsController";
import multer from "multer";
import fs from "fs";
const router = express.Router();
import * as dotenv from "dotenv";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { string } from "zod";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudKey = process.env.CLOUDINARY_CLOUD_KEY;
const cloudSecret = process.env.CLOUDINARY_CLOUD_SECRET;

cloudinary.config({
  cloud_name: cloudName ?? "",
  api_key: cloudKey ?? "",
  api_secret: cloudSecret ?? "",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowedFormats: ["pdf"],
  } as any,
});

const upload = multer({ storage: storage });

router.get("/getAllResume", middleware, getAllData);
router.post("/upload-pdf", middleware, upload.single("file"), scanResume);
router.get("/item/:itemId", middleware, getSingleResume);
router.get("/getLatestScore", middleware, getLatestScore);

export const atsRouter: Router = router;
