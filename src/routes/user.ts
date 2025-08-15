import express, { Router } from "express";
import {
  blogsInfo,
  dashboardInfo,
  logIn,
  signUp,
  updateBlogs,
} from "../controllers/loginController";
import { middleware } from "../middleware";

const router = express.Router();

router.post("/signup", signUp);

router.post("/login", logIn);

router.get("/getDashboard", middleware, dashboardInfo);

router.post("/updateBlogs", middleware, blogsInfo);

router.post("/newUpdateBlogs", middleware, updateBlogs);

export const userRouter: Router = router;
