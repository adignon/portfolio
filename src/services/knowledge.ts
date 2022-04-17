import { prisma } from "../database";

export class KnowledgeService{
    async getAll(){
        return await prisma.knowloadge.findMany()
    }
}