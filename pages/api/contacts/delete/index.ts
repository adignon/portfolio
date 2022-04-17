import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { ContactService } from "../../../../src/services/Contact";
import { checkAuthUser } from "../../auth/[...nextauth]";

const contactRouter=nextConnect({
    onNoMatch(req:NextApiRequest, res:NextApiResponse) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
})



contactRouter.use(checkAuthUser).post( async (req, res)=>{
    const contactService=new ContactService()
    try{
        await contactService.deleteContactMessage(req.body.data)
        
        return res.status(200).json({
            message:"Message supprimé! "
        })
    }catch(e:any){
        return res.status(400).json({
            message:e.message
        })
    }
})

export default contactRouter