import express,{ Router } from "express";
import { logIn, signUp } from "../controllers/loginController";

const router = express.Router();


router.post("/signup",signUp)

router.post("/login",logIn)

export const userRouter:Router = router;

