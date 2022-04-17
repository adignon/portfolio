import { getSession } from "next-auth/react";
import Link from "next/link";
import { Logo } from "../../../app/components/Logo";
import { SignUpLoginForm } from "../../../app/parts/Admin/SignUpForm";


export default function Auth(props:any){
    return(
        <div className="md:shadow rounded p-4  max-w-lg mx-auto md:mt-8 ">
            <Logo/>    
            <p className="text-primary my-2">{props.context==="up"?"Créer un compte administrateur":"Connectez vous à votre compte"}</p>
            <div className="mt-6">
                <SignUpLoginForm context={props.context}/>
                <div className="flex justify-center text-sm p-2">
                    <Link href={props.context==="up" ? "/admin/auth/sign-in" : "/admin/auth/sign-up"}>
                        <a className="text-primary underline hover:no-underline">
                            {props.context==="up" ? "Connectez-Vous" : "Inscrivez-Vous"}
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    )
}


export const getServerSideProps=async(ctx:any)=>{
    const session=await getSession({req:ctx.req})
    console.log(session)
    if(session){
        return({
            redirect:{
                destination:"/admin/secure/dashboard",
                permanent:false
            }
        })
    }else{
        return ({
            props:{
                context:ctx.params.context==="sign-up"?"up":ctx.params.context==="sign-in" ? "in":false,
            }
        })
    }
    
}