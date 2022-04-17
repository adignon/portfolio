import React, { HTMLAttributes, useMemo, useRef } from "react"
import { clx, validateChildren } from "../../utils/comp"
import { Button, ButtonBase, IButtonBase } from "../Button"

export interface ITab extends HTMLAttributes<HTMLDivElement>{
    defaultIndex?:number
    children:React.ReactNode,
}


export const Tab=({defaultIndex=0, children, className, ...props}:ITab)=>{
    const [index, setIndex]=React.useState(0)
    const childrens=React.Children.toArray(children).filter((c)=>validateChildren(c, ['TabHead', "TabBody"]))
    return(
        <div className={clx("", className)} { ...props}>{childrens.map((c:any)=>React.cloneElement(c, (c.type.name==="TabHead" ?{currentIndex:index, setCurrentIndex:setIndex}:{currentIndex:index}) as any))}</div>
    )
}

const getStyle=(children:any, widths:Array<any>)=>{
    let lastWidth=0;
    return widths.map((dim:any, i:number)=>{
        const translateX=lastWidth + dim.ml
        lastWidth=lastWidth + dim.w;
        return({
            width:dim.w,
            translateX:translateX
        })
    })
}
interface IActiveFlag extends HTMLAttributes<HTMLDivElement>{
    setStyle:(style:{width:number, translateX:number})=>object
}
interface ITabHead extends HTMLAttributes<HTMLDivElement>{
    children:React.ReactNode
    currentIndex?:number
    setCurrentIndex?:Function
    activeFlag?:IActiveFlag
}
export const TabHead=({children, currentIndex=0,setCurrentIndex, activeFlag, className, ...props}:ITabHead)=>{
    const [dim, setDim]=React.useState({} as any)
    const {className:activeFlagClass,setStyle, ...active}=activeFlag??{}
    const childrens=React.Children.toArray(children).filter((c)=>validateChildren(c, ['TabHeader']))
    const childrenArr=useMemo(()=>{
        return React.Children.toArray(childrens)
    }, [childrens])
    let style:any=useMemo(()=>{

        if(Object.keys(dim).length === childrenArr.length){
            return getStyle(childrens, Object.values(dim))
        }
        return null
    }, [dim])
    const s=style ?{
        width:style[currentIndex].width+"px",
        transform:`translateX(${style[currentIndex].translateX}px)`
    }:{}
    
    return(
        <div className={clx(" flex relative  ", className)} {...props}>
            
            {
                React.Children.map(childrens, (c:any, i)=>{
                    
                    const tab=React.cloneElement(c, {setRef:(ref:any)=>setDim((prev:any)=>{
                        const w=Number(getComputedStyle(ref.current).width.replace("px", ""))//+Number(getComputedStyle(ref.current).paddingLeft.replace("px", ""))+Number(getComputedStyle(ref.current).paddingRight.replace("px", ""))
                        const ml=Number(getComputedStyle(ref.current).marginLeft.replace("px", ""))
                        return {...prev, [i]:{
                            w:w,
                            ml
                        }}
                    }), onClick:()=>setCurrentIndex instanceof Function ?setCurrentIndex(i):true, className:clx("z-2",i>0? "ml-1":"",c.props.className)})
                    return(
                        <>
                        {tab}
                        </>
                    )
                })
            }
            {
               style instanceof Array ?
               <div className={clx("absolute z-1 h-0.5 rounded-full bottom-0 bg-primary", activeFlagClass)} style={{
                    transition:"transform 100ms 100ms, width 200ms 100ms",
                    ...s,
                    ...(setStyle instanceof Function ?setStyle(style[currentIndex]):{})
                }} {...active}></div>
                :<></>
            }
           
        </div>
    )
}

interface ITabHeader extends IButtonBase{
    children:React.ReactNode,
    setRef?:any
}

export const TabHeader=({children, setRef, className, ...props}:ITabHeader)=>{
    const ref=useRef()
    React.useEffect(()=>{
        if(ref?.current){
            setRef(ref)
        }
    }, [ref])
    return(
        <ButtonBase ref={ref as any} className={clx("p-2 px-4 ", className)} {...props}>
            {children}
        </ButtonBase>
    )
}

interface ITabBody extends HTMLAttributes<HTMLDivElement>{
    children:React.ReactNode,
    currentIndex?:number
}
export const TabBody=({currentIndex, children, className, ...props}:ITabBody)=>{
    const childrenArr=React.Children.toArray(children)
    const childrens=React.Children.toArray(children).filter((c)=>validateChildren(c, ['TabPanel']))
    return(
        typeof currentIndex==="number"?
        <div className={clx("", className)} {...props}>
            {React.cloneElement(childrenArr[currentIndex] as any)}
        </div>
        :<></>
    )
}

interface ITabPanel extends HTMLAttributes<HTMLDivElement>{
    children:React.ReactNode
}
export const TabPanel=({children, className, ...props}:ITabPanel)=>{
    return(
        <div className={clx("", className)} {...props}>
            {children}
        </div>
    )
}