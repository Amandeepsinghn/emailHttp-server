import express, { Router } from "express";
import { middleware } from "../middleware";
import { emailSender } from "../controllers/emailController";

const router = express.Router();

router.post("/sendEmail", middleware, emailSender);

export const emailRouter: Router = router;
