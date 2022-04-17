import { prisma } from "../database"
import { v4 } from "uuid"
import { NextApiRequest } from "next"

export class UsageService{
    async setusageData(req:NextApiRequest){
        try{
            return await prisma.usageMeta.create({
                data:{
                    id:v4(),
                    ipAdress:((req.headers['x-forwarded-for'] as string)?.split(",").shift()) ?? req.socket.remoteAddress,
                    visitedAt:new Date()
                }
            })
        }catch(e){
            console.log(e)
            return []
        }
    }
    async getAllUsageData(){
        try{
            return await prisma.usageMeta.findMany()
        }catch(e){
            console.log(e)
            return []
        }
    }
}