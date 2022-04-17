import React from "react"
import { Alert } from "../../components/Alert"
import { Backdrop } from "../../components/Backdrop"
import { Button, CTAButton } from "../../components/Button"
import {Textarea} from "../../components/Input/Textarea"
import { TextField } from "../../components/Input/TextField"
import { Modal, ModalBody, ModalFooter, ModalHeader } from "../../components/Modal"
import { useFormValid } from "../../utils/hooks/useForm"
import axios from "axios"
import {useRouter} from "next/router"
import Joi from "joi"
export const ConfidentialityForm=({defaultValue}:{defaultValue?:string})=>{
    const [,{form, getValues}]=useFormValid({
        confidentiality:{
            value:defaultValue??""
        }
    })
    const [state, setState]=React.useState<undefined|false|true|string>()
    const submit=async ()=>{
        try{
            setState(null as any)
            const data=await axios.post("/api/settings",{
                ...getValues()
            })

            setState(true)
        }catch(e){
            const a:any=e
            setState(a.response?.data.message ?? "Une erreur est survenue")
        }
    }
    return(
        <div className="mt-8">
            {
                state===false || typeof state==="string" ?
                <div className="mb-4">
                    <Alert theme="danger" onClose={()=>setState(undefined)}>
                        {typeof state==="string"  ? state:"Une erreur est survenue. Veillez rééssayer!"}
                        
                    </Alert>
                </div>
                :<></>
            }
            <Textarea
                label="Politique de confidentialité"
                placeholder="Entrez votre politique de confidentialité"
                rows={10}
                {...form("confidentiality")}
            />
            <div className="flex justify-end mt-8">
                <CTAButton loading={state===null} onClick={submit}>Enrégistrer</CTAButton>
            </div>
        </div>
    )
}

export const SecurityForm=(props:{accountEmail: string;
    rootEmail: any;})=>{
    const [openModal, setOpenModal]=React.useState<{title:string,id:number}|false>(false)
    const [,{form:rootEmailForm,handleFormValue,reset:resetRootEmail ,isFormValid:isEmailFormValid, getValues:getRootEmailVelues}]=useFormValid({
        rootEmail:{
            value:props.rootEmail ?? "",
            vSchema:Joi.string().email({tlds:false})
        },
    }, true)
    const [,{form:accountPasswordForm ,isFormValid:isaccountPasswordValid, getValues:getaccountPasswordVelues}]=useFormValid({
        accountPassword:{
            value:"",
            vSchema:Joi.string().pattern(/^[0-9a-z.-]{16}$/i),
            errorMessage:"Le mot de passe doit contenir 16 caractères"
        },
    }, true)
    const [,{form:accountEmailForm, reset:resetAccountEmail ,isFormValid:isaccountEmailValid, getValues:getaccountEmailVelues}]=useFormValid({
        accountEmail:{
            value:props.accountEmail ?? "",
            vSchema:Joi.string().email({tlds:false})
        },
    }, true)
    const router=useRouter()
    const submit=async ()=>{
        if(openModal && typeof openModal==="object"){
            try{
                const data=await axios.post("/api/settings",{
                    ...(openModal.id===1 ?getRootEmailVelues() :{}),
                    ...(openModal.id===2 ?getaccountPasswordVelues() :{}),
                    ...(openModal.id===3 ?getaccountEmailVelues() :{}),
                })
                router.push(router.asPath)

            }catch(e){
                const a:any=e
                throw {message:a.response?.data.message ?? "Une erreur est survenue"}
            }
        }
    }
    
    let errorChecker=typeof openModal==="object"  && openModal.id===1 ? isEmailFormValid: ()=>{}
        errorChecker=typeof openModal==="object"  && openModal.id===2 ? isaccountPasswordValid: ()=>{}
        errorChecker=typeof openModal==="object"  && openModal.id===3 ? isaccountEmailValid: ()=>{}
    
    return(
        <div className="">
            <div className="mt-8">
                <p className="text-lg font-medium">Information générale</p>
                <div className="my-4">
                    <p onClick={()=>{resetRootEmail();setOpenModal({
                        id:1,
                        title:"Identifiants Root"

                    })}} className="list-item hover:no-underline underline ml-4 cursor-pointer hover:text-primary">Changer les identifiants root</p>
                </div>
            </div>
            <div className="mt-8">
                <p className="text-lg font-medium">Information personnelles</p>
                <div className="my-4">
                    <p onClick={()=>{
                        setOpenModal({
                            id:2,
                            title:"Mot de passe"
    
                        })
                    }}  className="list-item hover:no-underline underline cursor-pointer ml-4 hover:text-primary">Changer le mot de passe du compte</p>
                    <p onClick={()=>{resetAccountEmail();setOpenModal({
                        id:3,
                        title:"Email du compte"

                    })}}  className="list-item hover:no-underline underline cursor-pointer ml-4 hover:text-primary mt-4">Changer l'email du compte</p>
                </div>
            </div>
            <EditionModal onSubmit={submit} disabledBtn={errorChecker()} title={typeof openModal==="object" ? openModal.title : ""} open={Boolean(openModal)} onCancel={()=>setOpenModal(false)}>
                {typeof openModal==="object"  && openModal.id===1?(
                    <div>
                        <TextField
                            label="Email Root"
                            placeholder="Entrez l'email root"
                            {...rootEmailForm("rootEmail")}
                        />
                    </div>
                ) :<></>}
                {typeof openModal==="object"  && openModal.id===2?(
                    <div>
                        <TextField
                            label="Nouveau mot de passe"
                            placeholder="Entrez le nouveau mot de passe"
                            {...accountPasswordForm("accountPassword")}
                        />
                    </div>
                ) :<></>}
                {typeof openModal==="object"  && openModal.id===3?(
                    <div>
                        <TextField
                            label="Email du compte"
                            placeholder="Entrez l'email du compte"
                            {...accountEmailForm("accountEmail")}
                        />
                    </div>
                ) :<></>}
            </EditionModal>
        </div>
    )
}

