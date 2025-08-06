"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.atsRouter = void 0;
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const atsController_1 = require("../controllers/atsController");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage });
router.get("/getAllResume", middleware_1.middleware, atsController_1.getAllData);
router.post("/upload-pdf", middleware_1.middleware, upload.single("file"), atsController_1.scanResume);
router.get("/item/:itemId", middleware_1.middleware, atsController_1.getSingleResume);
exports.atsRouter = router;
//# sourceMappingURL=ats.js.map