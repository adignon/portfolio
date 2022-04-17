import Joi from "joi";
//description, imageFiles, fromDate, option, title, toDate, gitUrl, appUrl?, attachedFiles?
export const ProjectDto=(ctx:"create"|"update"="create")=>Joi.object({
    appUrl:Joi.string(),
    attachedFiles:Joi.array().items(Joi.object({
        id:Joi.string().required()
    }).unknown()),
    ...(ctx==="create"?{
        title:Joi.string().required(),
        description:Joi.string().required(),
        fromDate:Joi.string().required(),
        toDate:Joi.string().required(),
        option:Joi.valid("drafted", "published").required(),
        gitUrl:Joi.string().required(),
        imageFiles:Joi.array().items(Joi.object({
            id:Joi.string().required()
        }).unknown()).required()
    }:{
        id:Joi.string().required(),
        title:Joi.string(),
        description:Joi.string(),
        fromDate:Joi.string(),
        toDate:Joi.string(),
        option:Joi.valid("drafted", "published"),
        gitUrl:Joi.string(),
        imageFiles:Joi.array().items(Joi.object({
            id:Joi.string().required()
        }).unknown())
    })
})
