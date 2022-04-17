import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { prisma } from "../../../src/database";

const projectRouter=nextConnect({
    onNoMatch(req:NextApiRequest, res:NextApiResponse) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
})

projectRouter.get("/:id",(req:NextApiRequest, res:NextApiResponse)=>{
    res.json("ok")
})

export default projectRouter 