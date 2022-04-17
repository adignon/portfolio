import { format } from "date-fns"
import { getSession } from "next-auth/react"
import { AdminLayout } from "../../../app/layouts/AdminLayout"
import { PageTitle } from "../../../app/parts/Admin/Comps"
import { ContactService } from "../../../src/services/Contact"
import { UsageService } from "../../../src/services/Usage"
import { Notification } from "../../../src/services/Notification"
import {UsageMeta} from "@prisma/client"
import { Grid, GridContainer } from "../../../app/components/Grid"
import { MdVisibility } from "react-icons/md"
import { ProjectService } from "../../../src/services/Project"

export default function Dashboard({usageDatas, projects, contacts}:{usageDatas:UsageMeta[], projects:{
    all: number | undefined;
    published: number | undefined;
}, contacts:{
    all: number;
    unreadContact: number;
}}){
    return(
        <div className="!h-full w-full md:p-10 !pb-0 md:pr-2 flex flex-col  ">
            <PageTitle className="pb-4  font-semibold h-20 border-b !p-6">Tableau de bord</PageTitle>
            <div className="h-full overflow-y-auto p-6 ">
                <p className="  text-gray-500 ">Statistiques</p>
                <GridContainer className="py-2">
                    <Grid xs={12}   className="p-2">
                        <div className="p-4 rounded-md shadow w-full bg-primary text-white">
                            <p className="text-lg flex items-center "><MdVisibility className="mr-4"/> Visites</p>
                            <p className={"text-5xl text-right font-bold "+(usageDatas.length ? "text-5xl":"text-lg")}>{usageDatas.length ? usageDatas.length :  "Aucune Visite"}</p>
                        </div>  
                    </Grid>
                    <Grid xs={12}   className="p-2">
                        <div className="p-4 rounded-md shadow w-full bg-secondary text-white">
                            <p className="text-lg flex items-center "><MdVisibility className="mr-4"/> Projets</p>
                            <div className="flex items-end justify-between">
                                <p className="text-2xl">{projects.published ?  (<>{projects.published} Publié{projects.published> 1 ? "s":""}</>):<></>} </p>
                                <p className={" text-right font-bold "+(projects.all ? "text-5xl":"text-lg")}>{projects.all ?projects.all: "Aucun Projet Enrégistré"}</p>
                            </div>
                        </div>
                    </Grid>
                    <Grid xs={12}   className="p-2">
                        <div className="p-4 rounded-md shadow w-full bg-green-500 text-white">
                            <p className="text-lg flex items-center "><MdVisibility className="mr-4"/>Contacts Établis</p>
                            <div className="flex items-end justify-between">
                                <p className="text-2xl">
                                {contacts.unreadContact ?  (<>{contacts.unreadContact} en attentes{contacts.unreadContact> 1 ? "s":""}</>):<></>}
                                    
                                </p>
                                <p className={" text-right font-bold "+(contacts.all ? "text-5xl":"text-lg")}>{contacts.all ?contacts.all: "Aucun Contact Établi"}</p>
                            </div>
                        </div>
                    </Grid>
                </GridContainer>
                {/*
                        usageDatas.map((m)=>(
                            <div key={m.id} className=" p-2 border-b flex justify-between  px-4 mb-2">
                                <div className="w-1/2 text-lg font-semibold">{m.ipAdress}</div> 
                                <div className="w-1/2">{format(new Date(m.visitedAt), "d/MM/yyyy H:ii")}</div> 
                            </div>
                        ))
                        */}
            </div>
        </div>
    )
}

Dashboard.getLayout=(page:any, layoutProps:any)=>{
    return(
        <AdminLayout layoutProps={layoutProps}>
            {page}
        </AdminLayout>
    )
}

export const getServerSideProps=async (ctx:any)=>{
    const session=await getSession({req:ctx.req})
    const projectService=new ProjectService()
    const projects=(await projectService.getAll()).data
    const constactService=new ContactService()
    const allContact=await constactService.getAllContactMessages()
    const unreadContact=(await constactService.getAllContactMessages({read:false}))
    if(session){
            return{
                props:{
                    usageDatas:(await (new UsageService()).getAllUsageData()).map((m)=>({...m, visitedAt:m.visitedAt.getTime()})),
                    contacts:{
                        all:allContact.length,
                        unreadContact:unreadContact.length
                    },
                    projects:{
                        all:projects?.length,
                        published:projects?.filter(p=>p.status==="PUBLISHED").length
                    },
                    layoutProps:{
                        unreadMessages:unreadContact.length,
                        unreadNotifications:(await (new Notification()).getUnredNotifications())
                    }
                }
            }
    }else{
        return {
            redirect:{
                destination:"/admin/auth/sign-in",
                permanent:false
            }
        }
    }
    
}