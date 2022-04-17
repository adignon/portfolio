import React from "react"

export class Store implements Storage{
    private store:any={}
    private listeners:Array<{on:string, fun:Function, key?:string}>=[]
    length:number=(()=>Object.keys(this.store).length)()

    setItem=(key:string, value:any, callListener:boolean=true)=>{
        this.store[key]=value
        if (callListener) this.callListenersOn("set", key, this.store[key])

    }
    getItem=(key:string)=>{
        this.callListenersOn("get",  key, this.store[key])
        return this.store[key];
    }
    clear(){
        this.store={};
    }
    getStore=()=>{
        return this.store
    }
    removeItem=(key:string)=>{
        let newStore:any={}
        for(let i in this.store){
            if(i!==key){
                newStore[key]=this.store[key]
            }
        }
        this.store=newStore
    }
    addListenerOn=(on:"set"|"get", fun:(data:any)=>void, key:string):void=>{
        this.listeners.push({on,fun, key});
    }
    clearListener=(fun:Function)=>{
        this.listeners=this.listeners.filter((func:any)=>func.toString()!=fun.toString() || func!==fun)
    }
    key=(index:number):any=>{
        return (index+1) >= Object.keys(this.store).length ? Object.keys(this.store)[index] :null
    }
    private callListenersOn=(on:"set"|"get",key:string,  contextData?:any ):void=>{
        const listeners=this.listeners.filter((l)=>{
            return l.on===on && key===l.key
        })
        for(let i=0; i<listeners.length; i++){
            listeners[i]?.fun(contextData)
        }
       
    }
}

export const useStore=(key:string, store:Store, selector:(currentStore:any, prevStore?:any)=>any)=>{
    if(store){
        const handler=(storeD:any)=>{
            setStoreData((prev:any)=>{
                const d=selector(storeD, prev)
                return JSON.stringify(prev)!==JSON.stringify(d) ? d : prev
            })
            
        }
        const [storeData, setStoreData]=React.useState(selector(store.getItem(key) ?? {}, {}))
        React.useEffect(()=>{
            
            store.addListenerOn("set", handler, key)
            return ()=>store.clearListener(handler)
        }, [store])
        return storeData;
    }
    return undefined
}