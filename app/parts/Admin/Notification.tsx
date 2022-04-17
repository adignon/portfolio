import { Notification } from "@prisma/client"
import axios from "axios"
import React from "react"
import { MdClose, MdDone } from "react-icons/md"
import {formatDistanceToNow} from "date-fns"
import Fr from "date-fns/locale/fr"

export const NotificationAction=({label, errorMessage, successMessage, loadingMessage, onActionClick, onActionFailed, onActionSuccess}:{onActionClick:Function, label:string|React.ReactNode, errorMessage?:string|React.ReactNode, waitingMessage?:string|React.ReactNode, successMessage?:string|React.ReactNode, loadingMessage?:string|React.ReactNode, onActionSuccess?:Function, onActionFailed?:Function})=>{
    const [state, setState]=React.useState<undefined|boolean|null|"close">(undefined)
    React.useEffect(()=>{
        if(typeof state==="boolean"){
            if(state){
                if(onActionSuccess instanceof Function) onActionSuccess()
            }else{
                if(onActionFailed instanceof Function) onActionFailed()
            }
            const timer=setTimeout(()=>{
                 setState("close")
            }, 2000)
            return()=>clearTimeout(timer)   
        }     
     }, [state])
    return(
        (state===undefined) || (state===null)   ?
        <div className="text-sm p-2 px-4 cursor-pointer" onClick={async ()=>{
            try{
                setState(null)
                await onActionClick()
                setState(true)
            }catch(e){
                console.log(e)
                setState(false)
            }
        }}>{label}</div>
        :
        (
            typeof state==="boolean" ?
            (
                state===true ?
                <div className="text-sm p-2 px-4 text-green-500 inline-flex items-center">{typeof successMessage==="string" ? <><MdDone className="mr-2"/>{successMessage}</>:(successMessage ?? <><MdDone className="mr-2"/>Lu</>)}</div>
                :
                <div className="text-sm p-2 px-4 text-red-500 inline-flex items-center">{typeof errorMessage==="string" ? <><MdDone className="mr-2"/>{errorMessage}</>:(errorMessage ?? <><MdClose className="mr-2"/>Erreur. réésayer l'action dans 1min</>)}</div>
            )
            :
            (
                state==="close" ?
                <div>
                    
                </div>:<></>
            )
        )
    )
}

export const NotificationItem=({item, onDelete}:{item:Notification, onDelete:Function})=>{
    const [itemSet, setItem]=React.useState(item)
    const marqueAsReadHandle=async()=>{

        const data=await axios.patch("/api/notifications",{
            id:item.id
        })

    }
    const remove=async()=>{
        const data=await axios.delete("/api/notifications/delete/"+item.id)
    }

    return(
        <div className="px-4 mt-2 p-2 border-b">
            <p>{itemSet.content}</p>
            <p className="text-right text-xs">{formatDistanceToNow(new Date(item.createdAt), {locale:Fr, })}</p>
            <div className="flex justify-between">
                <NotificationAction
                    label="Marquer comme lu"
                    onActionClick={marqueAsReadHandle}
                    onActionSuccess={()=>{
                        setItem({...item, read:true})
                    }}
                />
                <NotificationAction
                    label="Effacer"
                    onActionClick={remove}
                    successMessage=""
                    onActionSuccess={()=>{
                        onDelete()
                    }}
                />
            </div>
        </div>
    )
}

export const NotificationList=({items, setItems}: {items:Notification[], setItems:Function})=>{
    return(
        <div className="h-full">
            {
                items.length ?
                items.map((i)=>(
                    <NotificationItem key={i.id} item={i} onDelete={()=>setItems((prev:any)=>prev.filter((item:any)=>item.id!==i.id))}/>
                ))
                :
                <p className="h-full flex items-center text-center justify-center">Aucune notifications</p>
            }
        </div>
    )
}