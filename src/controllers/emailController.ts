import nodemailer from "nodemailer";
import { Request, Response } from "express";
import { prismaClient } from "../prisma";
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
          path: "emails/" + req.body.filename,
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

  try {
    return res.status(200).json({
      body: req.file.filename,
    });
  } catch {
    res.status(500).json({
      body: "Internal servor Error",
    });
  }
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
    const file = fs.readFileSync("emails/" + req.body.filename);

    const data = await pdf(file);

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
