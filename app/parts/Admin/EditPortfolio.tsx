import {  Media } from "@prisma/client"
import React, { useMemo } from "react"
import { MdAdd, MdDelete, MdDragIndicator, MdEdit } from "react-icons/md"
import { Textarea } from "../../components/Input/Textarea"
import { TextField } from "../../components/Input/TextField"
import { Tab, TabBody, TabHead, TabHeader, TabPanel } from "../../components/Tabs"
import { useFormValid } from "../../utils/hooks/useForm"
import { Button, CTAButton, IconButton } from "../../components/Button"
import axios, {AxiosResponse} from "axios"
import { Backdrop } from "../../components/Backdrop"
import { Modal, ModalBody, ModalFooter, ModalHeader } from "../../components/Modal"
import Joi from "joi"
import { InputLabel } from "../../components/Input/InputLabel"
import { Alert } from "../../components/Alert"
import { useRouter } from "next/router"
import { DeleteModal } from "./Projects"
import { portfolioKey, portfolioStore } from "../../../pages/admin/secure/edit-portfolio"
import { useStore } from "../../utils/store"
import { Popper } from "../../components/Popper"

const getPortfolioErrors=(values:any)=>{
    const errors=[]
    for(let i in values){
        switch(i){
            case "slogan":{
                if(!Boolean(values[i]?.value?.length)){
                    errors.push("Le slogan n'est pas renseigné")
                }
                break;
            }
            case "description":{
                if(!Boolean(values[i]?.value?.length)){
                    errors.push("La description n'est pas renseignée")
                }
                break;
            }
            case "file":{

                if(!(Boolean(values[i]?.value?.file) || Boolean(values[i]?.value?.media))){
                    errors.push("Aucune image selectionnée.")
                }
                break;
            }
        }
    }
    return Array.from(new Set(errors))
}

export const SavePortfolio=()=>{
    const s=useStore( portfolioKey,portfolioStore, (store)=>store)
    const errors=getPortfolioErrors(s)

    const [btnRef, setBtnRef]=React.useState(null)
    const [openError, setOpenError]=React.useState(false)
    const [state, setState]=React.useState<undefined|any>()
    const savePortfolio=async()=>{
        try{
            setState(null)
            const formData=new FormData()
            Object.keys(s).forEach((k:any)=>{
                if(k === "file"){
                    if(s[k].value.media){
                        formData.append('media', JSON.stringify(s[k].value.media))
                    }
                    if(s[k].value.file){
                        formData.append('file', s[k].value.file)
                    }
                }else{
                    formData.append(k, s[k].value)
                }
            })
            const data=await axios.post("/api/portfolio/edit", formData)
            setState(true)
        }catch(e){
            setState(false)
        }
    }
    return(
        <div className="h-full  border-t  md:border-t-0 md:border-l   px-2  mt-6 mb-6 md:m-0">
            <p className="my-4 text-xl font-medium text-center">Action du portfolio</p>
            {/*<div className="my-8">
                <Button fullWidth className="p-4 px-8 !bg-transparent border border-gray-400 text-gray-500">Prévisualiser</Button>
            </div>*/}
            <div>
                <div onMouseEnter={()=>{
                        if(errors.length || Boolean(!Object.values(s)?.length)){
                            setOpenError(true)
                        }
                    }} onMouseLeave={()=>{
                        if(openError){
                            setOpenError(false)
                        }
                    }}>
                    <CTAButton ref={setBtnRef} onClick={savePortfolio} disabled={Boolean(errors?.length) || Boolean(!Object.values(s)?.length)}  loading={state===null} fullWidth className="p-4 px-8 ">Enrégistrer</CTAButton>
                    {
                        state===false ?
                        <p className="text-red-500">Une erreur est survenue lors de l'enrégistrement. Réessayez!</p>:<></>
                    }
                {
                    openError ?
                    <Popper btnRef={btnRef}>
                        <Alert theme="danger">
                            <ul>
                            {
                                [...(Boolean( !Object.values(s)?.length) ? ["Aucune modification apportée"]:[]), ...errors].map((e:any, i:any)=>(
                                    <li key={i} className="mb-2">{e}</li>
                                ))
                            }
                        </ul>
                        </Alert>
                    </Popper>
                    :<></>
                }
                </div>
            </div>
        </div>
    )
}


