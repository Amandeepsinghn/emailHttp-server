"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const loginController_1 = require("../controllers/loginController");
const middleware_1 = require("../middleware");
const router = express_1.default.Router();
router.post("/signup", loginController_1.signUp);
router.post("/login", loginController_1.logIn);
router.get("/getDashboard", middleware_1.middleware, loginController_1.dashboardInfo);
router.post("/updateBlogs", middleware_1.middleware, loginController_1.blogsInfo);
router.post("/newUpdateBlogs", middleware_1.middleware, loginController_1.updateBlogs);
exports.userRouter = router;
//# sourceMappingURL=user.js.map