import { Request,Response,NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';
import {email, z} from "zod";
import { prismaClient } from "../prisma";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT SECRET is not defined in environment variables.")
}

export const signUpBody = z.object({
    name:z.string().min(1).max(60),
    email:z.email(),
    password:z.string().min(1).max(50)
})

export const logInBody = z.object({
    email:z.email(),
    password:z.string().min(1).max(60)
})



export const signUp = async (req:Request,res:Response) => {
    const data = signUpBody.safeParse(req.body)

    if(!data.success) {
        return res.status(404).json({
            body:"please enter valid email,password,name"
        })
    }

    try {
        await prismaClient.user.create({
            data:{
                email:data.data.email,
                password:data.data.password,
                name:data.data.name,
            }
        })

        res.status(200).json({
            body:"user inserted"
        })
    } catch {
        res.status(500).json({
            body:"internal server error"
        })
    }

}

export const logIn = async (req:Request,res:Response) => {
    const data = logInBody.safeParse(req.body)

    if(!data.success) {
        return res.status(404).json({
            body:"please enter valid email,password"
        })
    }

    try {
        const user =  await prismaClient.user.findFirst({
            where:{
                email:data.data.email,
                password:data.data.password
            }
        })
        
        if(!user) {
            res.status(404).json({
                body:"user does not exsist"
            })
            return 
        }

        const token = jwt.sign({userId:user.id},JWT_SECRET)
        
        res.status(200).json({
            body:token
        })

    } catch {
        res.status(500).json({
            body:"internal server error"
        })
    }
}

export const dashboardInfo = async (req:Request,res:Response) => {

    const user = req.body

    try {
        const countEmail = await prismaClient.email.count({
            where:{
                userId:user.userId
            }
        })

        const countAts = await prismaClient.ats.count({
            where:{
                userId:user.userId
            }
        })

        return res.status(200).json({
            body:{
                email:countEmail,
                countAts:countAts
            }
        })
        
    } catch {
        res.status(500).json({
            body:"internal server error"
        })
    }
    

}
