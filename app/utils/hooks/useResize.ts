import React, { useState } from "react"

type TBreakpoints="xs"|"sm"|"md"|"lg"|"xl"|"xxl"
let listenerTarget:any
const subscribeToResize=(callback:any)=>{
    //@ts-ignore
    listenerTarget=()=>{
        //@ts-ignore
        callback(window)
    }
    window.addEventListener("resize", listenerTarget)
}

const unSubscribeToResize=()=>{
    //@ts-ignore
    window.removeEventListener("resize", listenerTarget)
}
export const  sizes:any={
    xs:0,
    sm:640,
    md:768,
    lg:1024,
    xl:1280,
    xxl:1536
}


const checkSize=(width:number, s?:TBreakpoints)=>{
   
    if(width < sizes.sm ){
        return "xs"
        //Xs matched
        
    }else{
        if(width < sizes.md ){
            //sm matched
            return "sm"
        }else{
            
            if(width < sizes.lg  ){
                return "md"
            }else{
                if(width < sizes.xl ){
                    return "lg"
                }else{
                    if(width < sizes.xxl ){
                        //xl matched
                        return "xl"
                    }else{
                        //xxl matched

                        return "xxl"
                    } 
                }
            }
        }
    }
    return false
}

const getFinalResult=(currentSize:TBreakpoints|false, targetedSize?:TBreakpoints, direction?:"up"|"down")=>{
    if(targetedSize && currentSize){
        if(direction && direction==="up"){
            const currentIndex=Object.keys(sizes).indexOf(targetedSize)
            if(currentIndex>=0){
                return Object.keys(sizes).slice(currentIndex).includes(currentSize)
            }else{
                return false;
            }
        }else if(direction && direction==="down"){
            const currentIndex=Object.keys(sizes).indexOf(targetedSize)
            if(currentIndex>=0){
                return Object.keys(sizes).slice(0, currentIndex+1).includes(currentSize)
            }else{
                return false;
            }
        }else{
            return currentSize===targetedSize
        }
    }
    return typeof currentSize === "string" ? currentSize :undefined
}

export function useResize(s?:TBreakpoints, direction?:"up"|"down"){
    
    const [size, setsize]=useState<undefined|boolean|string>(undefined)
    React.useEffect(()=>{
        //@ts-ignore
        if(typeof window!==undefined){
            if(size===undefined){
                setsize(getFinalResult(checkSize(window.innerWidth, s), s, direction))
            }
            subscribeToResize((window:any)=>{
                setsize(getFinalResult(checkSize(window.innerWidth, s), s, direction))
            })
            return unSubscribeToResize;
        }
        
    }, [s, direction])
    return (size)
}

export function useGetResize(s:TBreakpoints){
    return true
}