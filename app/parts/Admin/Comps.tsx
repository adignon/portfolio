import { HTMLAttributes } from "react"
import { clx } from "../../utils/comp"
export interface IPageTitle extends HTMLAttributes<HTMLParagraphElement>{
    children:React.ReactNode
}
export const PageTitle=({className, children, ...props}:IPageTitle)=>{
    return(
        <p className={clx("font-medium text-2xl text-gray-600", className)} {...props}>{children}</p>
    )
}