import { HTMLAttributes } from "react"
import { Transition } from "react-transition-group"
import { clx } from "../../utils/comp"
import style from "./style.module.css"

export interface IDrawer extends HTMLAttributes<HTMLDivElement>{
    containerProps?:HTMLAttributes<HTMLDivElement>
    children:React.ReactNode
    open:boolean,
    onClose:Function,
    position?:"left"|"right"
}
export const Drawer=({containerProps, className,children,open,onClose,position="left", ...props}:IDrawer)=>{
    const {className:containerClassName, ...container}=containerProps ??{}
    return  (
        <Transition timeout={100} in={open}>
            {
                (state)=>(
                    <div className={clx(
                        "absolute flex h-screen w-screen z-10 inset-0 "+(position==="right" ? "flex-row-reverse":""),
                        style.container,
                        state==="entered" ? (position ==="left" ?style.openLeft:style.openRight)  : (position ==="left" ?style.closeLeft:style.closeRight)+" ",
                        state==="exited" ? " hidden":"",
                        containerClassName
                    )} {...container}>
                        <div className={clx("h-full bg-white shadow", className)} {...props}>
                            {children}
                            </div>
                            <div className="w-full h-full" onClick={onClose as any}></div>
                    </div>
                )
            }
        </Transition>
    )
}