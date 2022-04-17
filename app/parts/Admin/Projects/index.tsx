import { Media, Project, ProjectMeta } from "@prisma/client"
import { MdCheck, MdChevronRight, MdDelete, MdSearch, MdTimer } from "react-icons/md"
import { differenceInDays, differenceInSeconds, formatDistance } from "date-fns"
import { Button, CTAButton } from "../../../components/Button"
import { TextField } from "../../../components/Input/TextField"
import { useRouter } from "next/router"
import { Backdrop } from "../../../components/Backdrop"
import { Modal, ModalBody, ModalFooter, ModalHeader } from "../../../components/Modal"
import { Transition } from "react-transition-group"
import React from "react"
import axios from "axios"
import { Alert } from "../../../components/Alert"
import { useFormValid } from "../../../utils/hooks/useForm"
import Image from "next/image"

export const SearchField=({onFilter, defaultValue}:{onFilter:Function, defaultValue:string})=>{
    const [data,{form, handleFormValue}]=useFormValid({
        text:{
            value:defaultValue??""
        }
    }, true)
    React.useEffect(()=>{
        if(defaultValue!==data["text"].value){
            handleFormValue("text", defaultValue)
        }
    }, [defaultValue])
    return(
       <div className="flex items-center">
            <div className="md:max-w-max relative w-full ">
                <TextField
                    label=""
                    className="rounded-full pl-12 pr-4"
                    placeholder="Rechercher un projet"
                    {...form('text', ({label, helperText, error, ...props}:any)=>props)}
                />
                <MdSearch className="absolute top-1/2 text-xl -translate-y-1/2 left-4"/>
            </div>
            {
                data["text"].value.length ?
                <div><Button onClick={()=>{
                    onFilter(data["text"].value)
                }} className="!bg-secondary rounded-full ml-2">Filtrer</Button></div>
                :<></>
            }
       </div>
    )
}

export const SelectField=({onSort}:{onSort:Function})=>{
    const [state, setState]=React.useState("time:desc" as string)
    React.useEffect(()=>{
        onSort(state)
    }, [state])
    return(
        <div className="relative max-w-max">
            <Button className=" hidden bg-gradient-to-b from-[#fff] to-[#eee] pr-2 flex items-center text-gray-700 border pl-4  border-gray-400">
                Recents
                <MdChevronRight className="relative rotate-90 text-lg ml-2"/>
            </Button>
            <select className="w-full " value={state} onChange={(e)=>{
                setState(e.target.value)
            }}>
                <option value="time:asc">Date: Croissant</option>
                <option value="time:desc">Date: Décroissant</option>
            </select>
        </div>
    )
}
interface IDeletModal{
    open:boolean,
    onCancel:Function,
    onConfirm:Function
    id:string,
    project?:boolean
}
export const DeleteModal=({open=false, onCancel, onConfirm, id, project=false}:IDeletModal)=>{
    const [state, setState]=React.useState(undefined as any)
    const router=useRouter()
    const handleDelete=async ()=>{
        try{
            setState(null)
            await axios.delete('/api/projects/remove/'+id)
            setState(undefined)
            router.push(router.asPath)
            
            onConfirm()
        }catch(e){
            setState(false)
        }
    }
    const onknowledgeDelete=async ()=>{
        try{
            setState(null)
            const {data:d}=await axios.delete("/api/portfolio/knowledge/delete/"+id)
            setState(undefined)
            router.push(router.asPath)
            onConfirm()
        }catch(e){
            setState(false)
        }
    }
    return(
       
        <Backdrop open={open}> 
            <div className="w-full md:max-w-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:max-w-xl sm:max-w-xs ">
                {
                    state===false ?
                    <div className="mb-4">
                        <Alert theme="danger" onClose={()=>setState(undefined)}>
                            Une erreur est survenue. Veillez rééssayer!
                        </Alert>
                    </div>
                    :<></>
                }
                <Modal >
                    <ModalHeader>Confirmation de suppression</ModalHeader>
                    <ModalBody>
                        Voulez-vous vraiment supprimer ce {project ?"projet":"compétence"} ? Notez que cette action est irréversible.
                    </ModalBody>
                    <ModalFooter className="flex justify-end">
                        <Button onClick={onCancel as any} className="mr-4 bg-gray-500">Annuler</Button>
                        <CTAButton loading={state===null} onClick={project ? handleDelete as any:onknowledgeDelete } className="flex-nowrap flex bg-red-500">Supprimer</CTAButton>
                    </ModalFooter>
                </Modal>
            </div>
            
        </Backdrop>
    )
}

