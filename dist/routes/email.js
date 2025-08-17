"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailRouter = void 0;
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = require("cloudinary");
const emailController_1 = require("../controllers/emailController");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudKey = process.env.CLOUDINARY_CLOUD_KEY;
const cloudSecret = process.env.CLOUDINARY_CLOUD_SECRET;
cloudinary_1.v2.config({
    cloud_name: cloudName !== null && cloudName !== void 0 ? cloudName : "",
    api_key: cloudKey !== null && cloudKey !== void 0 ? cloudKey : "",
    api_secret: cloudSecret !== null && cloudSecret !== void 0 ? cloudSecret : "",
});
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: (req, res) => ({
        folder: "uploads",
        allowedFormats: ["pdf"],
        public_id: res.originalname,
    }),
});
const upload = (0, multer_1.default)({ storage: storage });
router.post("/sendEmail", middleware_1.middleware, emailController_1.emailSender);
router.post("/uploadResume", middleware_1.middleware, upload.single("file"), emailController_1.uploadResume);
router.post("/pdfbody", middleware_1.middleware, emailController_1.pdfBody);
router.post("/formalTone", middleware_1.middleware, emailController_1.formalTone);
exports.emailRouter = router;
//# sourceMappingURL=email.js.map