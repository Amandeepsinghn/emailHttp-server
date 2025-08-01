import { NextFunction,Request,Response } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT SECRET is not defined in environment variables.")
}


export const middleware = (req:Request,res:Response,next:NextFunction) => {
    const token = req.headers["authorization"] ?? "";

    const decoded = jwt.verify(token,JWT_SECRET)

    if(typeof decoded==="object" && "user_id" in decoded) {
        req.userId = decoded.user_id
        next();
    } else {
        res.status(403).json({
            message:"Unauthorized"
        })
    }
}