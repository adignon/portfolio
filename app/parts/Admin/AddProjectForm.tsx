import { MdAdd, MdCalendarViewDay, MdClose, MdEditCalendar, MdFilePresent } from "react-icons/md"
import { IAddProject, store, storeKey } from "../../../pages/admin/secure/projects/actions/[...actions]"
import { CTAButton, IconButton, ICTAButton } from "../../components/Button"
import { ITextarea, Textarea } from "../../components/Input/Textarea"
import { ITextField, TextField } from "../../components/Input/TextField"
import { IForm, useFormValid } from "../../utils/hooks/useForm"
import btnstyle from "../../components/Button/style.module.css"
import { clx } from "../../utils/comp"
import { InputLabel } from "../../components/Input/InputLabel"
import React, { useContext } from "react"
import { Radio } from "../../components/Input/Radio"
import { Store, useStore } from "../../utils/store"
import { Alert } from "../../components/Alert"
import { Popper } from "../../components/Popper"
import axios, { AxiosError, AxiosResponse } from "axios"
import {useRouter} from "next/router"
import { AuthContext } from "../../contexts/AuthContext"
import { dateFormat } from "../../../pages/admin/secure/projects/[id]"
import { Media } from "@prisma/client"
import Image from "next/image"

interface IField{
    defaultValue?:string|Array<any>
}

export const TextFieldForm=({formValidationProps, defaultValue,name, storageObject=store, storageKey=storeKey, ...props}:{
    defaultValue?: any;
    storageObject?: any;
    formValidationProps?:{valide?:boolean, form:IForm},
    storageKey?: any;
    name:string,
} & ITextField)=>{
    const storeObj=storageObject?.getItem(storageKey)
    const [, {form}]=useFormValid({
        [name]: Boolean((storeObj ??{})[name])? (storeObj ??{})[name] : {
            value:defaultValue??"",
            ...(Boolean(formValidationProps?.form) ? {...formValidationProps?.form}:{})
        }
    },  Boolean(formValidationProps) ? Boolean(formValidationProps?.valide) : false, {
        useStorage:true,
        storageObject,
        storageKey
    })
    return(
        <TextField
            
            {...props}
            {...form(name)}
        />
    )
}

export const GitUrlField=({defaultValue}:IField)=>{
    const [, {form}]=useFormValid({
        gitUrl:{
            value:defaultValue??""
        }
    }, false, {
        useStorage:true,
        storageObject:store,
        storageKey:storeKey
    })
    return(
        <TextField
            placeholder="Entrez l'url git du projet"
            label="URL du dépot git"
            {...form("gitUrl")}
        />
    )
}

export const AppUrlField=({defaultValue}:IField)=>{
    const [, {form}]=useFormValid({
        appUrl:{
            value:defaultValue??""
        }
    }, false, {
        useStorage:true,
        storageObject:store,
        storageKey:storeKey
    })
    return(
        <TextField
            placeholder="Entrez l'url  du projet"
            label="URL de l'application"
            {...form("appUrl")}
        />
    )
}

export const DescriptionFieldForm=({formValidationProps,defaultValue,name, storageObject=store, storageKey=storeKey, ...props}:{
    defaultValue?: any;
    storageObject?: any;
    storageKey?: any;
    formValidationProps?:{valide?:boolean, form:IForm},
    name:string,
} & ITextarea)=>{
    const storeObj=storageObject?.getItem(storageKey)
    const [, {form}]=useFormValid({
        [name]: Boolean((storeObj ??{})[name])? (storeObj ??{})[name] : {
            value:defaultValue??"",
            ...(Boolean(formValidationProps?.form) ? {...formValidationProps?.form}:{})
        }
    }, Boolean(formValidationProps) ? Boolean(formValidationProps?.valide) : false, {
        useStorage:true,
        storageObject,
        storageKey
    })
    return(
        <Textarea
            
            
            {...props}
            {...form(name)}
        />
    )
}

