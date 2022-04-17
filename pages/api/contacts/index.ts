import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { ContactService } from "../../../src/services/Contact";
import { checkAuthUser } from "../auth/[...nextauth]";

const contactRouter=nextConnect({
    onNoMatch(req:NextApiRequest, res:NextApiResponse) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
})

contactRouter.post(async (req, res)=>{

    const contactService=new ContactService()
    try{
        const message=await contactService.createContactMessage(req.body)
        return res.status(200).json({
            data:message,
            message:"Message envoyé! "
        })
    }catch(e:any){
        return res.status(400).json({
            message:e.message
        })
    }
})

contactRouter.use(checkAuthUser).patch( async (req, res)=>{
    const contactService=new ContactService()
    try{
        const message=await contactService.editContactMessage(req.body)

        return res.status(200).json({
            data:message,
            message:"Message edité! "
        })
    }catch(e:any){
        return res.status(400).json({
            message:e.message
        })
    }
})


export default contactRouter