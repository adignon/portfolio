import { HTMLAttributes } from "react"
import { clx } from "../../../utils/comp"

export interface IInputLabel extends HTMLAttributes<HTMLLabelElement>{
    children:string
}

export const InputLabel=({children,className="", ...props}:IInputLabel)=>{
    const classes={
        standard:{
            className:""
        }
    }
    return(
        <label className={clx(className)} {...props}>{children}</label>
    )
}