import { userDto } from "../dto/user";
import { ValidatorService } from "./Validator";
//@ts-ignore
import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import { prisma } from "../database";
import { Account, Prisma } from "@prisma/client";

export class AuthService{
    constructor(private validator=new ValidatorService()){}

    async newUser(data:any){
        if(this.validator.joiValidate(userDto(), data)){
            try{
                const {hashPassword, ...user}=await prisma.account.create({
                    data:{
                        email:data.email,
                        hashPassword:this.hashPassword(data.password)
                    }
                }) || {};

                return {
                    message:"Compte créé avec succès.",
                    data:user
                };
            }catch(e){
                throw {message:"Une erreur est suvenue."}
            }
        }else{
            throw {message:"Données invalides."}
        }
    }

    async login(data:any){
        if(this.validator.joiValidate(userDto("login"), data)){
            try{
                const {hashPassword,...user}=await prisma.account.findFirst({where:{email:{equals:data.email}}}) || {}
                if(user){
                    if(compareSync(data.password, hashPassword??'')){
                        return  {
                            message:"Connexion établie.",
                            data:{
                                ...user
                            }
                        }
                    }else{
                        throw {message:"Mot de passe invalide."}
                    }
                } else{
                    throw {message:"Compte non disponible"}
                }
            }catch(e){
                throw {message:"Une erreur est suvenue."}
            }
        }else{
            throw {message:"Données invalides"}
        }
    }

    async editUserPassword(userId:string, newPassword:string){
        return await this.editUserAccount(userId, {hashPassword:this.hashPassword(newPassword)})
    }
    
    async editUserAccount(userId:string, data:Prisma.AccountUpdateInput){
        return await prisma.account.update({
            data,
            where:{
                id:userId
            }
        })
    }

    private hashPassword(password:string){
        const saltRount=10;
        const salt=genSaltSync(saltRount)
        return hashSync(password, salt);
    }
}

export const authService=new AuthService()