import { Media } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import connect from "next-connect"
import { prisma } from "../../../src/database";
import { deleteFile, upload, uploader } from "../medias/upload";
import {v4} from "uuid"
import { FunService } from "../../../src/services/Func";
import { ValidatorService } from "../../../src/services/Validator";
import { ProjectDto } from "../../../src/dto/project";

const projectRouter=connect({
    onNoMatch(req:NextApiRequest, res:NextApiResponse) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
})

export const deletePersisitedFiles=async (persistedImages:any)=>{
    await Promise.all(persistedImages.map(async (f:any)=>{
        //delete images datas
        const data=await prisma.media.delete({
            where:{
                id:f.media.id
            }
        })
        //delete images 
        await deleteFile(f.media, data.source as any)
    }))
}

projectRouter.post(async (req:any, res:NextApiResponse)=>{
    try{
        let deleteMedias:Array<any>=[];
        const updateMedias=(oldMedias:Array<Media>, newMedias:Array<Media>)=>{
            const funcService=new FunService()
            
            return funcService.UpdateManyNestedField(newMedias, [
                {   //Connect new medias
                    action:"connect",
                    filter:(data:any)=>data
                },
                {
                    //Disconnect removed medias
                    action:"disconnect",
                    filter:(data:any)=>{
                        const d=oldMedias ? oldMedias.filter((me:any)=>!Boolean(data.find((d:any)=>d.id===me.id))) : []
                        deleteMedias=[
                            ...deleteMedias,
                            ...d
                        ]
                        return d;
                    }
                }
            ])
        }
    
        const validator=new ValidatorService()
        const formDatas=req.body
        
        if(formDatas && validator.joiValidate(ProjectDto(formDatas.hasOwnProperty("id") ? "update":"create"),formDatas )){
            //description, imageFiles, fromDate, option, title, toDate, gitUrl, appUrl?, attachedFiles?
            
                const {medias:oldImageMedias, downloadedMedias:oldAttachedMedias,  metas:oldMetas}:any=formDatas.hasOwnProperty("id") ?await prisma.project.findUnique({
                    where:{
                        id:formDatas?.id
                    },
                    include:{
                        medias:true,
                        metas:true,
                        downloadedMedias:true
                    }
                }): {}
                
                const {attachedFiles,appUrl,gitUrl,imageFiles,toDate,fromDate,option,   ...data}=formDatas
                const d={
                    id:formDatas.hasOwnProperty("id") ? undefined:v4(),
                    ...data,
                    endAt:new Date(formDatas.toDate),
                    startAt:new Date(formDatas.fromDate),
                    title:formDatas.title,
                    status:option.toUpperCase(),
                    medias:Boolean(formDatas.hasOwnProperty("id")) && Boolean(oldImageMedias)  ? 
                    updateMedias(oldImageMedias, imageFiles)
                    :
                    {
                        connect:imageFiles.map((f:any)=>({
                            id:f!.id as string
                        }))
                    },
                    downloadedMedias:Boolean(formDatas.hasOwnProperty("id")) && Boolean(oldAttachedMedias) && Boolean(oldAttachedMedias?.length) ? 
                    updateMedias(oldAttachedMedias ?? [], attachedFiles)
                    :
                    {
                        connect:attachedFiles.map((f:any)=>({
                            id:f!.id as string
                        }))
                    },
                    ...(!Boolean(formDatas?.id)?{
                        metas:{
                            create:[
                                {
                                    key:"GIT_REPOSITORY",
                                    value:formDatas?.gitUrl 
                                },
                                {
                                    key:"APP_URL",
                                    value:formDatas?.appUrl
                                }
                            ]
                        }
                    }:{})
                }
                //update metas
                if(Boolean(formDatas?.id)){
                    console.log("here")
                    await prisma.projectMeta.update({
                        data:{
                            value:formDatas?.gitUrl 
                        },
                        where:{
                            id:(await prisma.projectMeta.findFirst({where:{projectId:{equals:formDatas?.id},key:{equals:"GIT_REPOSITORY", }}}))?.id,
                        }
                    })
                    await prisma.projectMeta.update({
                        data:{
                            value:formDatas?.appUrl
                        },
                        where:{
                            id:(await prisma.projectMeta.findFirst({where:{projectId:{equals:formDatas?.id},key:{equals:"APP_URL"}}}))?.id,
                        }
                    })
                }
                if(deleteMedias.length){
                    for(let i in deleteMedias){
                        await deleteFile(deleteMedias[i], deleteMedias[i].source)
                    }
                }
                const project=await (prisma.project as any)[Boolean(formDatas.hasOwnProperty("id")) ? "update":"create"]({
                    data:d,
                    include:{
                        medias:true,
                        downloadedMedias:true,
                        metas:true
                    },
                    ...(formDatas.hasOwnProperty("id") ? {
                        where:{
                            id:formDatas?.id
                        }
                    }:{

                    })
                })
                return res.status(200).json({
                    message:"Projet enrégstré",
                    data:project
                })
            
        }
          
        return res.status(400).json({
            message:"Données invalides"
        })
    }catch(e){
        console.log(e)
        return res.status(400).json({
            message:"Une erreur est survenue"
        })
    }

})



export default projectRouter;