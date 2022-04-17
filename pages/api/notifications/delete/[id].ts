import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { Notification } from "../../../../src/services/Notification";
import { checkAuthUser } from "../../auth/[...nextauth]";

const notficationRouter=nextConnect({
    onNoMatch(req:NextApiRequest, res:NextApiResponse) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
})

notficationRouter.use(checkAuthUser).delete( async (req:NextApiRequest, res)=>{
    const notificationService=new Notification()
    const id:any=req.query.id
    try{
       if(id){
            return res.status(200).json(await notificationService.deleteNotification(id))
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