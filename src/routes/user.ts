import express,{ Router } from "express";
import { dashboardInfo, logIn, signUp } from "../controllers/loginController";
import { middleware } from "../middleware";

const router = express.Router();

router.post("/signup",signUp)

router.post("/login",logIn)

router.get("/getDashboard",middleware,dashboardInfo)

export const userRouter:Router = router;

