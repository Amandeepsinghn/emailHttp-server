import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { email, z } from "zod";
import { prismaClient } from "../prisma";
import { Interface } from "readline";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT SECRET is not defined in environment variables.");
}

export const signUpBody = z.object({
  name: z.string().min(1).max(60),
  email: z.email(),
  password: z.string().min(1).max(50),
});

export const logInBody = z.object({
  email: z.email(),
  password: z.string().min(1).max(60),
});

export const signUp = async (req: Request, res: Response) => {
  const data = signUpBody.safeParse(req.body);

  if (!data.success) {
    return res.status(404).json({
      body: "please enter valid email,password,name",
    });
  }

  try {
    const alreadyPresent = await prismaClient.user.findUnique({
      where: {
        email: data.data.email,
        password: data.data.password,
        name: data.data.name,
      },
    });

    if (alreadyPresent) {
      return res.status(402).json({
        body: "user already exsist",
      });
    }

    await prismaClient.user.create({
      data: {
        email: data.data.email,
        password: data.data.password,
        name: data.data.name,
      },
    });
    res.status(200).json({
      body: "user inserted",
    });
  } catch {
    res.status(500).json({
      body: "internal server error",
    });
  }
};

export const logIn = async (req: Request, res: Response) => {
  const data = logInBody.safeParse(req.body);

  if (!data.success) {
    return res.status(404).json({
      body: "please enter valid email,password",
    });
  }

  try {
    const user = await prismaClient.user.findFirst({
      where: {
        email: data.data.email,
        password: data.data.password,
      },
    });

    if (!user) {
      res.status(404).json({
        body: "user does not exsist",
      });
      return;
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    res.status(200).json({
      body: token,
    });
  } catch {
    res.status(500).json({
      body: "internal server error",
    });
  }
};

export const dashboardInfo = async (req: Request, res: Response) => {
  if (!req.userId) {
    return res.status(404).json({
      body: "user id does not exsist",
    });
  }

  try {
    const countEmail = await prismaClient.email.count({
      where: {
        userId: req.userId,
      },
    });

    const countAts = await prismaClient.ats.count({
      where: {
        userId: req.userId,
      },
    });

    const countBlog = await prismaClient.blogs.count({
      where: {
        userId: req.userId,
      },
    });

    return res.status(200).json({
      body: {
        email: countEmail,
        ats: countAts,
        blog: countBlog,
      },
    });
  } catch {
    res.status(500).json({
      body: "internal server error",
    });
  }
};

export const blogsInfo = async (req: Request, res: Response) => {
  const user = req.body;

  if (!req.userId) {
    return res.status(404).json({
      body: "does not found the field",
    });
  }

  try {
    const data = await prismaClient.blogs.upsert({
      where: { userId: req.userId },
      update: { count: user.count },
      create: { userId: req.userId, count: user.count },
    });

    return res.status(200).json({
      count: data.count,
    });
  } catch {
    res.status(500).json({
      body: "Internal server error",
    });
  }
};