export const DatePicker=({name, placeholder="", defaultValue}:{ defaultValue?:string,name:string, placeholder:string})=>{
    const [data, {form}]=useFormValid({
        [name]:{
            value:defaultValue??""
        }
    }, false, {
        useStorage:true,
        storageObject:store,
        storageKey:storeKey
    })
    return(
        <div className="p-2 lg:max-w-max group ">
            <div className="z-0 flex rounded-md overflow-hidden shadow relative w-full">
                <div className="bg-white h-full">
                    <MdEditCalendar size="2.5rem" className="text-primary py-2"/>
                </div>
                <div className="w-full bg-gray-200 border md:w-72  border-transparent group-hover:border-gray-400 group-hover:rounded-r-md text-lg font-medium cursor-pointer text-primary flex justify-center items-center px-4">
                    {Boolean(data[name].value?.length) ?data[name].value: placeholder??"Aucune date choisie"}
                </div>
                <input type="date" {...form(name,  ({helperText, ...props}:any)=>props)} className="absolute opacity-0 z-1 w-full h-full "/>
            </div>
        </div>
    )
}

type FileData=Array<{file?:File, message?:string, media?:Media}>
const uploadFiles=async (files:File[])=>{
    const uploadResult:{errors:FileData, filesData:FileData}={
        errors:[],
        filesData:[]
    }
    for(let i in files){
        const formDatas=new FormData()
        formDatas.append("file", files[i])
        try{
            const {data:{media}}=await axios.post('/api/medias/upload', formDatas, {
                headers:{
                    "Content-Type":"multipart/form-data"
                }
            })
            uploadResult.filesData.push(media)
        }catch(e){
            const a:AxiosError=e as any
            uploadResult.errors.push({
                file:files[i],
                message:a.response?.data?.message
            })
        }
    }
    return uploadResult;
}

const deleteFiles=async (files:Media[])=>{
    const uploadResult:any={
        errors:[],
        filesData:[]
    }
    for(let i in files){
        try{
            await axios.delete('/api/medias/delete/'+files[i].id)
            uploadResult.filesData.push(files[i])
        }catch(e){
            const a:AxiosError=e as any
            uploadResult.errors.push({
                file:files[i],
                message:a.response?.data?.message
            })
        }
    }
    return uploadResult;
}



export const ImageUploader=({defaultValue}:any)=>{
    const [files, setFiles]=React.useState<Array<{src:string, file:File, media?:any}>>(defaultValue?.map((m:any)=>({media:m, src:m.fullPath }))??[])
    React.useEffect(()=>{
        const storeItem=store.getItem(storeKey)
        store.setItem(storeKey, {
            ...storeItem,
            imageFiles:{
                value:files
            }
        })
    }, [files])
    return(
        <div>
            <InputLabel className="text-sm ">Images du projet</InputLabel>
            <div className="bg-gray-100 p-2 rounded-md mt-2 flex flex-wrap">
                {files.map((f, i)=>(
                    <div className="relative group" key={i}>
                        <Image alt=""  src={f.src}  className="w-36 h-36 block mr-3 mb-3 rounded-md"/>
                        <div className="hidden absolute top-1 right-4 shadow rounded-full group-hover:block"><IconButton size="sm" onClick={()=>setFiles(prev=>prev.filter((_:any,j)=>j!==i))} className="p-1.5   bg-white"><MdClose/></IconButton></div>
                    </div>
                ))}
                <div className={clx(
                    "z-0 w-36 h-36 bg-gray-300 rounded-md flex justify-center items-center relative",
                    btnstyle.button
                    )}>
                    <div>
                        <MdAdd size={"2rem"} className="text-gray-400"/>
                    </div>
                    <input accept="image/*" type="file"  onChange={(e)=>{
                        setFiles(prev=>[...prev, {file:e.target?.files![0], src:URL.createObjectURL(e.target?.files![0])}])
                    }}  className="absolute h-full w-full z-10 cursor-pointer opacity-0"/>
                </div>
            </div>
        </div>
    )
}


