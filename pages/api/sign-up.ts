import { NextApiRequest, NextApiResponse } from "next";
import { authService } from "../../src/services/Auth";
import connect from "next-connect"

const api=connect({
    onNoMatch(req:NextApiRequest, res:NextApiResponse) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
})

api.post(async (req:NextApiRequest, res:NextApiResponse)=>{

    try{
        const result=await authService.newUser(req.body);
        return res.status(200).json(result)
    }catch(e){
        return res.status(400).json({
            e
        })
    }
})

export default api;