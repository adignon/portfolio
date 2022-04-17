import React from "react"
import { MdClose } from "react-icons/md"
import { clx } from "../../utils/comp"
import { IconButton } from "../Button"

export interface IAlert{
    children:React.ReactNode,
    theme?:"success"|"danger"|"primary",
    open?:boolean
    onClose?:Function
}
export const Alert=({children,open=true,onClose, theme="primary"}:IAlert)=>{
    const classes={
        container:{
            className:{
                general:"text-sm flex p-4 px-4 rounded relative flex items-center",
                success:clx("bg-green-100 text-green-600"),
                danger:clx("bg-red-100 text-red-600"),
                primary:clx("bg-primary-100 text-primary-600")
            }
        }
    }
    return(
        open ?
        <div 
            className={clx(
                
                classes.container.className.general,
                classes.container.className[theme]
            )}
        >
            <div className="w-full ">{children}</div>
            {
                onClose instanceof Function ?
                <div className="">
                    <IconButton onClick={()=>onClose()} size="md" className=""><MdClose/></IconButton>
                </div>:<></>
            }
        </div>
        :<></>
    )
}