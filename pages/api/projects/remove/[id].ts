import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { prisma } from "../../../../src/database";
import { deletePersisitedFiles } from "../save";

/*export default (req, res)=>{
    return res.json({})
}*/


const projectRouter=nextConnect({
    onNoMatch(req:NextApiRequest, res:NextApiResponse) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
})

projectRouter.delete(async(req:NextApiRequest, res:NextApiResponse)=>{

    try{
        const project=await prisma.project.delete({
            where:{
                id:req.query.id as string
            },
            include:{
                medias:true,
                metas:true
            }
        })
        await deletePersisitedFiles(project.medias.map((m)=>({
            status:200,
            media:m
        })))

        await prisma.projectMeta.deleteMany({
            where:{
                id:{
                    in:project.metas.map((m)=>(m.id)) as any
                }
            }
        })
        return res.status(200).json({
            message:"Projet supprimé"
        })
    }catch(e){
        console.log(e)
        return res.status(400).json({
            message:"Une erreur est survenue."
        })
    }
})

export default projectRouter;