"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_1 = require("./routes/user");
const ats_1 = require("./routes/ats");
const email_1 = require("./routes/email");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api", user_1.userRouter);
app.use("/api", ats_1.atsRouter);
app.use("/api", email_1.emailRouter);
app.listen(3000, () => console.log("Server ready on port 3000."));
//# sourceMappingURL=index.js.map