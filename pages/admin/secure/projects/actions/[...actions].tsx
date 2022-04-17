import { Media, Project, ProjectMeta } from "@prisma/client"
import Joi from "joi"
import { getSession } from "next-auth/react"
import { AdminLayout } from "../../../../../app/layouts/AdminLayout"
import { AddProjectForm, SaveForm } from "../../../../../app/parts/Admin/AddProjectForm"
import { PageTitle } from "../../../../../app/parts/Admin/Comps"
import { Store } from "../../../../../app/utils/store"
import { ContactService } from "../../../../../src/services/Contact"
import { Notification } from "../../../../../src/services/Notification"
import { ProjectService } from "../../../../../src/services/Project"
export const store=new Store()
export const storeKey="add-project"

export interface IAddProject{
    data:(Project & {
        medias: Media[];
        metas: ProjectMeta[];
        downloadedMedias: Media[];
    }) | null
}

export default function AddProject({data}:any){
    console.log(data)
    return(
        <div className="flex h-full ">

            <div className="h-full w-full p-10 pb-0 pr-2 flex flex-col">
                <PageTitle>Ajouter un projet</PageTitle>
                <div className="py-8 mb-0 pb-2 pr-2 overflow-y-auto">
                    <AddProjectForm data={data}/>
                    <SaveForm data={data} className="xl:hidden"/>
                </div >
            </div>
            <SaveForm data={data} className=" hidden xl:block"/>
        </div>
    )
}

export const getServerSideProps=async(ctx:any)=>{
    const session=await getSession({req:ctx.req})
        if(session){
            const params=ctx.params.actions
            //create

            if(params.length === 1 && params[0]==="add"){
                return {
                    props:{
                        data:null,
                        layoutProps:{
                            unreadMessages:(await (new ContactService()).getAllContactMessages({read:false})).length,
                            unreadNotifications:(await (new Notification()).getUnredNotifications())
                        }
                    }
                }
            }else if(params.length === 2 && params[0]==="edit" && !Boolean(Joi.string().uuid().validate(params[1])?.error)){
                const service=new ProjectService()
                const {data}:any=await service.getById(params[1])
                if(data && Boolean(data?.id) && Boolean(data?.medias?.length)){
                    return{
                        props:{
                            data:{
                                ...data,
                                startAt:data.startAt.toString(),
                                endAt:data.endAt.toString(),
                                createdAt:data.createdAt.toString(),
                            },
                            layoutProps:{
                                unreadMessages:(await (new ContactService()).getAllContactMessages({read:false})).length,
                                unreadNotifications:(await (new Notification()).getUnredNotifications())
                            }
                        }
                    }
                }
            }
        
            return {
                notFound:true
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

AddProject.getLayout=(page:any, layoutProps:any)=>{
    return(
        <AdminLayout layoutProps={layoutProps}>
            {page}
        </AdminLayout>
    )
}