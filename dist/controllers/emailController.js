"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfBody = exports.formalTone = exports.uploadResume = exports.emailSender = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const utils_1 = require("../utils");
const zod_1 = require("zod");
const emailSchema = zod_1.z.object({
    email: zod_1.z.email(),
    emailSender: zod_1.z.array(zod_1.z.email()),
    subject: zod_1.z.string().min(1, "subject is required"),
    password: zod_1.z.string().min(1, "please provide valid password"),
    resumeUrl: zod_1.z.string(),
    text: zod_1.z.string().min(1, "please write body"),
    filename: zod_1.z.string(),
    appPassword: zod_1.z.string().min(1, "please write app password"),
});
const emailSender = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = emailSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            error: result.error,
        });
    }
    const data = result.data;
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: data.email,
            pass: data.password,
        },
    });
    const response = yield fetch(data.resumeUrl);
    if (!response.ok)
        throw new Error("Failed to fetch PDF from Cloudinary");
    const pdfBuffer = yield response.arrayBuffer();
    for (let i = 0; i < data.emailSender.length; i++) {
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
        const resume = yield transporter.sendMail(mailOptions);
        if (!resume.response) {
            return res.status(401).json({
                body: "app password is incorrect",
            });
        }
    }
    // Removing the pdf file
    const filePath = "emails/" + req.body.filename;
    fs_1.default.unlinkSync(filePath);
    return res.status(200).json({
        body: "mail has been sent successfully",
    });
});
exports.emailSender = emailSender;
const uploadResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const url = cloudinary_1.v2.url(publicId, { resource_type: "raw" });
    return res.status(200).json({
        body: url,
    });
});
exports.uploadResume = uploadResume;
const formalTone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body.data;
    try {
        const response = yield (0, utils_1.formalBody)(data);
        return res.status(200).json({
            body: response,
        });
    }
    catch (_a) {
        res.status(500).json({
            body: "Internal servor Error",
        });
    }
});
exports.formalTone = formalTone;
const pdfBody = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = req.body.data;
        const responseFetch = yield fetch(url);
        if (!responseFetch.ok)
            throw new Error("Unable to fetch PDF file");
        const pdfBuffer = yield responseFetch.arrayBuffer();
        const data = yield (0, pdf_parse_1.default)(Buffer.from(pdfBuffer));
        const response = yield (0, utils_1.pdfScan)(data.text);
        return res.status(200).json({
            body: response,
        });
    }
    catch (_a) {
        return res.status(500).json({
            body: "Internal Servor Error",
        });
    }
});
exports.pdfBody = pdfBody;
//# sourceMappingURL=emailController.js.map