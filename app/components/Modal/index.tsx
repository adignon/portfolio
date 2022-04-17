import React, { HTMLAttributes } from "react"
import { MdClose } from "react-icons/md"
import { clx, validateChildren } from "../../utils/comp"
import { IconButton, IIconButton } from "../Button"

export interface IModal extends HTMLAttributes<HTMLDivElement>{
    children:React.ReactNode
} 
export const Modal=({children, className, ...props}:IModal)=>{
    const childrens=React.Children.toArray(children).filter((c)=>validateChildren(c, ["ModalHeader", "ModalBody", "ModalFooter"]))
    return(
        <div {...props} className={clx("w-full md:max-w-lg lg:max-w-xl sm:max-w-xs bg-white rounded-md max-h-screen",className)}>
            {childrens}
        </div>

    )
}

export interface IModalHeader extends HTMLAttributes<HTMLDivElement>{
    children:React.ReactNode,
    onClose?:Function,
    childrenContainerProps?:HTMLAttributes<HTMLDivElement>
    btnContainerProps?:HTMLAttributes<HTMLDivElement>
    btnProps?:IIconButton
} 
export const ModalHeader=({onClose,children, className,btnContainerProps, childrenContainerProps,btnProps, ...props}:IModalHeader)=>{
    const {className:btnContainerClass, ...btnContainer}=btnContainerProps??{}
    const {className:childrenContainerClass, ...childrenContainer}=childrenContainerProps??{}
    const {className:BtnClass, ...btn}=btnProps ??{}
    return(
        <div className={clx("flex p-4 border-b text-xl font-medium items-center", className)} {...props}>
            <div className={clx("w-full", childrenContainerClass)} {...childrenContainer}>
                {children}
            </div>
            {
                onClose instanceof Function ?
                <div className={clx("px-2", btnContainerClass)} {...btnContainer}>
                    <IconButton onClick={onClose as any} className={clx("bg-gray-200 !p-2", BtnClass)} {...btn}><MdClose/></IconButton>
                </div>:<></>
            }
        </div>
    )
}

export interface IModalBody extends HTMLAttributes<HTMLDivElement>{
    children:React.ReactNode,
} 
export const ModalBody=({children, className, ...props}:IModalBody)=>{
    return(
        <div className={clx("p-4 py-8", className)} {...props}>
            {children}
        </div>
    )
}
export interface IModalFooter extends HTMLAttributes<HTMLDivElement>{
    children:React.ReactNode
} 
export const ModalFooter=({children, className, ...props}:IModalFooter)=>{
    return(
        <div className={clx("p-4 border-t", className)} {...props}>
            {children}
        </div>
    )
}