interface IProjectWidget{
    data:(Project & {
        medias: Media[];
        metas: ProjectMeta[];
    })
}

export const getProgess=(data:any)=>{
    const startAt=new Date(data.startAt)
    const endAt=new Date(data.endAt)
    const today=new Date()
   const fulldif=differenceInSeconds(endAt, startAt)
   
   const todaydif=differenceInSeconds( endAt, today)
   if(today >= startAt){
        if(today <= endAt){
            return Math.abs(((fulldif - todaydif) /  fulldif) * 100)
        }else{
            return true
        }
   }else{
       return false
   }
}

export const ProjectWidget=({data}:IProjectWidget)=>{
   
    const [openDelete, setOpenDelete]=React.useState(false)
    const router=useRouter()
    const percent=getProgess(data)
    return(
        <>
            <div className="bg-gray-100 rounded-md">
                <div className="h-48 overflow-hidden rounded-md shadow-md">
                    <Image alt=""  className="w-full object-cover h-full rounded-md" src={data.medias[0]?.fullPath ?? (data.medias[0]?.mediaMeta  as any)?.url  as string}/>
                </div>
                <div className="p-2">
                    <p className="font-medium text-lg pb-2 border-b border-b-gray-400">{data?.title}</p>
                </div>
                <div className="px-2 h-12  overflow-hidden">
                    <p className="ellipsis ">{data?.description}</p>
                    
                </div>
                <div className="p-2">
                    <p className="mb-2 text-sm font-medium">Niveau de réalisation</p>
                    {
                        percent===false ?
                        <p className="inline-flex items-center text-sm text-primary"><MdTimer className="mr-2"/> En attente de démarrage</p>
                        :<></>
                    }
                    {
                        percent===true ?
                        <p className="inline-flex items-center text-sm text-green-500"><MdCheck className="mr-2"/> Projet terminé</p>
                        :<></>
                    }
                    {
                        typeof percent==="number"?
                        <div className="relative rounded-full h-2 bg-gray-300">
                            <div 
                                style={{
                                    width:`calc(${Math.round(percent)}%)`
                                }}
                                className={"absolute w-3/4 h-2 absolute left-0 top-0  rounded-full " +(percent < 100 ? "bg-yellow-500":"bg-green-500")}></div>
                        </div>
                        :<></>
                    }
                </div>
                <div className="py-2 px-2 flex justify-between">
                    <Button onClick={()=>{
                        setOpenDelete(true)
                    }} className="pl-2 pr-2 flex items-center font-medium hover:!text-white text-red-500 border border-red-500 transition hover:!bg-red-500 !bg-transparent "><MdDelete className="mr-2"/> Supprimer</Button>
                    <Button onClick={()=>{
                        router.push("/admin/secure/projects/"+data?.id)
                    }} className="font-medium pl-4 pr-4 flex items-center ">Voir</Button>
                </div>
            </div>
            <DeleteModal 
                id={data?.id}
                open={openDelete} 
                onCancel={()=>{
                    setOpenDelete(false)
                }}
                project
                onConfirm={()=>{
                    setOpenDelete(false)
                }}
            />
        </>
    )
}
/*
background: radial-gradient(circle, #f93800 0%, #fdcfc1 0%, #fa6b41 0,79%, #fa6d43 2,26%, #fb9374 6,31%, #fdcec1 49,57%, #ffffff 100%);
  background-blend-mode: normal;
*/



