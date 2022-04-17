import { unlink, writeFile } from "fs";
import {v2 as cl} from "cloudinary"
import {v4} from "uuid"
import streamifier from "streamifier"
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"
import { uploadBytes, ref, getDownloadURL, deleteObject, getMetadata } from "firebase/storage"

export module UploaderModule{
    export class LocalStorage{
        save(path:string, data:any){
            return new Promise((res, rej)=>{
                const pathfull="public"+(path[0]==="/" ? path : "/"+path)
                writeFile(pathfull, data, (err)=>{
                    if(err){
                        rej(false)
                    }else{
                        res(true)
                    }
                })
            })
        }



        rm(path:string){
            return new Promise((res, rej)=>{
                const pathfull="public"+(path[0]==="/" ? path : "/"+path)
                unlink(pathfull, (err)=>{
                    if(err){
                        rej(false)
                    }else{
                        res(true)
                    }
                })
            })
        }
    } 

    export class CloudinaryStorage{
        cloudinary;
        
        constructor(configs:any){
            this.cloudinary=cl
            this.cloudinary.config(configs)
        }
        async save(uploadDir:string, data:any){
            const uploadTocloudinary=()=>{
                return new Promise((res, rej)=>{
                    const stream=this.cloudinary.uploader.upload_stream(
                        {
                            public_id: v4(), 
                            folder:uploadDir
                        }, 
                        function(error, result) { 
                            if(error){
                                rej(error)
                            }else{
                                res(result as any)
                            }
                         }
                    )
                    streamifier.createReadStream(data).pipe(stream)
                })
            }
            try{
                return await uploadTocloudinary()
            }catch(e){
                console.log(e)
                return false
            }
        }
        async rm(...resourceIds:Array<string>){
            await this.cloudinary.api.delete_resources(resourceIds)
        }
    }

    export class FirebaseStorage{
        private app:any
        private storage:any
        public baseDir:string="/adignonsite/portfolio/uploads/"

        constructor(config:any){
            this.app=initializeApp(config)
            this.storage=getStorage(this.app)
        }

        async save(file:Express.Multer.File, pathFromBase:string=""){
            const checkIfFileExistFirebaseByUrl=async(imageRef:any)=>{
                try{
                    return await getDownloadURL(imageRef)
                }catch(e){
                    return false
                }
            }

            const path=this.baseDir+file.originalname
            const imageRef = ref(this.storage, path)
            if(this.app){
                try{
                    let fileUrl;
                    if(fileUrl=await checkIfFileExistFirebaseByUrl(imageRef)){
                        console.log('Fichier '+path+' retrouver dans firebase.')
                        return{
                            url:fileUrl,
                            path,
                            ...(await getMetadata(imageRef))
                        }
                    }else{
                        const fileData=await uploadBytes(imageRef, file.buffer)
                        return{
                            url:await getDownloadURL(imageRef),
                            path,
                            ...(fileData.metadata)
                        }
                    }
                    
                }catch(e){
                    console.log(e)
                    console.error('Upload image to firebase failed')
                }
            }else{
                console.error('Firebase not initialized')
            }
        }

        async rm(path:string){
            try {
                await deleteObject(ref(this.storage, path))
                return true
            }catch(e){
                console.error(e)
                return false
            }
        }
    }

}