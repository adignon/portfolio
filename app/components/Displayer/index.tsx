import { HTMLAttributes } from "react"
import { clx } from "../../utils/comp"
import { useFirstIntersectionWatcher } from "../../utils/hooks/useIntersectionWatcher"
import style from "./style.module.css"

export interface IIntercectionDisplayer extends HTMLAttributes<HTMLDivElement>{
}

export const IntercectionDisplayer=({children,className,  ...props}:IIntercectionDisplayer)=>{
    const {ref, isIntersecting}=useFirstIntersectionWatcher()
    return(
        <div className={clx(isIntersecting ? style.displayer:"opacity-0", className)} ref={ref} {...props}>
            {children}
        </div>
    )
}