interface IEditionModal{
    children:React.ReactNode,
    open?:boolean
    disabledBtn?:boolean
    onCancel:Function
    onSubmit:Function
    title:React.ReactNode
}
export const EditionModal=({children, open=false, onCancel, disabledBtn=false,onSubmit, title}:IEditionModal)=>{
    const [showChildren, setShowChildren]=React.useState<undefined|null|boolean>(false)
    const [,  {form, getValues}]=useFormValid({
        password:{
            value:""
        }
    })
    const [state, setState]=React.useState<undefined|false|true>()
    const confirmAccount=async()=>{
        try{
            setState(null as any)
            const data=await axios.post("/api/confirm-account", {
                ...getValues()
            })
            setState(true)
            setShowChildren(true)

        }catch(e){
            const err:any=e
            setState(err?.response?.data?.message)
            setShowChildren(false)
        }
    }
    return(
        <Backdrop open={open}> 
            <div className="w-full md:max-w-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:max-w-xl sm:max-w-xs ">
                {
                    state===false || typeof state==="string" ?
                    <div className="mb-4">
                        <Alert theme="danger" onClose={()=>setState(undefined)}>
                            {typeof state==="string"  ? state:"Une erreur est survenue. Veillez rééssayer!"}
                            
                        </Alert>
                    </div>
                    :<></>
                }
                <Modal >
                    <ModalHeader>{showChildren ?title:"Sécurité du compte"}</ModalHeader>
                    <ModalBody>
                        {
                            showChildren ?
                            children
                            :
                            <>
                                <p className="">Vous devez confirmer votre identité pour continuer.</p>
                                <div className="mt-4">
                                    <TextField
                                        label="Mot de passe"
                                        placeholder="Entrez le mot de passe du compte"
                                        type="password"
                                        {...form('password')}
                                    />
                                </div>
                            </>
                        }
                       
                    </ModalBody>
                    <ModalFooter className="flex justify-end">
                        <Button className="mr-4 !bg-gray-500" onClick={()=>onCancel()}>Annuler</Button>
                        <CTAButton onClick={showChildren ? async ()=>{
                           try{
                                setState(null as any)
                                await onSubmit()
                                setState(true as any)
                                onCancel()
                           }catch(e:any){
                               console.log(e)
                               setState(e.message)
                           }
                        }: confirmAccount } disabled={showChildren ? disabledBtn:false} loading={state===null} className="flex-nowrap flex bg-red-500">Valider</CTAButton>
                    </ModalFooter>
                </Modal>
            </div>
            
        </Backdrop>
    )
}