export const AddPortfolioImage=({media}:{media?:Media})=>{
    const [file, setFile]=React.useState<any>({
        src:Boolean(media?.fullPath) ? media?.fullPath : null,
        media:media??null,
        file:null
    })
    React.useEffect(()=>{
        const store={...portfolioStore.getItem(portfolioKey), file:{value:file}}
        portfolioStore.setItem(portfolioKey, store)
    }, [])
    return(
        <div style={file.src ? {
            backgroundImage:`url("${file.src}")`,
            backgroundSize:"cover"
        } :{}} className="relative sm:w-72 sm:h-72 w-full h-48 bg-gray-200 rounded-md shadow-md">
           {
               !Boolean(file.src) ?
               <div className="absolute w-full top-1/2 -translate-y-1/2 text-center">
                    <div className="text-center"><MdAdd size={"4rem"} className="mx-auto"/></div>
                    <p>Ajouter une image de profil</p>
                    
                </div>
                :<></>
           }
            <input accept="image/*" type="file"  onChange={(e)=>{
                
                    setFile((prev:any)=>{
                        const s=({...prev, file:e.target?.files![0], src:URL.createObjectURL(e.target?.files![0])})
                        const store={...portfolioStore.getItem(portfolioKey), file:{value:s}}
                        portfolioStore.setItem(portfolioKey, store)
                        return s;
                    })
                }}  className="absolute h-full w-full z-10 cursor-pointer opacity-0"/>
        </div>

    )
}

export const TitleForm=({slogan, description, subslogan}:{subslogan?:string, slogan?:string, description?:string})=>{

    const [,{form}]=useFormValid({
        slogan:{
            value:slogan??""
        },
        subslogan:{
            value:subslogan??""
        },
        description:{
            value:description??""
        }
    }, false, {
        useStorage:true,
        storageObject:portfolioStore,
        storageKey:portfolioKey
    })
    return(
        <div>
            <TextField
                label="Slogan"
                placeholder="Entrez votre slogan personnel"
                className="w-full"
                {...form('slogan', ({error, helperText, ...props}:any)=>props)}
            />
           <div className="mt-4">
            <TextField
                    label="Sous-Slogan"
                    placeholder="Entrez votre sous-slogan personnel"
                    className="w-full"
                    {...form('subslogan', ({error, helperText, ...props}:any)=>props)}
                />
           </div>
            <div className="mt-4">
                <Textarea
                    label="Description"
                    placeholder="Décrivez le portfolio"
                    className="w-full"

                    rows={2}
                    {...form('description', ({error, helperText, ...props}:any)=>props)}
                />
            </div>
        </div>
    )
}

interface IKnowlegdeData{
    id:string
    title:string,
    progress:number,
    type:"LIBRARY"|"FRAMEWORK"

}

interface IIKnowlegde{
    data:IKnowlegdeData,
    onEdit:(x:IKnowlegdeData)=>void,
    onDelete:(x:IKnowlegdeData)=>void,
    onDrag:(x:IKnowlegdeData)=>void
}

const Knowlegde=({data, onEdit, onDelete, onDrag}:IIKnowlegde)=>{
    return(
        <>
            <div className="p-2">
                <div className="flex items-center rounded-md shadow-md p-2 px-4">
                    <p className="text-lg font-medium">{data.title}</p>
                    <div className="md:px-8 px-4 w-full">
                        <div className="relative  rounded-full h-2 bg-gray-300">
                            <div 
                                style={{
                                    width:`calc(${Math.round(data.progress)}%)`
                                }}
                                className={"absolute w-3/4 h-2 absolute left-0 top-0  rounded-full " +(90 < 100 ? "bg-yellow-500":"bg-green-500")}></div>
                        </div>
                    </div>
                    <p className="md:px-4 px-2 ">{data.progress}%</p>
                    <div className="flex">
                        <IconButton onClick={()=>onEdit(data)} className="hover:text-primary transition"><MdEdit/></IconButton>
                        <IconButton onClick={()=>onDelete(data)} className="hover:text-red-500 transition"><MdDelete/></IconButton>
                        <IconButton onClick={()=>onDrag(data)} className="hover:text-gray-500 transition"><MdDragIndicator/></IconButton>
                    </div>
                </div>
            </div>
        </>
    )
}

