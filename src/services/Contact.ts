import sgMail from "@sendgrid/mail"
import {ConfigService} from "./Config"
import S from "string"
import { prisma } from "../database"
import { v4 } from "uuid"
import { ValidatorService } from "./Validator"
import { MailFlag } from "@prisma/client"
import { ContactDto } from "../dto/Contact"

export class ContactService{
    async sendEmail(to:string,from:string, subject:string, content:string){
        
        
        sgMail.setApiKey(process.env.SENDGRID_API_KEY as any)
        const msg = {
            to, 
            from,
            subject: subject,
            text: S(content).stripTags().s,
            html: content,
        }

        sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
    }

    
    async createContactMessage(data:any){
        const validator=new ValidatorService()

        if(validator.joiValidate(ContactDto(), data)){
            try{
                const configService=new ConfigService()
                const adminEmail=(await configService.getConfig("ROOT_USER_EMAIL"))
                
                //save contact message
                /*
                
                */
                const message=await prisma.contactMessage.create({
                    data:{
                        id:v4(),
                        message:data.content,
                        title:data.title,
                        senderEmail:data.email,
                        senderFullname:data.fullName,
                        badge:"PENDING_REVIEW"
                    }
                })
                //send email notification to admin
                const adminNotification=await prisma.notification.create({
                    data:{
                        id:v4(),
                        content:`
                            ${message.senderFullname} vous a envoyé un nouveau méssage.
                        `,
                        createdAt:new Date(),
                        
                    }
                })
                //send an auto response message to the sender
                //await this.sendEmail(adminEmail,  )
                //save a notification
                return message
            }catch(e){
                console.log(e)
                throw {message:"Une erreur est survenue lors de l'enrégistrement des données de contact."}
            }
           
        }else{
             throw {message:"Données invalides"}
        }
    }

    async editContactMessage(data:any){
        const validator=new ValidatorService()

        if(validator.joiValidate(ContactDto("update"), data)){
            try {
                return await prisma.contactMessage.update({
                    where:{
                        id:data.id
                    },
                    data:data
                })
            }catch(e){
                throw {message:"Une erreur est survenue lors de la mise à jour des données de contact."}
            }
        }else{
            throw {message:"Données invalides"}
        }
    }

    async deleteContactMessage(data:any){
        const deleteRecord=async (data:any)=>{
            const validator=new ValidatorService()
        
            if(validator.joiValidate(ContactDto("update"), data)){
                try {
                    await prisma.contactMessage.delete({
                        where:{
                            id:data.id
                        }
                    })
                    return true
                }catch(e){
                    throw {message:"Une erreur est survenue lors de la suppression des données de contact."}
                }
            }else{
                throw {message:"Données invalides"}
            }
        }
        if(data instanceof Array){
            return(await Promise.all(data.map(async (d)=>await deleteRecord(d))))
        }else{
            return await deleteRecord(data)
        }
    }

    async getAllContactMessages(where?:any){
        try {
            return await prisma.contactMessage.findMany({
                orderBy:{
                    createdAt:"desc"
                },
                where
            })
        }catch(e){
            throw {message:"Une erreur est survenue lors de la suppression des données de contact."}
        } 
    }
    async getContactMessage(id:string){
        try {
            return await prisma.contactMessage.update({
                data:{
                    read:true
                },
                where:{
                    id
                },
                
            })
        }catch(e){
            throw {message:"Une erreur est survenue lors de la suppression des données de contact."}
        } 
    }
}