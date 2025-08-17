import nodemailer from "nodemailer";
import { Request, Response } from "express";
import { prismaClient } from "../prisma";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import pdf from "pdf-parse";
import { formalBody, pdfScan } from "../utils";
import { file } from "zod";

export const emailSender = async (req: Request, res: Response) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: req.body.email,
      pass: req.body.password,
    },
  });

  for (let i = 0; i < req.body.emailSender.length; i++) {
    const mailOptions = {
      from: req.body.email,
      to: req.body.emailSender[i],
      subject: req.body.subject,
      text: req.body.text,
      attachments: [
        {
          filename: req.body.filename,
          path: "tmp/emails/" + req.body.filename,
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
  }
  // Removing the pdf file
  const filePath = "emails/" + req.body.filename;
  fs.unlinkSync(filePath);

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
