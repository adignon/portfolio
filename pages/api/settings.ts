import { GeneralMetaKey } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import nextConnect from "next-connect";
import { v4 } from "uuid";
import { prisma } from "../../src/database";
import {SettingDto} from "../../src/dto/Setting"
import { ValidatorService } from "../../src/services/Validator"
import {checkAuthUser} from "./auth/[...nextauth]"
import {AuthService} from "../../src/services/Auth"

const projectRouter=nextConnect({
    onNoMatch(req:NextApiRequest, res:NextApiResponse) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
})
const validator=new ValidatorService()

projectRouter.use(checkAuthUser).post(async (req:NextApiRequest, res:NextApiResponse)=>{
    const data=req.body
    if(validator.joiValidate(SettingDto, data)){
        try{
            const values:any={}
            if(data.rootEmail){ 
                const {value}=await saveSettings("ROOT_USER_EMAIL", data.rootEmail)
                values['rootEmail']=value
            }
            if(data.rootTel){
                //await saveSettings("", data.rootEmail)
            }
            if(data.confidentiality){
                const {value}=await saveSettings("SETTINGS_PRIVACY", data.confidentiality)
                values['confidentiality']=value
            }
            if(data.accountPassword){
                const accountService=new AuthService()
                const user=(req as any).user
                await accountService.editUserPassword(user.id, data.accountPassword)
                values['accountPassword']=data.accountPassword
            }
            if(data.accountEmail){
                const accountService=new AuthService()
                const user=(req as any).user
                const {email}=await accountService.editUserAccount(user.id, {email:data.accountEmail})
                values['accountEmail']=email
            }

            if(Object.keys(values).length){
                return res.status(200).json({
                    message:"Données mise à jour",
                    data:values
                })
            }else{
                return res.status(400).json({
                    message:"Aucune changement éffectuée"
                })
            }
        }catch(e){
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


const saveSettings=async (key:GeneralMetaKey, value:any)=>{
    const old=await prisma.generalMeta.findFirst({
        where:{
            key:{
                equals:key
            }
        }
    })
    if(old){
        return await prisma.generalMeta.update({
            where:{
                id:old.id
            },
            data:{
                key,
                value
            }
        })
    }else{
        return await prisma.generalMeta.create({
            data:{
                id:v4(),
                key,
                value

            }
        })
    }
}

export default projectRouter