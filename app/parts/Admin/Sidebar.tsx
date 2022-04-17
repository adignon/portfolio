import React from "react"
import { MdHome } from "react-icons/md"
import { Button, IButton } from "../../components/Button"
import { Logo } from "../../components/Logo"
import { clx } from "../../utils/comp"
import { MdCategory, MdEmail, MdEdit, MdSettings } from "react-icons/md"
import { useRouter } from "next/router"
import Link from "next/link"
import { Notification } from "@prisma/client"

interface ISidebarLink extends IButton{
    children:React.ReactNode,
    leftIcon?:React.ReactNode,
    linkDomain:string
    defaultUrl?:string
    rightBadge?:React.ReactNode
}
const SidebarLink=({children,className,leftIcon,linkDomain,defaultUrl,rightBadge, ...props}:ISidebarLink)=>{
    const router=useRouter()
    const classes={
        active:"",
        unactive:"!bg-transparent !text-inherit !shadow-none"
    }
    return(
        <div className="p-2">
           <Link href={defaultUrl?? linkDomain.replace('*', "")}>
                <a>
                <Button onClick={()=>{

                    }} className={clx("rounded-full items-center max-w-min w-16 !justify-start", classes[new RegExp(`^${linkDomain.replace(/\*/g, "(.*?)")}$`).test(router.asPath[router.asPath.length - 1]==="/" ?router.asPath : router.asPath+"/" ) ? "active":"unactive"],className)} {...props}>
                
                    {leftIcon &&  <span className="mr-6 text-lg">{leftIcon}</span>}
                    {children}
                    {
                        rightBadge ?
                        <span className="pl-4">
                            {rightBadge}
                        </span>:<></>
                    }
                </Button>
                </a>
           </Link>
        </div>
    )
}

export const Sidebar=({basePath, layoutProps}:{basePath:string, layoutProps:{ unreadMessages: number, unreadNotifications:  Array<Notification>  }})=>{
    return(
        <div className="lg:w-full w-72 lg:pr-4">
            <Logo className="max-w-min mx-auto my-2"/>
            <div>
                <SidebarLink 
                    leftIcon={<MdHome/>}
                    fullWidth
                    linkDomain={basePath+"/dashboard/"}
                >
                    Acceuil
                </SidebarLink>
                <SidebarLink 
                    leftIcon={<MdCategory/>}
                    fullWidth
                    linkDomain={basePath+"/projects/*"}
                >
                    Projets & Conception
                </SidebarLink>
                <SidebarLink 
                    leftIcon={<MdEmail/>}
                    fullWidth
                    linkDomain={basePath+"/contact-emails/*"}
                    defaultUrl={basePath+"/contact-emails/all"}
                    rightBadge={layoutProps.unreadMessages > 0 ? <span className="bg-red-500 text-white px-2 py-1 text-xs absolute right-5 top-1/2 -translate-y-1/2 rounded-full">{layoutProps.unreadMessages}</span>:undefined}
                >
                    Email & Messagerie
                </SidebarLink>
                <SidebarLink 
                    leftIcon={<MdEdit/>}
                    fullWidth
                    linkDomain={basePath+"/edit-portfolio/"}
                >
                    Edition du portfolio
                </SidebarLink>
                <SidebarLink 
                    leftIcon={<MdSettings/>}
                    fullWidth
                    linkDomain={basePath+"/settings/"}
                >
                    Paramètres
                </SidebarLink>
            </div>
        </div>
    )
}