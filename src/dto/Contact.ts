import Joi from "joi";

export const ContactDto=(ctx:"update"|"create"="create")=>Joi.object({
    ...(ctx==="update" ? {
        id:Joi.string().required(),
    }:{}),
    content:ctx ==="create" ?  Joi.string().required() :Joi.string(),
    email:ctx ==="create" ? Joi.string().email({tlds:false}).required() : Joi.string().email({tlds:false}),
    fullName:ctx ==="create" ?Joi.string().required():Joi.string(),
    title:ctx ==="create" ? Joi.string().required():Joi.string(),
    badge:Joi.string(),
}).unknown()