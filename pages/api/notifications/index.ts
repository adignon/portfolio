import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { prisma } from "../../../src/database";
import { ContactService } from "../../../src/services/Contact";
import { Notification } from "../../../src/services/Notification";
import { checkAuthUser } from "../auth/[...nextauth]";

const notficationRouter=nextConnect({
    onNoMatch(req:NextApiRequest, res:NextApiResponse) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
})

notficationRouter.use(checkAuthUser).patch( async (req, res)=>{

    const notificationService=new Notification()
    const data=req.body
    try{
       if(data.id){
            return res.status(200).json(await notificationService.editNotification({
                id:data.id,
                read:true
            }))
       }else{
            return res.status(400).json({
                message:"Données invalides"
            })
       }
    }catch(e:any){
        return res.status(400).json({
            message:e.message
        })
    }
})

export default notficationRouter