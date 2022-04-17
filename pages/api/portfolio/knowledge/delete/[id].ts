import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { prisma } from "../../../../../src/database";

const api=nextConnect({
    onNoMatch(req:NextApiRequest, res:NextApiResponse) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
})

api.delete(async (req:NextApiRequest, res:NextApiResponse)=>{
    const id=req.query.id
    if(id){
        try{
            await prisma.knowloadge.delete({
                where:{
                    id:id as string
                }
            })
            return res.status(200).json({
                message:"Compétence supprimé"
            })
        }catch(e){
            console.log(e)
            return res.status(400).json({
                message:"Une erreur est survenue"
            })
        }
    }else{
        return res.status(400).json({
            message:"Données invalides"
        })   
    }
})


export default api