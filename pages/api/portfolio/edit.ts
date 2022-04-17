import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { prisma } from "../../../src/database";
import { KnowledgeDto } from "../../../src/dto/knowledge";
import { ValidatorService } from "../../../src/services/Validator";
import {v4} from "uuid"
import { deleteFile, upload, uploader } from "../medias/upload";
import { PortfolioDto } from "../../../src/dto/Portfolio";
import { ConfigService } from "../../../src/services/Config";

const api=nextConnect({
    onNoMatch(req:NextApiRequest, res:NextApiResponse) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
})
const validator=new ValidatorService()
api.use(uploader.single("file")).post(async (req:NextApiRequest, res:NextApiResponse)=>{
    
   let file=(req as any).file
   let media:any=Boolean((req as any).body.media?.length)?JSON.parse((req as any).body.media):null
    if(file){
        try{
            const img=await upload(file)
            media=img.media
        } catch(e){
            return res.status(400).json({
                message:"Une erreur est survenue lors du téléchargement de l'image."
            })
        }
    }
    const createOrUpdateField=async (key:"PORTFOLIO_USER_IMAGE" | "PORTFOLIO_SLOGAN" | "PORTFOLIO_SUBSLOGAN" | "PORTFOLIO_DESCRIPTION", oldDatas:any, userData:any)=>{
        const oldslogan=oldDatas.find((d:any)=>d.key===key)
        let data;
        if(oldslogan){
            const v=await prisma.generalMeta.update({
                data:{
                    id:oldslogan?.id,
                    key,
                    value:userData
                },
                where:{
                    id:oldDatas.find((d:any)=>d.key===key)?.id
                }
            })
            data=v.value
        }else{
            const v=await prisma.generalMeta.create({
                data:{
                    id:v4(),
                    key:key,
                    value:userData
                }
            })
            data=v.value
        }
        return data
    }


    
    let data=req.body
    data={
        ...req.body,
        media
    }
    if(validator.joiValidate(PortfolioDto("u"), data)){
        const oldDatas=await prisma.generalMeta.findMany({
            where:{
                key:{
                    in:["PORTFOLIO_SUBSLOGAN", "PORTFOLIO_SLOGAN", "PORTFOLIO_DESCRIPTION", "PORTFOLIO_USER_IMAGE"]
                }
            },
            include:{
                media:true
            }
        })

        
        const slogan=await createOrUpdateField("PORTFOLIO_SLOGAN", oldDatas, data.slogan)            

        const subslogan=await createOrUpdateField("PORTFOLIO_SUBSLOGAN", oldDatas, data.subslogan)  

        const description=await createOrUpdateField("PORTFOLIO_DESCRIPTION", oldDatas, data.description)  
        
        let userImage:any
        if(Boolean(media?.id)){

            const oldMedia=oldDatas.find((d)=>d.key==="PORTFOLIO_USER_IMAGE")?.media
            console.log("oldMedias", oldMedia)
            if(oldMedia) await deleteFile(oldMedia, oldMedia.source as any)


            const image=await (prisma.generalMeta as any)[oldMedia?"update":"create"]({
                data:{
                    id:oldMedia? oldMedia.id : v4(),
                    key:"PORTFOLIO_USER_IMAGE",
                    media:{
                        connect:{
                            id:media.id
                        }
                    }
                },
                ...(oldMedia?{
                    where:{
                        id:oldDatas.find((d)=>d.key==="PORTFOLIO_USER_IMAGE")?.id
                    }
                }:{}),
                include:{
                    media:true
                }
            }) 
            userImage=image.media
        }else {
            const configService=new ConfigService()
            userImage=await configService.getConfig("PORTFOLIO_USER_IMAGE")
        }
        console.log(slogan, description,userImage, subslogan)
        return res.status(200).json({
            message:"Portfolio mise à jour.",
            data:{
                slogan, description,userImage, subslogan
            }
        })
    }else{
        return res.status(400).json({
            message:"Données invalides."
        })
    }



    
})
export const config = {
    api: {
      bodyParser: false, // Disallow body parsing, consume as stream
    },
};
export default api