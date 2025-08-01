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

    console.log(token)
    
    const decoded = jwt.verify(token,JWT_SECRET)

    console.log(decoded)

    if(typeof decoded==="object" && "userId" in decoded) {
        req.userId = decoded.userId
        next();
    } else {
        res.status(403).json({
            message:"Unauthorized"
        })
    }
}