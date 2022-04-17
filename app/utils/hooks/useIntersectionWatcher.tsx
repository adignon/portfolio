import  React from "react";
export const useIntersectionWatcher=()=>{
    const ref:any=React.useRef()
    const [state, setState]=React.useState<{
        isIntersecting:boolean,
        intersectionRects:null|DOMRectReadOnly
    }>({
        isIntersecting:false,
        intersectionRects:null
    })
    React.useEffect(()=>{
        if(ref.current){
            const observer=new IntersectionObserver((entries)=>{
                console.log(entries[0].isIntersecting, state.isIntersecting)
                if(entries[0].isIntersecting!==state.isIntersecting){
                    setState({
                        isIntersecting:entries[0].isIntersecting,
                        intersectionRects:entries[0].intersectionRect
                    })
                }
                
            })
            observer.observe(ref.current)
            return ()=>observer.disconnect()
        }
    }, [ref.current])
    return {...state, ref}
}

export const useFirstIntersectionWatcher=()=>{
    const watcher=useIntersectionWatcher()
    const [state, setState]=React.useState(watcher)
    React.useEffect(()=>{
        if(!state.isIntersecting){
            console.log("here")
            setState(watcher)
        }
    }, [watcher])
    return state
}