import React, { HTMLAttributes } from "react"
import { createPortal } from "react-dom"
import { Transition } from "react-transition-group"
import { TransitionProps } from "react-transition-group/Transition"
import {clx, rst} from "../../utils/comp"
import style from "./style.module.css"

export  interface IBackdrop extends HTMLAttributes<HTMLDivElement>{
    children:React.ReactNode|((transitionDuration:number)=>React.ReactNode),
    open:boolean,
    transitionProps?:TransitionProps
}
const duration=100
export const Backdrop=({children, className,open=true,transitionProps, ...props}:IBackdrop)=>{
    const [ref, setRef]=React.useState(null as any)
    React.useEffect(()=>{
        setRef(document.querySelector('body'));
    }, [])
    return(
        ref ? createPortal(
            <Transition timeout={duration}  in={open} {...transitionProps}>
                {
                    state=>{
                        
                        return( children instanceof Function? children(duration) :
                            <div className={clx(
                                style.backdrop, 
                                rst({
                                    entering:style.enter,
                                    entered:style.enterActive,
                                    exiting:style.exit,
                                    exited:style.exitActive
                                }, state)
                            )}>
                                {children}
                            </div>
                        )
                    }
                }
            </Transition>
            ,
            ref
        ):<></>
    )
}