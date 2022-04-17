import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

export const AuthContext=React.createContext({})

export const AuthContextProvider=({children}:{children:React.ReactNode})=>{
    const session=useSession()
    const router=useRouter()
    const logOut=async()=>{
        await signOut( {
            redirect:false
        })
    }

    return(
        <AuthContext.Provider value={{
            user:(session?.data?.user as any)?.userData,
            logOut
        }}>
            {
                session.status==="loading" ?<div>Chargement...</div> : children
            }
            <div></div>

        </AuthContext.Provider>
    )
}