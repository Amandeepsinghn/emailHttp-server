import express, { Router } from "express";
import { middleware } from "../middleware";
import { emailSender, uploadResume } from "../controllers/emailController";
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

export const emailRouter: Router = router;
