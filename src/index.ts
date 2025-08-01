import express from "express";
import cors from "cors";


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



