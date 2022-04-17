import { readFileSync } from "fs";
import { resolve } from "path";
import { prisma } from "../database";
import { v4 } from "uuid"
import { GeneralMetaKey } from "@prisma/client";

export class ConfigService{
    async addDefaults(){
        const data:any=this.parseConfigs()
        for(let k in data){
            const prevMeta=await prisma.generalMeta.findFirst({
                where:{
                    key:{
                        equals:k as any
                    }
                }
            })
            if(Boolean(prevMeta) && prevMeta){
                await prisma.generalMeta.update({
                    where:{
                        id:prevMeta.id
                    },
                    data:{
                        id:prevMeta.id,
                        key:prevMeta.key,
                        value:data[k] || prevMeta.value
                    }
                })
            }else{
                await prisma.generalMeta.create({
                    data:{
                        id:v4(),
                        key:k as any,
                        value:data[k]
                    }
                })
            }
        }
    }
    async getConfig(key:GeneralMetaKey){
        const result=await prisma.generalMeta.findFirst({
            where:{
                key:{
                    equals:key
                }
            },
            include:{
                media:true
            }
        })
        if(result){
            return result.value || result.media
        } else{
            const configs :any=this.parseConfigs()
            return configs[key]
        }
    }
    private parseConfigs(filename:string="admin.config.json"):object{
        const data=readFileSync(resolve(process.env.CONFIG_DIR as any, filename)).toString()
        return JSON.parse(data)
    }
}