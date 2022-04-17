import React, {HTMLAttributes, ReactNode, useRef} from "react"
import Scrollbar from "smooth-scrollbar"

export interface IScrollContainer  extends HTMLAttributes<HTMLDivElement>{
    children: ReactNode,
    options?:{
        alwaysShowTracks?:boolean, continuousScrolling?:boolean,damping?:number,delegateTo?: EventTarget | null | undefined,
        renderByPixels?: boolean | undefined, plugins?:any,thumbMinSize?:number,wheelEventTarget?: EventTarget | null | undefined
    }
}
export const ScrollContainer=({children, options, ...props}:IScrollContainer)=>{
    const ref:any=useRef()
    React.useEffect(()=>{
        if(Boolean(ref?.current)){
            const opt={...(options??{alwaysShowTracks:true}), }
            Scrollbar.init(ref?.current, opt)
        }
    }, [])
    return(
        <div ref={ref} {...props}>
            {children}
        </div>
    )
}