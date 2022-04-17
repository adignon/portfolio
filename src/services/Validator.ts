import Joi from "joi"
export class ValidatorService{
    joiValidate(JoiSchema:Joi.Schema, obj:any){
        const {error}=JoiSchema.validate(obj)
        console.log(error)
        if(error && Boolean(error)){
            return false
        }else{
            return true;
        }
    }
}