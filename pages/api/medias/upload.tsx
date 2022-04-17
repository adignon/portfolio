import { NextApiRequest, NextApiResponse } from "next";
import connect from "next-connect"
import multer from "multer"
import { getSession } from "next-auth/react";
import { UploaderModule } from "../../../src/services/Uploader";
import { resolve } from "path";
import { prisma } from "../../../src/database";
import {v4} from "uuid"
import slugify from "slugify"
import { ConfigService } from "../../../src/services/Config";

const firebaseConfig = {

    apiKey: "AIzaSyDj70Q5qsgqV7NmUCQsdYzHv2wAXmwGaww",
  
    authDomain: "utility-root-300705.firebaseapp.com",
  
    projectId: "utility-root-300705",
  
    storageBucket: "utility-root-300705.appspot.com",
  
    messagingSenderId: "224493007192",
  
    appId: "1:224493007192:web:f768f3402fd8b28600b52d",
  
    measurementId: "G-0HDTZ0XGFH"
  
  };

  
  
const mediaRouter=connect({
    onNoMatch(req:NextApiRequest, res:NextApiResponse) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
})

export const uploader = multer({
    storage: multer.memoryStorage()
});
//local uploader
const fileUploader=new UploaderModule.LocalStorage()
//firebase uploader
const firebaseUploader=new UploaderModule.FirebaseStorage(firebaseConfig)
firebaseUploader.baseDir=process.env.BASE_FIREBASE_UPLOAD_DIR as string


export const upload=async (file:any)=>{
    try{
        if(file){
            
            const config=new ConfigService()
            const acceptedTypes=await config.getConfig("FILE_TYPE_REGEX")
            const type=acceptedTypes.map((t:any)=>t.replace("*","(.*?)")).find((t:any)=>new RegExp(t, "i").test(file.mimetype))
            if(type){
                let path:string
                let metadata:any={}
                //process.env.UPLOAD_FILE_STORAGE_AREA == "LOCAL" | "FIREBASE"
                let source:"LOCAL"|"FIREBASE"=process.env.UPLOAD_FILE_STORAGE_AREA as "LOCAL"|"FIREBASE"
                let area=process.env.UPLOAD_FILE_STORAGE_AREA
                const areal=process.env.UPLOAD_FILE_STORAGE_AREA
                if(areal=="LOCAL"){
                    const ext=file.originalname.slice(file.originalname.lastIndexOf(".")+1)
                    path=process.env.BASE_LOCAL_UPLOAD_DIR!+"/"+slugify(file.originalname.slice(0,file.originalname.lastIndexOf(".")))+Date.now()+"."+ext
                    await fileUploader.save(path, file.buffer)
                }else{
                    const {path:p="", ...data}=(await firebaseUploader.save(file)) ??{}
                    path=p
                    metadata=data
                }

                const media=await prisma.media.create({
                    data:{
                        id:v4(),
                        metaType:file.mimetype,
                        path,
                        source,
                        fullPath:Boolean(metadata.url) ?metadata.url: process.env.BASE_URL+path.replace(/(\/){2,}/g, "/"),
                        mediaMeta:metadata as any,
                        type:"IMAGE"
                    }
                })
                return {
                    status:200,
                    message:"Fichier téléchargé",
                    media
                }
            }else{
                return{
                    status:400,
                    message:"Type de fichier non autorisé"
                }
            }
            
        }
            
    }catch(e){
        console.log(e)
        
    }
    return {
        status:400,
        message:"Téléchargement de fichier échoué."
    }
}

export const deleteFile=async (data:any, source:"LOCAL"|"FIREBASE"="LOCAL")=>{
    try{
        if(source==="LOCAL"){
            await fileUploader.rm(data.path)
            return true
        }else if(source==="FIREBASE"){
            await firebaseUploader.rm(data.mediaMeta?.url)
        }
    }catch(e){
        return false
    }
}

mediaRouter.use(uploader.single("file")).post(async (req:any, res:NextApiResponse)=>{
    const session=await getSession({req})
    const {status, ...data}=await upload(req.file)
    console.log(data)
    if(status===400){
        return res.status(400).json(data)
    }else{
        return res.status(200).json(data)
    }
})

export const config = {
    api: {
      bodyParser: false, // Disallow body parsing, consume as stream
    },
};

export default mediaRouter

