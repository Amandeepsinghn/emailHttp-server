import nodemailer from "nodemailer";
import { Request, Response } from "express";

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
    };

    await transporter.sendMail(mailOptions);
  }

  return res.status(200).json({
    body: "mail has been sent successfully",
  });
};
