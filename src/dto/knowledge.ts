import Joi from "joi";

export const KnowledgeDto=(ctx:"create"|"update"="create")=>Joi.object({
    ...(ctx==="create" ?{
        type:Joi.valid('LIBRARY','FRAMEWORK').required(),
        progress:Joi.number().required(),
        title:Joi.string().required()
    }:{}),
    ...(ctx==="update" ?{
        id:Joi.string().required(),
        type:Joi.valid('LIBRARY','FRAMEWORK'),
        progress:Joi.number(),
        title:Joi.string()
    }:{}),
    
})