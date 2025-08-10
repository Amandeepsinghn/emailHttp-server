import { Request,Response,NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import * as dotenv from 'dotenv';
import { prismaClient } from "../prisma";
import fs from "fs";
import pdf from "pdf-parse";
dotenv.config();

import {ats} from "../utils"

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT SECRET is not defined in environment variables.")
}


export const getAllData = async (req:Request,res:Response)=>{

    if(!req.userId) {
        return res.status(404).json({
            body:"user does not exsist"
        })
    }

    try {
        const data = await prismaClient.email.findMany({
            where:{
                userId:req.userId
            }
        })

        res.status(200).json({
            body:data
        })

    } catch {
        res.status(500).json({
            body:"Internal servor Error"
        })
    }
}

export const scanResume = async (req:Request,res:Response) => {
    if(!req.file) {
        return res.status(400).json({
            body:"Please upload a file first"
        })
    }

    if(!req.userId) {
        return res.status(400).json({
            body:"invalid user"
        })
    }

    try {
        const file = fs.readFileSync(req.file.destination + req.file.filename)

        const data = await  pdf(file)
        
        const response = await ats(data.text)
        
        await prismaClient.ats.create({
            data:{
                name:req.file.filename,
                score:response.score,
                area_improvement:response.area_improvement,
                good:response.good,
                bad:response.bad,
                userId:req.userId
            }
        })

        return res.status(200).json({
            body:response
        })

    }
    catch {
        console.log(req.file.destination)
        res.status(500).json({
            body:"Internal servor Error"
        })
    }
    // finally {
    //     const filePath = req.file.destination + req.file.filename
    //     fs.unlink(filePath,(err)=>{
    //         if(err) {
                
    //             return res.status(500).json({body:"internal server error"})
    //         }
    //     })
    // }

}

export const getSingleResume = async(req:Request,res:Response) =>{
    if(!req.userId) {
        return res.status(404).json({
            body:"userId does not exsist"
        })
    }

    const itemId = req.params.itemId

    if(!itemId) {
        return res.status(404).json({
            body:"wrong itemId"
        })
    }

    try {
        const data = prismaClient.ats.findUnique({
            where:{id:itemId}
        })
        return res.status(404).json({
            body:data
        })

    } catch {
        res.status(500).json({
            body:"Internal servor Error"
        })
    }




}

