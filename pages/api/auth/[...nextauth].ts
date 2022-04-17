import { Account } from "@prisma/client";
import { STATUS_CODES } from "http";
import { NextApiHandler, NextApiRequest as NR , NextApiResponse } from "next";
import NextAuth from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"
import { getSession, signOut,  } from "next-auth/react";
import { prisma } from "../../../src/database";
import { AuthService } from "../../../src/services/Auth";

declare interface NextApiRequest extends NR{
    user?:Account
}

export default NextAuth({
    session:{
        strategy:"jwt",
        updateAge:3600,
        maxAge:86400
    },
    secret:process.env.JWT_SECRET,
    callbacks:{
        async jwt({account, user,token}) {
            if (account && user) {
                return {
                    ...token,
                    userData:user,
                    accountData:account
                };
            }
    
            return token;
        },
        async session({session, token}:any){
            session.user.userData=token.userData
            return session
        }

    },
    providers:[
        CredentialsProvider({
            name:"credentials",
            async authorize(_:any, req:any){
                try{
                    const authService=new AuthService()
                    const {email, password}=req.body

                    const {data:user}=await authService.login({email, password})
                    return user
                }catch(e:any){
                    return null
                }
                
            }
        } as any),

    ],
})

export const checkAuth=async (req:NextApiRequest)=>{
    const session=await getSession({req})
    if(session){
        try{
            const userId=(session.user as any).userData?.id
            if(userId){
                const user=await prisma.account.findUnique({
                    where:{
                        id:userId
                    }
                })
                if(user){
                return user
                    return true
                }
            }
        }catch(e){
            console.log(e)
            return false
        }
    }
    return false 
}

export const checkAuthUser=async (req:NextApiRequest, res:NextApiResponse, next:any) =>{
    try{

        const user=await checkAuth(req)
        if(typeof user==="object"){
            req.user=user;
            return next()
        }
        return res.status(403).json({
            message:"Action non autorisée. Vous avez été déconnecté."
        })
        
        
    }catch(e){
        console.log(e)
        return res.status(400).json({
            message:"Action non autorisée. Vous avez été déconnecté."
        })
    }
}

export const getUser=async (req:any)=>{
    try{
        const session=await getSession({req})
        if(session){
            const userId=(session.user as any).userData?.id
            if(userId){
                const user=await prisma.account.findUnique({
                    where:{
                        id:userId
                    }
                })
                if(user){
                    return user
                }
            }
        }
        return false
        
        
    }catch(e){
        console.log(e)
        return false
    }
}