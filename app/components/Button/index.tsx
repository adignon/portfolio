import React, { HTMLAttributes, HtmlHTMLAttributes } from "react"
import { MdHome } from "react-icons/md"
import { clx } from "../../utils/comp"
import { DotSpinner } from "../Spinners"
import style from "./style.module.css"

export interface IButtonBase extends HTMLAttributes<HTMLButtonElement>{
    children:React.ReactNode,
    disabled?:boolean
}

export const ButtonBase=React.forwardRef(({className, children,disabled,...props}:IButtonBase, ref)=>{
    const p={
        className:clx("shrink-0  relative max-w-max cursor-pointer flex justify-center","p-2 px-8",disabled ?style.disabled :"",  style.button, className),
        ...(disabled ? {disabled:true}: {}),
        ...props
    }
    return(
        <button ref={ref as any}  {...p} {...props}>{children}</button >
    )
})

export interface IButton extends IButtonBase{
    children:React.ReactNode,
    variant?:"contained",
    fullWidth?:boolean
}

export const Button=React.forwardRef(({children, className, fullWidth=false,  variant="contained", ...props}:IButton, ref)=>{
    const classes={
        button:{
            contained:{
                className:{
                    general:clx("bg-primary text-white rounded shadow", fullWidth?"min-w-full ":""),
                    main:""
                }
            }
        }
    }
    return(
        <ButtonBase ref={ref} className={clx('', 
            classes.button[variant].className.general,
            classes.button[variant].className.main,
            className
        )} {...props}>
            {children}
        </ButtonBase>
    )
})


export interface IIconButtonBase extends HtmlHTMLAttributes<HTMLButtonElement>{
    size?:"sm"|"md"|"lg",
    children:React.ReactNode
}

export const IconButtonBase=({size="md",children, className, ...props}:IIconButtonBase)=>{
    const classes={
        className:{
            size:{
                general:"p-3",
                sm:"text-md",
                md:"text-xl",
                lg:"text-2xl"
            }
        }
    }
    
    return(
        <button  
            className={clx(
                clx(classes.className.size.general,classes.className.size[size],style.button, className)
            )}
            {...props}
        >
            {children}
        </button>
    )
}

export interface IIconButton extends IIconButtonBase{
    variant?:"contained"|"standard",
    children:React.ReactNode
}

export const IconButton=({variant="standard", children,  ...props}:IIconButton)=>{
    const classes={
        className:{
            variant:{
                global:clx("transition relative rounded-full overflow-hidden"),
                contained:"bg-gray-100",
                standard:""
            }
        }
    }
    
    return(
        <div className={
            clx("max-w-min",classes.className.variant.global, classes.className.variant[variant])
        }>
            <IconButtonBase
                {...props}
            >
                {children}
            </IconButtonBase>
        </div>
    )
}

export interface ICTAButton extends IButton{
    loading?:boolean,
    spinnerProps?:HtmlHTMLAttributes<HTMLDivElement>
}

export const CTAButton=React.forwardRef(({loading=false, disabled, children,spinnerProps,className, ...props }:ICTAButton, ref)=>{
    const {className:spinnerClassName, ...spinner}=spinnerProps ??{}
    return(
        <Button ref={ref}  disabled={loading || disabled} {...props} className={clx(loading ? "pl-16":"",className, "")}>
            {loading && <DotSpinner className={"absolute top-1/2 -translate-y-1/2 left-4"+clx(spinnerClassName)} {...spinner} />}
            {children}
        </Button>
    )
})