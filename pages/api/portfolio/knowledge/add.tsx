import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { prisma } from "../../../../src/database";
import { KnowledgeDto } from "../../../../src/dto/knowledge";
import { ValidatorService } from "../../../../src/services/Validator";
import {v4} from "uuid"

const api=nextConnect({
    onNoMatch(req:NextApiRequest, res:NextApiResponse) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
})
const validator=new ValidatorService()
api.post(async (req:NextApiRequest, res:NextApiResponse)=>{
    const data:any=req.body
    if((data.id && validator.joiValidate(KnowledgeDto("update"), data))||(validator.joiValidate(KnowledgeDto("create"), data))){
       try{
            if(data.id){
                const knowledge=await prisma.knowloadge.update({
                    where:{
                        id:data.id
                    },
                    data:{
                        ...data,
                        progress:Number(data.progress)
                    }
                })
                return res.status(200).json({
                    data:knowledge,
                    message:"Compétence modifié"
                })
            }else{
                const knowledge=await prisma.knowloadge.create({
                    data:{
                        id:v4(),
                        ...data,
                        progress:Number(data.progress)
                    }
                })
                return res.status(200).json({
                    data:knowledge,
                    message:"Compétence ajouté"
                })
            }
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
.delete(async (req:NextApiRequest, res:NextApiResponse)=>{
    const {id}=req.body
    if(id){
        try{
            await prisma.knowloadge.delete({
                where:{
                    id
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