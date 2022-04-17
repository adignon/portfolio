import Joi from "joi"
export const SettingDto=Joi.object({
    rootEmail:Joi.string().email({tlds:false}),
    rootTel:Joi.string(),
    confidentiality:Joi.string(),
    accountPassword:Joi.string(),
    accountEmail:Joi.string()
})

