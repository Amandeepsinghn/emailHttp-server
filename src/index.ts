import express from "express";
import cors from "cors";
import { userRouter } from "./routes/user";
import { atsRouter } from "./routes/ats";
import { emailRouter } from "./routes/email";

const app = express();

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

app.use(express.json());
app.use(cors());

app.use("/api", userRouter);
app.use("/api", atsRouter);
app.use("/api", emailRouter);

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;
