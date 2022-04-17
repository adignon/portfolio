import { Media, Project, ProjectMeta } from "@prisma/client"
import Joi from "joi"
import { AdminLayout } from "../../../../app/layouts/AdminLayout"
import { ProjectService } from "../../../../src/services/Project"
import {BsGithub, BsBoxArrowUpRight} from "react-icons/bs"
import { IconButton } from "../../../../app/components/Button"
import { MdCheck, MdEdit, MdFileDownload, MdFilePresent, MdTimer } from "react-icons/md"
import Link from "next/link"
import { getSession } from "next-auth/react"
import { Notification } from "../../../../src/services/Notification"
import { ContactService } from "../../../../src/services/Contact"
import { getProgess } from "../../../../app/parts/Admin/Projects"
import Image from "next/image"

interface IViewProject{
    data: (Project & {
        medias: Media[];
        metas: ProjectMeta[];
        downloadedMedias: Media[];
    })
}
export const dateFormat=(date:Date, divider="-")=>{
    const z=(d:number)=>d>9 ? d : "0"+d
    return `${z(date.getMonth()+1)}${divider}${z(date.getDate())}${divider}${z(date.getFullYear())}`
}
export default function  ViewProject({data}:IViewProject){
    const percent=getProgess(data)
    console.log(data)
    const appUrl=data.metas.find((m)=>m.key==="APP_URL")
    return(
        <div className="h-full overflow-y-auto">
            <div className="relative">
                {
                   Boolean(data) && Boolean(data?.medias[0]) && Boolean(data.medias[0]?.fullPath ??  (data?.medias[0]?.mediaMeta  as any)?.url ) &&
                    <Image alt=""  src={data.medias[0]?.fullPath ?? (data?.medias[0]?.mediaMeta  as any)?.url as string}  className="w-full h-52 object-cover"/>
                }
                <div className="absolute bottom-0  w-full h-1/2 bg-gradient-to-t from-[#fff] to-transparent"></div>
            </div>
            <div className="md:p-4 p-2">
              <div className="flex items-center py-2 md:justify-between flex-col md:flex-row">
                <div className="flex items-center ">
                    {
                        Boolean(appUrl) ?
                        <a href={appUrl?.value} className="group ">
                             <h5 className="font-semibold text-primary text-2xl group-hover:underline flex items-center">{data?.title} <BsBoxArrowUpRight className="ml-2"/></h5>
                            
                        </a>
                        :
                         <h5 className="font-semibold text-primary text-2xl">{data?.title}</h5>
                    }
                        {
                            data?.status==="DRAFTED"?<p className="mx-4 max-w-max p-1 px-2 text-sm rounded-full shadow bg-yellow-500 text-white">Drafted</p> : <p className="mx-4 max-w-max p-1 px-2 text-sm rounded-full shadow bg-green-500 text-white ">Published</p>
                        }
                </div>
                <div className="flex items-center">
                        <a href={"/admin/secure/projects/actions/edit/"+data?.id} target="_blank" rel="noreferrer">
                        <IconButton size="sm"><MdEdit/></IconButton>
                        </a>
                <p className="ml-2">Created At {dateFormat(new Date(data?.createdAt))}</p>
                </div>
              </div>
            <div className="my-4">
                <p className="mb-2 text-sm font-medium">Level of completion</p>
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
              <div className="overflow-y-auto">
                <div className="my-4 overflow-y-auto">
                    <p className="text-xl p-2 border-b">Images gallery</p>
                    <div className="my-4 flex flex-wrap">
                        {
                            data?.medias?.map((i)=>(
                                <div key={i.id} className="p-2">
                                    <a href={i?.fullPath ?? (i?.mediaMeta  as any)?.url as string} target={"_blank"} rel="noreferrer">
                                    <Image alt=""   className="w-32 h-32 object-cover rounded-md" src={i?.fullPath ?? (i?.mediaMeta  as any)?.url as string}/>
                                    </a>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="my-4 overflow-y-auto">
                    <p className="text-xl p-2 border-b">Description</p>
                    <div className="my-4 flex flex-wrap">
                        {
                            data?.description
                        }
                    </div>
                </div>
                <div className="my-4 overflow-y-auto">
                    <p className="text-xl p-2 border-b">Important Links</p>
                    <div className="my-4 flex flex-wrap">
                        {
                            data?.metas.filter((m)=>["GIT_REPOSITORY"].includes(m.key)).map((m)=>{
                                switch(m.key){
                                    case "GIT_REPOSITORY":{
                                        return (
                                            <Link  href={m.value} key={m.id}>
                                            <a   className="flex items-center hover:underline hover:text-primary">
                                                <div><BsGithub/></div>
                                                <p className="text-sm ml-4">Github Repository</p>
                                            </a></Link>
                                        )
                                    }
                                }
                            })
                        }
                    </div>
                </div>
                <div className="my-4 overflow-y-auto">
                    <p className="text-xl p-2 border-b">Downloadable files</p>
                    <div className="my-4 flex flex-wrap">
                        {
                            data?.downloadedMedias.map((d)=>(
                                <a key={d.id} download href={(d.fullPath ?? (d.mediaMeta as any).fullPath) as string} className="hover:underline hover:text-primary flex w-full items-center">
                                    <MdFileDownload className="mr-2"/> {d.path.slice(d.path.lastIndexOf("/")+1)}
                                </a>
                            ))
                        }
                    </div>
                </div>
              </div>
            </div>
        </div>
    )
}

ViewProject.getLayout=(page:any, layoutProps:any)=>{
    return(
        <AdminLayout layoutProps={layoutProps}>
            {page}
        </AdminLayout>
    )
}

export const getServerSideProps=async(ctx:any)=>{
        const session=await getSession({req:ctx.req})
        if(session){
            const {error}= Joi.string().uuid().validate(ctx.params.id)
            if(Boolean(ctx.params?.id) && !error){
                const service=new ProjectService()
                const {data}:any=await service.getById(ctx.params.id)
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