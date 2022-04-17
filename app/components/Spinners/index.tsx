import React, { HTMLAttributes, useRef } from "react"
import { clx } from "../../utils/comp"
import style from "./style.module.css"
export interface IDotSpinner extends HTMLAttributes<HTMLDivElement>{

}
export const DotSpinner=({className, ...props}:IDotSpinner)=>{
    const ref:any=useRef()
    const [d, setD]=React.useState(null)
    React.useEffect(()=>{
        if(ref?.current){
            setD(ref?.current.getBoundingClientRect().height)
        }
    }, [ref?.current])
    return(
        <div ref={ref}  className={clx(style.dot,  className)}>
            <div className="" style={d ?{height:d, width:d, flexShrink:0} :{}}></div>
            <div className="" style={d ?{height:d, width:d, flexShrink:0} :{}}></div>
            <div className="" style={d ?{height:d, width:d, flexShrink:0} :{}}></div>
        </div>
    )
}