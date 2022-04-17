import { HTMLAttributes } from "react"
import { clx } from "../../utils/comp"

export interface ILogo extends HTMLAttributes<HTMLParagraphElement>{
    logoContainer?:HTMLAttributes<HTMLDivElement>
}
export const Logo=({logoContainer, className, ...props}:ILogo)=>{
    return(
        <div {...logoContainer}>
            <p className={clx("font-pacifico-regular text-3xl   text-primary", className)} {...props}>Adignon</p>
        </div>
    )
}