export const AttachedFiles=({defaultValue}:any)=>{
    const [files, setFiles]=React.useState<Array<{ file?:File, media?:any}>>(defaultValue?.map((m:any)=>({media:m }))??[])
    React.useEffect(()=>{
        const storeItem=store.getItem(storeKey)
        store.setItem(storeKey, {
            ...storeItem,
            attachedFiles:{
                value:files
            }
        })
    }, [files])
    return(
        <div>
            <InputLabel className="text-sm ">Fichier téléchargeables du projet</InputLabel>
            <div className="bg-gray-100 p-2 rounded-md mt-2 flex flex-wrap">
                {files.map((f, i)=>(
                    <div className="relative group w-36 h-36 mr-2" key={i}>
                        <div  className="text-center my-auto absolute top-1/2 -translate-y-1/2">
                            <p className="text-center"><MdFilePresent className="!text-7xl mx-auto"/></p>
                            <p className="text-xs">{f.file ? f.file?.name : f.media?.path.slice(f.media?.path.lastIndexOf("/") + 1)}</p>
                        </div>
                        <div className="hidden absolute top-1 right-4 shadow rounded-full group-hover:block"><IconButton size="sm" onClick={()=>setFiles(prev=>prev.filter((_:any,j)=>j!==i))} className="p-1.5   bg-white"><MdClose/></IconButton></div>
                    </div>
                ))}
                <div className={clx(
                    "z-0 w-36 h-36 bg-gray-300 rounded-md flex justify-center items-center relative",
                    btnstyle.button
                    )}>
                    <div>
                        <MdAdd size={"2rem"} className="text-gray-400"/>
                    </div>
                    <input type="file"  onChange={(e)=>{
                        setFiles(prev=>[...prev, {file:e.target?.files![0]}])
                    }}  className="absolute h-full w-full z-10 cursor-pointer opacity-0"/>
                </div>
            </div>
        </div>
    )
}


export const SaveProjectRadio=({defaultValue}:{defaultValue?:string})=>{
    const [form, {handleFormValue}]=useFormValid({
        option:{
            value:(defaultValue?.toLowerCase()) ?? "drafted"
        }
    }, false, {
        useStorage:true,
        storageObject:store,
        storageKey:storeKey
    })
    return(
        <div className="p-2 ">
            <div className="my-4">
            <Radio label="Brouillon" checked={form["option"].value==="drafted"} onChange={(e)=>handleFormValue('option', "drafted")}/>
            </div>
            <div className="my-2">
            <Radio label="Publier" checked={form["option"].value==="published"}  onChange={(e)=>handleFormValue('option', "published")}/>
            </div>
        </div>
    )
}



export const validateForm=()=>{
    const values=store.getItem(storeKey)
    const errors:any={}
    for(let i in values){
        //description, imageFiles, fromDate, option, title, toDate, gitUrl, appUrl?, attachedFiles?
        switch(i){
            case "description":
                if(!Boolean(values["description"].value?.length)){
                    errors["description"]="La description de du projet n'est pas remplie."
                }
                break;
            case "imageFiles":
                if(!Boolean(values["imageFiles"].value?.length)){
                    errors["imageFiles"]=("Aucune image du projet n'est pas sélectionnée.")
                }
                break;
            case "fromDate":
                if(!Boolean(values["fromDate"].value?.length)){
                    errors["fromDate"]=("Date de début de projet non définie.")
                }
                break;
            case "option":
                if(!Boolean(values["option"].value?.length)){
                    errors["option"]=("Option de publication non définie.")
                }
                break;
            case "title":
                if(!Boolean(values["title"].value?.length)){
                    errors["title"]=("Titre du projet indéfinie.")
                }
                break;
            case "toDate":
                if(!Boolean(values["toDate"].value?.length)){
                    errors["toDate"]=("Date de fin de projet non définie.")
                }
                break;
            case "gitUrl":
                if(!Boolean(values["gitUrl"].value?.length)){
                    errors["gitUrl"]=("Url de dépot git non fournie.")
                }
                break;
        }
    }
    return errors
}

