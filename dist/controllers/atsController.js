"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.getSingleResume = exports.scanResume = exports.getAllData = void 0;
const cloudinary_1 = require("cloudinary");
const dotenv = __importStar(require("dotenv"));
const prisma_1 = require("../prisma");
const pdf_parse_1 = __importDefault(require("pdf-parse"));
dotenv.config();
const utils_1 = require("../utils");
const JWT_SECRET = process.env.JWT_SECRET;
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudKey = process.env.CLOUDINARY_CLOUD_KEY;
const cloudSecret = process.env.CLOUDINARY_CLOUD_SECRET;
cloudinary_1.v2.config({
    cloud_name: cloudName !== null && cloudName !== void 0 ? cloudName : "",
    api_key: cloudKey !== null && cloudKey !== void 0 ? cloudKey : "",
    api_secret: cloudSecret !== null && cloudSecret !== void 0 ? cloudSecret : "",
});
if (!JWT_SECRET) {
    throw new Error("JWT SECRET is not defined in environment variables.");
}
const getAllData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        return res.status(404).json({
            body: "user does not exsist",
        });
    }
    try {
        const data = yield prisma_1.prismaClient.email.findMany({
            where: {
                userId: req.userId,
            },
        });
        res.status(200).json({
            body: data,
        });
    }
    catch (_a) {
        res.status(500).json({
            body: "Internal servor Error",
        });
    }
});
exports.getAllData = getAllData;
const scanResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const responseFetch = yield fetch(url);
    if (!responseFetch.ok)
        throw new Error("Unable to fetch PDF file");
    const pdfBuffer = yield responseFetch.arrayBuffer();
    const data = yield (0, pdf_parse_1.default)(Buffer.from(pdfBuffer));
    const response = yield (0, utils_1.ats)(data.text);
    yield prisma_1.prismaClient.ats.create({
        data: {
            name: req.file.filename,
            score: response.score,
            area_improvement: response.area_improvement,
            good: response.good,
            bad: response.bad,
            userId: req.userId,
        },
    });
    return res.status(200).json({
        body: response,
    });
});
exports.scanResume = scanResume;
const getSingleResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const data = yield prisma_1.prismaClient.ats.findUnique({
            where: { id: itemId },
        });
        return res.status(404).json({
            body: data,
        });
    }
    catch (_a) {
        res.status(500).json({
            body: "Internal servor Error",
        });
    }
});
exports.getSingleResume = getSingleResume;
//# sourceMappingURL=atsController.js.map