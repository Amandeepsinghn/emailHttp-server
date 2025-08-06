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
const fs_1 = __importDefault(require("fs"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const utils_1 = require("../utils");
const emailSender = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
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
        yield transporter.sendMail(mailOptions);
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
    try {
        return res.status(200).json({
            body: req.file.filename,
        });
    }
    catch (_a) {
        res.status(500).json({
            body: "Internal servor Error",
        });
    }
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
        const file = fs_1.default.readFileSync("emails/" + req.body.filename);
        const data = yield (0, pdf_parse_1.default)(file);
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