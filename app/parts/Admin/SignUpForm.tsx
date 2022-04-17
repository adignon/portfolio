import Joi from "joi"
import { Button, CTAButton } from "../../components/Button"
import { TextField } from "../../components/Input/TextField"
import { signIn, useSession } from "next-auth/react"
import { useFormValid } from "../../utils/hooks/useForm"
import axios from "axios"
import React from "react"
import { Alert } from "../../components/Alert"
import { useRouter } from "next/router"

export const SignUpLoginForm=({context="up"}:{context?:"up"|"in"})=>{
    const [, {form, isFormValid, getValues}]=useFormValid({
        email:{
            value:"",
            vSchema:Joi.string().email({tlds:false}),
            errorMessage:"Email invalide"
        },
        password:{
            value:"",
            ...(context==="up"?{
                vSchema:Joi.string().pattern(/^[0-9a-z.-]{16}$/i),
                errorMessage:"Le mot de passe doit contenir 16 caractères"
            }:{})
        }
    }, true)
    const router=useRouter()
    const [state, setState]=React.useState<null|undefined|true|false>(undefined)
    const createAccount=async ()=>{
        try{
            setState(null)
            const data=await axios.post("/api/sign-up", {
                
                ...getValues(),
                
            })

            setState(true)
        }catch(e){
            setState(false)
        }
    }
    const session=useSession()
    const loginUser=async ()=>{
        try{
            setState(null)
            const data:any=await signIn("credentials",{
                redirect:false,
                ...getValues()
            })
            if(data.status>=400){
                setState(false)
            }else{
                setState(true)
            }
            
        }catch(e){
            setState(false)
        }
    }
    React.useEffect(()=>{
        if(session.status==="authenticated"){
            router.push('/admin/secure/dashboard')
        }
    }, [session])
    React.useEffect(()=>{
        if(state!==undefined){
            setState(undefined)
        }
    }, [router.asPath])
    return(
        <div>
            <div className="my-2">
            {
                state===null &&
                <Alert>
                    {
                        context==="up" ?
                        <>Compte en cours de création...</>
                        :<>Compte en cours de connexion...</>
                    }
                </Alert>
            }
            {
                state===true &&
                <Alert theme="success">
                    {
                        context==="up" ?
                        <>Compte créé avec succès.</>
                        :<>Compte connecté avec succès.</>
                    }
                </Alert>
            }
            {
                state===false &&
                <Alert theme="danger">
                    {
                        context==="up" ?
                        <>La création du compte a échoué.</>
                        :<>La connexion du compte a échoué.</>
                    }
                </Alert>
            }
            </div>
            <div className="mb-2">
                <TextField
                    label="Email"
                    placeholder="Entrez votre email"
                    {...form("email")}
                />
            </div>
            <div className="mb-2">
                <TextField
                    label="Mot de passe"
                    type="password"
                    placeholder="Entrez votre mot de passe"
                    {...form("password")}
                />
            </div>
            <div className="mt-6">
                <CTAButton disabled={!isFormValid()} onClick={async ()=>{
                    if(context==="up") await createAccount(); else await loginUser()
                }} loading={state===null} fullWidth >
                {context==="up" ?"Créer":"Connecter"}
                </CTAButton>
            </div>
        </div>
    )
}
