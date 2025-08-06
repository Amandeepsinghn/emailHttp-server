"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailRouter = void 0;
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const emailController_1 = require("../controllers/emailController");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "emails/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage });
router.post("/sendEmail", middleware_1.middleware, emailController_1.emailSender);
router.post("/uploadResume", middleware_1.middleware, upload.single("file"), emailController_1.uploadResume);
router.get("/pdfbody", middleware_1.middleware, emailController_1.pdfBody);
router.post("/formalTone", middleware_1.middleware, emailController_1.formalTone);
exports.emailRouter = router;
//# sourceMappingURL=email.js.map