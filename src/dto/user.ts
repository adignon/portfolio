import Joi from "joi";

export const userDto=(ctx:"create"|"update"|"login"="create")=>(Joi.object({
    email:["create", "login"].includes(ctx)  ? Joi.string().email({tlds:false}).required() : Joi.string(),
    password:["create", "login"].includes(ctx)  ? Joi.string().required() : Joi.string(),
    ...(ctx==="update" ?{
        id:Joi.string().required() 
    }:{})
}))
