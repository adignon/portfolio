import { prisma } from "../database";
import { ConfigService } from "./Config";

export class PortfolioService{
    async getPortfolioData(){
        const config=new ConfigService()
        return {
            data:{
                slogan: await config.getConfig("PORTFOLIO_SLOGAN"),
                subslogan: await config.getConfig("PORTFOLIO_SUBSLOGAN"),
                description: await config.getConfig("PORTFOLIO_DESCRIPTION"),
                adminEmail: await config.getConfig("ROOT_USER_EMAIL"),
                media: await config.getConfig("PORTFOLIO_USER_IMAGE")
            }
        }
    }

    async getSettings(){
        const configService=new ConfigService()
        return{
            rootEmail:await configService.getConfig("ROOT_USER_EMAIL"),
            confidentiality:await configService.getConfig("SETTINGS_PRIVACY")
        }
    }
}