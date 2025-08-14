import { Request, Response, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";
import * as dotenv from "dotenv";
import { prismaClient } from "../prisma";
import fs from "fs";
import pdf from "pdf-parse";
dotenv.config();

import { ats } from "../utils";

const JWT_SECRET = process.env.JWT_SECRET;

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudKey = process.env.CLOUDINARY_CLOUD_KEY;
const cloudSecret = process.env.CLOUDINARY_CLOUD_SECRET;

cloudinary.config({
  cloud_name: cloudName ?? "",
  api_key: cloudKey ?? "",
  api_secret: cloudSecret ?? "",
});

if (!JWT_SECRET) {
  throw new Error("JWT SECRET is not defined in environment variables.");
}

export const getAllData = async (req: Request, res: Response) => {
  if (!req.userId) {
    return res.status(404).json({
      body: "user does not exsist",
    });
  }

  try {
    const data = await prismaClient.ats.findMany({
      where: {
        userId: req.userId,
      },
    });

    res.status(200).json({
      body: data,
    });
  } catch {
    res.status(500).json({
      body: "Internal servor Error",
    });
  }
};

export const scanResume = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({
      body: "Please upload a file first",
    });
  }

  if (!req.userId) {
    return res.status(400).json({
      body: "invalid user",
    });
  }
  const publicId = req.file.path;

  const url = cloudinary.url(publicId, { resource_type: "raw" });

  const responseFetch = await fetch(url);
  if (!responseFetch.ok) throw new Error("Unable to fetch PDF file");
  const pdfBuffer = await responseFetch.arrayBuffer();

  const data = await pdf(Buffer.from(pdfBuffer));

  const response = await ats(data.text);

  await prismaClient.ats.create({
    data: {
      name: req.file.filename,
      score: response.score,
      area_improvement: response.area_improvement,
      good: response.good,
      bad: response.bad,
      userId: req.userId,
      resumeUrl: publicId,
    },
  });

  return res.status(200).json({
    body: response,
  });
};

export const getSingleResume = async (req: Request, res: Response) => {
  if (!req.userId) {
    return res.status(404).json({
      body: "userId does not exsist",
    });
  }

  const itemId = req.params.itemId;

  if (!itemId) {
    return res.status(404).json({
      body: "wrong itemId",
    });
  }

  try {
    const data = await prismaClient.ats.findUnique({
      where: { id: itemId },
    });
    return res.status(200).json({
      body: data,
    });
  } catch {
    res.status(500).json({
      body: "Internal servor Error",
    });
  }
};

export const getLatestScore = async (req: Request, res: Response) => {
  if (!req.userId) {
    return res.status(404).json({
      body: "userId does not exsist",
    });
  }

  const data = await prismaClient.ats.findFirst({
    where: { userId: req.userId },
  });

  return res.status(200).json({
    score: data?.score,
    name: data?.name,
  });
};