interface IKnowledgeSectionContainer{
    type:"LIBRARY"|"FRAMEWORK",
    data:Array<IKnowlegdeData>
    onItemEdit:(x:IKnowlegdeData)=>void,
    onItemDelete:(x:IKnowlegdeData)=>void,
    onItemDrag:(x:IKnowlegdeData)=>void
    onAddItem:(x:string)=>void
}

 const KnowledgeSectionContainer=({type, data,onAddItem,onItemDelete, onItemDrag, onItemEdit }:IKnowledgeSectionContainer)=>{
     const dataNodes=useMemo(()=>{
         return data.map((d)=><Knowlegde onEdit={onItemEdit} onDelete={onItemDelete} onDrag={onItemDelete} key={d.id} data={d}/>)
     }, [data])
    return(
        <div>
            <div className="flex justify-end">
                <IconButton onClick={()=>onAddItem(type)}>
                    <MdAdd/>
                </IconButton>
            </div>
           <div>
               {
                   dataNodes
               }
               {
                   !data.length ?
                   <p className="text-sm my-8 text-center">Aucune compétence disponible</p>:<></>
               }
           </div>
        </div>
    )
}

export const KnowledgeForm=({open=true,type,  knowledge, onClose,state, onSubmit}:{state?:null|false,onSubmit:Function,onClose:Function,type?:string,open?:boolean, knowledge?:IKnowlegdeData})=>{

    const config={
        title:{
            value:knowledge? knowledge.title : "",
            vSchema:Joi.string().pattern(/^[a-z\s-.#+\/]+$/i),
            errorMessage:"Titre de compétence invalide. Les caractères spéciaux autorisés sont - . # + /"
        },
        progress:{
            value:knowledge? knowledge.progress : 0,
            skipValidation:true
        },
        type:{
            value:type,
            skipValidation:true
        }
    }
    const [data, {form, isFormValid, getValues, editFields}]=useFormValid(config, true)
    React.useEffect(()=>{
        editFields(config)
    }, [open])

    return(
        <Backdrop open={open}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {
                    state===false ?
                    <div className="mb-4">
                        <Alert theme="danger">
                            Une erreur est survenue Veillez réessayer
                        </Alert>
                    </div>
                    :<></>
                }
                <Modal>
                    <ModalHeader 
                        onClose={onClose}
                    >
                        {knowledge ?"Editer une compétence" :"Ajouter une nouvelle compétence"}
                    </ModalHeader>
                    <ModalBody>
                        <div>
                            <div className="mb-4">
                                <TextField
                                    placeholder="Entrez le titre de la compétence"
                                    label="Titre"
                                    {...form("title")}
                                />
                            </div>
                            <div className="">
                                <InputLabel className="block text-sm">{`Niveau de progression (${data["progress"].value}%)`}</InputLabel>
                                <input className="block w-full text-primary mt-2" type="range" min={0} max={100} {...form("progress", ({helperText, error, ...props}:any)=>props)}/>
                            </div>
                            
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="flex justify-end">
                            <CTAButton loading={state===null} disabled={!isFormValid()} onClick={async ()=>{
                                await onSubmit({
                                    ...getValues(),
                                    ...(knowledge ?{id:knowledge.id}:{})
                                })
                            }}>{knowledge ? "Modifier":"Ajouter"}</CTAButton>
                        </div>
                    </ModalFooter>
                </Modal>
            </div>

            
        </Backdrop>
    )
}

interface IKnowledgeSection{
    data:Array<IKnowlegdeData>
}

export const KnowledgeSection=({data}:IKnowledgeSection)=>{
    const [openModal, setOpenModal]=React.useState<false|IKnowlegdeData|string>(false)
    const router=useRouter()
    const [state, setState]=React.useState<undefined|null|false>()
    const [deleteModal, setDeletModal]=React.useState<string|null>(null)
    const onItemEdit=(item:IKnowlegdeData)=>{
        setOpenModal(item)
    }
    const onItemDelete=async (item:IKnowlegdeData)=>{
        setDeletModal(item.id)
    }
    const onItemDrag=(item:IKnowlegdeData)=>{

    }
    const onAddItem=(type:string)=>{

        setOpenModal(type)

    }
    const onModalClose=()=>{
        setOpenModal(false)
    }
    const onItemSubmit=async (data:any)=>{
        try{
            setState(null)
            const {data:d}=await axios.post("/api/portfolio/add-knowledge", {
                ...data
            })
            setState(undefined)
            setOpenModal(false)
            router.push(router.asPath)
        }catch(e){
            setState(false)
        }
    }
    return(
        <>
            <div className="mt-8">
                <div>
                    <p className="pb-2 border-b border-gray-400 text-lg">Section Compéténces</p>
                </div>
                <div className="my-4  ">
                    <Tab className="w-full">
                        <TabHead 
                            className="bg-gray-300 p-1 px-2 rounded-full max-w-max mx-auto" 
                            activeFlag={{
                                className:"rounded-full !bg-white shadow-md",
                                setStyle:({translateX})=>{
                                    return {
                                        height:"calc(100% - 10px)",
                                        transform:`translate(${translateX}px, 50%)`,
                                        bottom:'50%'
                                    }
                                }
                            }}
                        >
                            <TabHeader className="rounded-full">Langages</TabHeader>
                            <TabHeader className="rounded-full">Frameworks</TabHeader>
                        </TabHead>
                        <TabBody>
                            <TabPanel className="w-full py-8">
                                <KnowledgeSectionContainer 
                                    onItemDelete={onItemDelete}
                                    onItemEdit={onItemEdit}
                                    onItemDrag={onItemDrag}
                                    onAddItem={onAddItem}
                                    type={"LIBRARY"} 
                                    data={data.filter(d=>d.type==="LIBRARY")}
                                />
                            </TabPanel>
                            <TabPanel className="w-full py-8">
                                <KnowledgeSectionContainer 
                                    onAddItem={onAddItem}
                                    onItemDelete={onItemDelete}
                                    onItemEdit={onItemEdit}
                                    onItemDrag={onItemDrag}
                                    type={"FRAMEWORK"} 
                                    data={data.filter(d=>d.type==="FRAMEWORK")}
                                />
                            </TabPanel>
                        </TabBody>
                    </Tab>
                
                </div>
            </div>
            <KnowledgeForm 
                state={state}
                onSubmit={onItemSubmit}
                onClose={onModalClose} 
                type={typeof openModal==="string"  ?openModal:  (openModal!==false ?openModal?.type:undefined)} open={Boolean(openModal)} 
                knowledge={typeof openModal==="object" ?openModal:undefined }
            />
            <DeleteModal
                id={deleteModal as string}
                open={Boolean(deleteModal)}
                onCancel={()=>setDeletModal(null)}
                onConfirm={()=>setDeletModal(null)}
                project={false}
            />
        </>
    )
}


export const EditPortfolioForm=({data}:{data:any})=>{
    return(
       <div>
            <div>
                <p className="pb-2 border-b border-gray-400 text-lg">Section Qui Suis-Je ?</p>
            </div>
            <div className="flex sm:flex-row flex-col mt-8">
                <div className="mt-4 sm:mt-0">
                    <AddPortfolioImage media={data.media}/>
                </div>
                <div className="sm:px-4 p-0 mt-4 sm:mt-0 w-full">
                    <TitleForm description={data.description} slogan={data.slogan} subslogan={data.subslogan}/>
                </div>
            </div>
       </div>
    )
}