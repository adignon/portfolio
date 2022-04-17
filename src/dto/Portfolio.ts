import Joi from "joi";

export const PortfolioDto=(ctx:"c"|"u"="c")=>Joi.object({
    ...(ctx==="c"?{
        slogan:Joi.string().required(),
        subslogan:Joi.string().required(),
        description:Joi.string().required()
    }:{}),
    ...(ctx==="u"?{
        slogan:Joi.string().required(),
        subslogan:Joi.string().required(),
        description:Joi.string().required(),
        media:Joi.object({
            
        }).unknown()
    }:{})
})