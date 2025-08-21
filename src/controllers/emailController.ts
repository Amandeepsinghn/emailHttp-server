import nodemailer from "nodemailer";
import { Request, Response } from "express";
import { prismaClient } from "../prisma";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import pdf from "pdf-parse";
import { formalBody, pdfScan } from "../utils";
import { file, success } from "zod";
import { buffer } from "stream/consumers";
import { z } from "zod";
import { primitiveTypes } from "zod/v4/core/util.cjs";

const emailSchema = z.object({
  email: z.email(),
  emailSender: z.array(z.email()),
  subject: z.string().min(1, "subject is required"),
  password: z.string().min(1, "please provide valid password"),
  resumeUrl: z.string(),
  text: z.string().min(1, "please write body"),
  filename: z.string(),
  appPassword: z.string().min(1, "please write app password"),
});

export const emailSender = async (req: Request, res: Response) => {
  const result = emailSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: result.error,
    });
  }

  if (!req.userId) {
    return res.send("user does not exsist");
  }

  const data = result.data;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: data.email,
      pass: data.password,
    },
  });

  const response = await fetch(data.resumeUrl);

  if (!response.ok) throw new Error("Failed to fetch PDF from Cloudinary");

  const pdfBuffer = await response.arrayBuffer();

  let emailCount = 0;

  for (let i = 0; i < data.emailSender.length; i++) {
    emailCount += 1;
    const mailOptions = {
      from: data.email,
      to: data.emailSender[i],
      subject: data.subject,
      text: data.text,
      attachments: [
        {
          filename: data.filename,
          content: Buffer.from(pdfBuffer),
          contentType: "application/pdf",
        },
      ],
    };

    const resume = await transporter.sendMail(mailOptions);

    if (!resume.response) {
      return res.status(401).json({
        body: "app password is incorrect",
      });
    }
  }

  // Removing the pdf file
  // const filePath = "emails/" + req.body.filename;
  // fs.unlinkSync(filePath);
  await prismaClient.email.upsert({
    where: {
      userId: req.userId,
    },
    update: {
      count: { increment: emailCount },
    },
    create: {
      userId: req.userId,
      count: emailCount,
    },
  });

  return res.status(200).json({
    body: "mail has been sent successfully",
  });
};

export const uploadResume = async (req: Request, res: Response) => {
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

  return res.status(200).json({
    body: url,
  });
};

export const formalTone = async (req: Request, res: Response) => {
  const data = req.body.data;

  try {
    const response = await formalBody(data);

    return res.status(200).json({
      body: response,
    });
  } catch {
    res.status(500).json({
      body: "Internal servor Error",
    });
  }
};

export const pdfBody = async (req: Request, res: Response) => {
  try {
    const url = req.body.data;

    const responseFetch = await fetch(url);
    if (!responseFetch.ok) throw new Error("Unable to fetch PDF file");
    const pdfBuffer = await responseFetch.arrayBuffer();

    const data = await pdf(Buffer.from(pdfBuffer));

    const response = await pdfScan(data.text);

    return res.status(200).json({
      body: response,
    });
  } catch {
    return res.status(500).json({
      body: "Internal Servor Error",
    });
  }
};
