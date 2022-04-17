import { prisma } from "../database"

export class ProjectService{
    getById=async(id:string)=>{
        try{
            const p=await prisma.project.findUnique({
                where:{
                    id
                },
                include:{
                    medias:true,
                    metas:true,
                    downloadedMedias:true
                }
            })
            return{
                status:200,
                data:p
            }
        }catch(e){
            return{
                status:400,
                message:"Projet non retrouvé"
            }
        }
    }

    getAll=async ()=>{
        try{
            const p=await prisma.project.findMany({
                include:{
                    medias:true,
                    metas:true,
                    downloadedMedias:true
                }
            })
            return{
                status:200,
                data:p
            }
        }catch(e){
            console.log(e)
            return{
                status:400,
                message:"Projet non retrouvé"
            }
        }
    }
}