import { css,  } from "@emotion/css"
import React, { HTMLAttributes } from "react"
import { clx, getChildrenProps, renderOrBlankIf, validateChildren } from "../../utils/comp"
import { sizes } from "../../utils/hooks/useResize"
import style from "./style.module.css"


const getBreakValues=(v:any)=>typeof v ==="number" ? v : v?.size

const breakStyles={
    xs:``,
    sm:``,
    ms:``,
    lg:``,
    xl:``,
    xxl:``
}

const styleFor=(children:any,restSpace:any, viewport:"xs"|"sm"|"md"|"lg"|"xl"|"xxl", important=false)=>{
    return React.Children.toArray(children).map((c:any, i)=>{

        return (typeof getBreakValues(c.props[viewport]) === "number" ? `
            .grid-${i}{
                width:${getBreakValues(c.props[viewport])===12 ? `calc((100% / 12) * ${restSpace})`:`calc((100% / 12) * ${getBreakValues(c.props[viewport])})`} ${important ? "!important":""}; 
                ${Boolean(c.props[viewport]?.css) ?c.props[viewport]?.css:``}
            }
        `:"")
    })
}
interface IGridContainer extends HTMLAttributes<HTMLDivElement>{
    children:React.ReactNode,
}
export const GridContainer=({children, className}:IGridContainer)=>{
    
    const childrenProps=getChildrenProps(children)
    let size=0
    childrenProps.filter((c:any)=>getBreakValues(c.size)>0&&getBreakValues(c.size)<12 ? true : false).forEach((c:any)=>{
        size+=getBreakValues(c.size)
    })
    const restSpace=12-size
    return (
        <div className={clx("flex flex-wrap", className)}>
            <style jsx>
                {`
                    
                    @media screen and (min-width:${sizes.sm}px){
                        ${
                            //sm
                            styleFor(children,  restSpace, "sm").join('\n')
                        }
                    }
                    @media screen and (min-width:${sizes.md}px){
                        ${
                            //md
                            styleFor(children,  restSpace, "md").join('\n')
                        }
                    }
                    @media screen and (min-width:${sizes.lg}px){
                        ${
                            //lg
                            styleFor(children,  restSpace, "lg").join('\n')
                        }
                    }
                    @media screen and (min-width:${sizes.xl}px){
                        ${
                            //xl
                            styleFor(children,  restSpace, "xl").join('\n')
                        }
                    }
                   
                    
                `}
            </style>
            {
                React.Children.map(children, (c:any, i)=>{
                    return(
                        <div className={clx(" grid-"+i, c.props.className  ?? "", style.gridChild)} key={i}>
                            {c}
                        </div>
                    )
                })
            }
        </div>
    )
    
}
export interface IStyledGrid{

}
type IGriSize=0|1|2|3|4|5|6|7|8|9|10|11|12
export interface IGrid{
    xs?:IGriSize|{size:IGriSize, css?:string}
    sm?:IGriSize|{size:IGriSize, css?:string},
    md?:IGriSize|{size:IGriSize, css?:string},
    lg?:IGriSize|{size:IGriSize, css?:string}
    xl?:IGriSize|{size:IGriSize, css?:string}
    children:React.ReactNode,
    className?:string
}

export const Grid=({ children}:IGrid)=>{
    return(
        <>
            {children}
        </>
    )
}