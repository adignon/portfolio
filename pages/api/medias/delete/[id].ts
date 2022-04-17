import { NextApiRequest, NextApiResponse } from "next";
import connect from "next-connect"
import multer from "multer"
import { getSession } from "next-auth/react";
import { UploaderModule } from "../../../../src/services/Uploader";
import { resolve } from "path";
import { prisma } from "../../../../src/database";
import {v4} from "uuid"
import slugify from "slugify"
import { ConfigService } from "../../../../src/services/Config";
import { deleteFile } from "../upload";

const mediaRouter=connect({
    onNoMatch(req:NextApiRequest, res:NextApiResponse) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
})

mediaRouter.delete(async (req:NextApiRequest, res:NextApiResponse)=>{
    const session=await getSession({req})
    if(session){
        if(req.query.id instanceof Array){
            try{
                const data=await prisma.media.findUnique({
                    where:{
                        id:req.query.id as any
                    }
                })
                if(data){
                    await deleteFile(data, data.source as any)
                    return res.status(200).json({
                        message:"Fichier supprimé"
                    })
                }else{
                    return res.status(400).json({
                        message:"fichier non trouvé."
                    })
                }
            }catch(e){
                return res.status(400).json({
                    message:"Une erreur est survenue lors de la suppression."
                })
            }
        }else{
            return res.status(400).json({
                message:"Données invalides."
            })
        }
    }else{
        return res.status(400).json({
            message:"Vous ne pouvez pas éffectuer cette action."
        })
    }
    
})


export default mediaRouter
