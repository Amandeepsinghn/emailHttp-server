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
exports.updateBlogs = exports.blogsInfo = exports.dashboardInfo = exports.logIn = exports.signUp = exports.logInBody = exports.signUpBody = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
const zod_1 = require("zod");
const prisma_1 = require("../prisma");
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT SECRET is not defined in environment variables.");
}
exports.signUpBody = zod_1.z.object({
    name: zod_1.z.string().min(1).max(60),
    email: zod_1.z.email(),
    password: zod_1.z.string().min(1).max(50),
});
exports.logInBody = zod_1.z.object({
    email: zod_1.z.email(),
    password: zod_1.z.string().min(1).max(60),
});
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = exports.signUpBody.safeParse(req.body);
    if (!data.success) {
        return res.status(404).json({
            body: "please enter valid email,password,name",
        });
    }
    try {
        const alreadyPresent = yield prisma_1.prismaClient.user.findUnique({
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
        yield prisma_1.prismaClient.user.create({
            data: {
                email: data.data.email,
                password: data.data.password,
                name: data.data.name,
            },
        });
        res.status(200).json({
            body: "user inserted",
        });
    }
    catch (_a) {
        res.status(500).json({
            body: "internal server error",
        });
    }
});
exports.signUp = signUp;
const logIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = exports.logInBody.safeParse(req.body);
    if (!data.success) {
        return res.status(404).json({
            body: "please enter valid email,password",
        });
    }
    try {
        const user = yield prisma_1.prismaClient.user.findFirst({
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
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET);
        res.status(200).json({
            body: token,
        });
    }
    catch (_a) {
        res.status(500).json({
            body: "internal server error",
        });
    }
});
exports.logIn = logIn;
const dashboardInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        return res.status(404).json({
            body: "user id does not exsist",
        });
    }
    try {
        const countEmail = yield prisma_1.prismaClient.email.count({
            where: {
                userId: req.userId,
            },
        });
        const countAts = yield prisma_1.prismaClient.ats.count({
            where: {
                userId: req.userId,
            },
        });
        const countBlog = yield prisma_1.prismaClient.blogs.count({
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
    }
    catch (_a) {
        res.status(500).json({
            body: "internal server error",
        });
    }
});
exports.dashboardInfo = dashboardInfo;
const blogsInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    if (!req.userId) {
        return res.status(404).json({
            body: "does not found the field",
        });
    }
    try {
        const data = yield prisma_1.prismaClient.blogs.findFirst({
            where: { userId: req.userId },
        });
        let count = 0;
        if ((data === null || data === void 0 ? void 0 : data.blog_1) === true) {
            count += 1;
        }
        if ((data === null || data === void 0 ? void 0 : data.blog_2) === true) {
            count += 1;
        }
        if ((data === null || data === void 0 ? void 0 : data.blog_3) === true) {
            count += 1;
        }
        if ((data === null || data === void 0 ? void 0 : data.blog_4) === true) {
            count += 1;
        }
        return res.status(200).json({
            score: count,
        });
    }
    catch (_a) {
        res.status(500).json({
            body: "Internal server error",
        });
    }
});
exports.blogsInfo = blogsInfo;
const updateBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    if (!req.userId) {
        return res.status(404).json({
            body: "does not found the field",
        });
    }
    const data = yield prisma_1.prismaClient.blogs.update({
        where: { userId: req.userId },
        data: req.body,
    });
    return res.send("updated successful");
});
exports.updateBlogs = updateBlogs;
//# sourceMappingURL=loginController.js.map