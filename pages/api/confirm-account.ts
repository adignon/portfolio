//@ts-ignore
import { compareSync } from "bcryptjs";
import {NextApiRequest, NextApiResponse} from "next"
import { getSession } from "next-auth/react";
import nextConnect from "next-connect";
import { prisma } from "../../src/database";

const projectRouter=nextConnect({
    onNoMatch(req:NextApiRequest, res:NextApiResponse) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
})

projectRouter.post(async (req:NextApiRequest, res:NextApiResponse)=>{
    
    const session=await getSession({req})
    const {password}=req.body
    if(session){
        const userData=(session?.user as any)?.userData
        if(userData && userData?.id){
            const user = await prisma.account.findUnique({
                where:{
                    id:userData?.id
                }
            })
            if(compareSync(password, user?.hashPassword as string)){
                return res.status(200).json( {
                    message:"Compte validé"
                })
            }else{
                return res.status(400).json( {
                    message:"Mot de passe invalide"
                })
            }
        }
    }
    return res.status(400).json({
        message:"Session"
    })
})

export default projectRouter