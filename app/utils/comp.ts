import React from "react"
import { TransitionStatus } from "react-transition-group"

export const clx=(...classNames:Array<string|undefined>):string=>(
    classNames.filter(c=>Boolean(c)).join(' ')
)



export const getChildrenProps=(children:any)=>{
    let props:any=[]
    if(children instanceof Array){
        for(let i in children){
            props[i]=children[i].props
        }
    }else{
        props=[children?.props]
    }
    return props
}

export const renderOrBlankIf=(cond:any, data:any)=>{
    if(cond){
        return data;
    }else{
        return React.createElement("div")
    }
}

export const createStyle=(func:(x?:any)=>any)=>{
    return (props:any)=>{
        const [style, setStyle]=React.useState({} as {[x:string]:string})
        React.useEffect(()=>{
            const d=func(props)
            if(JSON.stringify(style)!==JSON.stringify(d)){
                setStyle(d)
            }
        }, [props])
        return style;
    }
}

export const validateChildren=(children:any, types:Array<string>)=>{
    if(children instanceof Array){
        for(let i in children){
            
            if(!types.includes(children[i].type.name) && !types.includes(children[i].type)){
                console.error("Invalid child passed. "+children[i].type.name+" is not a valid child for this component. You should only pass children of types "+types)
                return false
            }
        }
        return true
    }else{
        if(!types.includes(children.type.name) && !types.includes(children.type)){
            console.error("Invalid child passed. "+(children.type.name || children.type)+" is not a valid child for this component. You should only pass children of types "+types)
            return false  
        }
        return true
    }
    return false;
}

/**
 * rst for render transition state
 */
interface Irst{
    "entering" ?:string, "entered" ?:string, "exiting" ?:string, "exited" ?:string, "unmounted"?:string
}
export const rst=(props:Irst, currentState:TransitionStatus)=>{
    return props[currentState] ?? ""
}

function getTransitionDuration(el:any){
    var res = 0
    prefix('transition-duration', function(v:any, pfx:Function){
      let duration = getComputedStyle(el)[v] as any
      if(!duration) return
      duration = parseTime(duration) + parseTime(el.style[pfx('transition-delay')] || 0)
      function parseTime(s:any){ return parseFloat(s) * (s.indexOf('ms') >- 1 ? 1 : 1000) }
    })
    return res
    function prefix(str:string, cb:Function, prefixes=""){
        prefixes = ' ' + (prefixes || 'webkit moz ms o khtml')
        prefixes.split(' ').some(function(v){
        const prefix = v ? '-'+v : v
        cb(pfx(str), pfx)
        function pfx(s:any){ return camelCase(prefix+s) }
      })
      function camelCase(s:any){ return s.toLowerCase().replace(/-(.)/g, function(s:any, m:any){ return m.toUpperCase() }) }
    }
  }

  export const pp=(props:any)=>(props)