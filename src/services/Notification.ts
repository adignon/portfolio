import { Prisma } from "@prisma/client"
import { v4 } from "uuid"
import {prisma} from "../database"
export class Notification{
    async createNotification(data:{content:string}){
        try{
            return await prisma.notification.create({
                data:{
                    id:v4(),
                    content:data.content,
                    createdAt:new Date()
                }
            })
        }catch(e){
            return false
        }
    }

    async getUnredNotifications(){
        try{
            return (await prisma.notification.findMany({
                where:{
                    read:false
                }
            })).map((n)=>({...n, createdAt:n.createdAt.getTime()}))
            
        }catch(e){
            console.log(e)
            throw {message:"Une erreur est survenue durant la création."}
        }   
    }

    async editNotification(data:Prisma.NotificationUpdateInput & {id:string}){
        try{
            return (await prisma.notification.update({
                data,
                where:{
                    id:data.id
                }
            }))
            
        }catch(e){
           throw {message:"Une erreur est survenue durant la mise à jour."}
        }   
    }


    async deleteNotification (id:string){
        try{
            await prisma.notification.delete({
                where:{
                    id
                }
            })
            return true
        }catch(e){
            throw {message:"Une erreur est survenue durant la mise à jour."}
            return false;
        }
    }
}