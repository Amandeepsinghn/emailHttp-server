import express, { Router } from "express";
import { middleware } from "../middleware";
import {
  getAllData,
  getSingleResume,
  scanResume,
} from "../controllers/atsController";
import multer from "multer";
import fs from "fs";
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tmpPath = "/tmp";
    fs.mkdirSync(tmpPath, { recursive: true });
    cb(null, tmpPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.get("/getAllResume", middleware, getAllData);
router.post("/upload-pdf", middleware, upload.single("file"), scanResume);
router.get("/item/:itemId", middleware, getSingleResume);

export const atsRouter: Router = router;
