import express from "express";
import cors from "cors";
import { userRouter } from "./routes/user";


const app = express();

declare global {
    namespace Express {
        interface Request {
            userId?:string
        }
    }
}


app.use(express.json());
app.use(cors());

app.use("/api",userRouter)



app.listen(3000);