export const SaveForm=({data:project, className}:{className:string} & IAddProject)=>{

    const s=useStore(storeKey, store, (store)=>store)
    
    const [btnRef, setBtnRef]=React.useState(null)
    const [openError, setOpenError]=React.useState(false)
    const [state, setState]=React.useState<undefined|any>()
    
    const {logOut}:any=useContext(AuthContext)
    const fileUploader=async(files:File[])=>{
        const data=await uploadFiles(files)
        if(data.filesData.length===files.length){
            return data.filesData
        }else{
            await deleteFiles(data.filesData.filter((e)=>Boolean(e.media)).map((e)=>e.media as Media))
            return false
        }
    }
    const persist=async()=>{
        try{
            setState(null)
            const imagesFile=(Object.keys(s).filter(s=>s=="imageFiles").map((k=>s[k].value.map((d:any)=>d.file)))[0]).filter((d:any)=>Boolean(d))
            const attachedFiles=Object.keys(s).filter(s=>s=="attachedFiles").map((k=>s[k].value.map((d:any)=>d.file)))[0].filter((d:any)=>Boolean(d))
            console.log(imagesFile, attachedFiles)
            const imageFilesToUpload=imagesFile && Boolean(imagesFile?.length )? await fileUploader(imagesFile ??[]) :[]
            const attachedFiledToUpload=attachedFiles && Boolean(attachedFiles?.length )?await fileUploader(attachedFiles??[]):[]
            console.log(imageFilesToUpload, attachedFiledToUpload)

            if(imageFilesToUpload && attachedFiledToUpload){
                const toSendData:any={}
                console.log(s)
                //description, imageFiles, fromDate, option, title, toDate, gitUrl, appUrl?, attachedFiles?
                Object.keys(s).filter((e)=>!(["imageFiles", "attachedFiles"].includes(e))).forEach((e)=>{
                    toSendData[e]=s[e].value
                })
                const oldMedias=s["imageFiles"].value.map((m:any)=>m.media) 
                const oldAttachedMedias=s["attachedFiles"].value.map((m:any)=>m.media)
                const {data}:AxiosResponse=await axios.post("/api/projects/save", {
                    ...(Boolean(project?.id )? {id:project?.id}:{}),
                    ...toSendData,
                    imageFiles:[...imageFilesToUpload, ...(oldMedias)].filter((d:any)=>Boolean(d)),
                    attachedFiles:[...attachedFiledToUpload, ...(oldAttachedMedias)].filter((d:any)=>Boolean(d)),
                })
                setState({redirect:false, done:true, data:data?.data, message:<>Projet créé avec succès. Redirection en cours</>})
            }else{
                setState({redirect:false, done:false, message:<>L'ajout du projet a échoué</>})
            }
            
        }catch(e:any){
            console.log(e)
            const a:AxiosError=e
            setState({redirect:a?.response?.status===403, done:false, message:<>L'ajout du projet a échoué</>})
            if(a?.response?.status===403){
                await logOut()
            }
        }
    }
    const router=useRouter()
    React.useEffect(()=>{
        if(state?.done){
            router.push("/admin/secure/projects/"+state?.data.id)
        }
    }, [state?.done])
    const err:Array<string>=Object.values(validateForm())
    return(
        <>
            <div  className={clx("h-full  xl:w-1/3 border-t  xl:border-t-0 xl:border-l   px-2  mt-6 mb-6 xl:m-0", className)}>
                <p className="font-medium text-lg xl:text-center pt-10">Status du projet</p>
                <SaveProjectRadio defaultValue={project?.status}/>
                <div onMouseEnter={()=>{
                        
                        if(err.length || Boolean(project && !Object.values(s)?.length)){
                            setOpenError(true)
                        }
                    }} onMouseLeave={()=>{
                        if(openError){
                            setOpenError(false)
                        }
                    }}>
                    <CTAButton ref={setBtnRef} loading={state===null} fullWidth onClick={persist}  disabled={Boolean(err?.length) || Boolean(project && !Object.values(s)?.length)}>Enrégistrer</CTAButton>
                    {
                        state?.done===false ?
                        <p className="text-sm text-red-500 p-2 text-center">L'ajout du projet a échoué</p>
                        :<></>
                    }
                    {
                        state?.done===true ?
                        <p className="text-sm text-green-500 p-2 text-center">Projet ajouté. Redirection...</p>
                        :<></>
                    }
                </div>
                {
                    openError ?
                    <Popper btnRef={btnRef}>
                        <Alert theme="danger">
                            <ul>
                            {
                                [...(Boolean(project && !Object.values(s)?.length) ? ["Aucune modification apportée"]:[]), ...err].map((e:any, i:any)=>(
                                    <li key={i} className="mb-2">{e}</li>
                                ))
                            }
                        </ul>
                        </Alert>
                    </Popper>
                    :<></>
                }
            </div>
        </>
    )
}


export const AddProjectForm=({data}:IAddProject)=>{
    return(
        <div className="my-8">
            <div>
                <TextFieldForm name="title" placeholder="Entrez la description du projet" label="Titre" defaultValue={data?.title}/>
            </div>
            <div className="mt-8">
                <ImageUploader  defaultValue={data?.medias}/>
            </div>
            <div className="mt-8">
                <DescriptionFieldForm name="description" placeholder="Entrez la description du projet" label="Description" defaultValue={data?.description}/>
            </div>
            <div className="my-8">
                <InputLabel className="text-sm">Durée du projet (Cliker pour choisir une date)</InputLabel>
                <div className='flex-col flex md:flex-row justify-between items-center mt-2'>
                    <div className="w-full">
                        <DatePicker  defaultValue={Boolean(data?.startAt) ?dateFormat(new Date(data?.startAt as any)) :""} name="fromDate" placeholder="Date de début" />
                    </div>
                    <p className="w-full text-center">à</p>
                    <div className="w-full">
                        <DatePicker name="toDate" defaultValue={Boolean(data?.startAt) ?dateFormat(new Date(data?.endAt as any)) :""} placeholder="Date de fin"/>
                    </div>
                </div>
            </div>
            <div className="mt-8">
                <GitUrlField defaultValue={data?.metas.find((m:any)=>m.key==="GIT_REPOSITORY")?.value}/>
            </div>
            <div className="mt-8">
                <AppUrlField defaultValue={data?.metas.find((m:any)=>m.key==="APP_URL")?.value}/>
            </div>
            <div className="mt-8">
                <AttachedFiles defaultValue={data?.downloadedMedias}/>
            </div>
        </div>
    )
}


interface ICTAButtonValid extends ICTAButton{
    onPersistData:(store:Store)=>AxiosResponse|any,
    validateForm:(store:Store)=>string[],
    successMessage:string,
    errorMessage:string,
    ctaStoreKey:string,
    ctaStore:Store
}
export const CTAButtonValid=({onPersistData, validateForm, children, successMessage, errorMessage,ctaStore,ctaStoreKey,   ...props}:ICTAButtonValid)=>{
    const s=useStore(ctaStoreKey, ctaStore, (store)=>store)
    
    const [btnRef, setBtnRef]=React.useState(null)
    const [openError, setOpenError]=React.useState(false)
    const [state, setState]=React.useState<undefined|any>()
    
    const {logOut}:any=useContext(AuthContext)
    const persist=async()=>{
        try{
            setState(null)
            const data=await onPersistData(ctaStore.getItem(ctaStoreKey))
            setState({redirect:false, done:true, data:data?.data, message:<>{successMessage?? "Requete exécuté avec succès!"}</>})
        }catch(e:any){
            console.log(e)
            const a:AxiosError=e
            setState({redirect:a?.response?.status===403, done:false, message:<>{errorMessage??"L'exécution de la requete a échoué."}</>})
            if(a?.response?.status===403){
                await logOut()
            }
        }
    }
    const err:Array<string>=validateForm(ctaStore.getItem(ctaStoreKey))

    const disabled= Boolean(err?.length)
    return(
        <>
            <>
                <div className="flex flex-col items-center group relative">
                    <CTAButton ref={setBtnRef} loading={state===null} onClick={persist}  disabled={Boolean(err?.length)} {...props}>{children}</CTAButton>
                        {
                            state?.done===false ?
                            <p className="text-sm text-red-500 p-2 text-center">{state.message}</p>
                            :<></>
                        }
                        {
                            state?.done===true ?
                            <p className="text-sm text-green-500 p-2  text-center">{state.message}.</p>
                            :<></>
                        }
                        {
                           disabled ?
                            <div className="absolute top-2/2 w-full  opacity-0 top-full text-center   group-hover:opacity-100 ">
                                <Alert theme="danger">
                                        <ul>
                                        {
                                            [ ...err].map((e:any, i:any)=>(
                                                <li key={i} className="mb-2">{e}</li>
                                            ))
                                        }
                                    </ul>
                                    </Alert>
                            </div>:<div></div>
                       }
                    
                </div>
            </>
        </>
    )
}