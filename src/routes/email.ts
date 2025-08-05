import express, { Router } from "express";
import { middleware } from "../middleware";
import { emailSender, formalTone, uploadResume } from "../controllers/emailController";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "emails/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post("/sendEmail", middleware, emailSender);
router.post("/uploadResume", middleware, upload.single("file"), uploadResume);
router.post("/pdfbody", middleware);
router.post("/formalTone", middleware, formalTone);

export const emailRouter: Router = router;
