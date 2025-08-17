import express, { Router } from "express";
import { middleware } from "../middleware";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import {
  emailSender,
  formalTone,
  pdfBody,
  uploadResume,
} from "../controllers/emailController";
import multer from "multer";

const router = express.Router();

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
  params: (req, res) =>
    ({
      folder: "uploads",
      allowedFormats: ["pdf"],
      public_id: res.originalname,
    } as any),
});

const upload = multer({ storage: storage });

router.post("/sendEmail", middleware, emailSender);
router.post("/uploadResume", middleware, upload.single("file"), uploadResume);
router.post("/pdfbody", middleware, pdfBody);
router.post("/formalTone", middleware, formalTone);

export const emailRouter: Router = router;
