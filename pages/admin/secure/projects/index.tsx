import { Media, Project, ProjectMeta } from "@prisma/client"
import Image from "next/image"
import { useRouter } from "next/router"
import React from "react"
import { MdAdd, MdChevronLeft, MdRefresh, MdChevronRight } from "react-icons/md"
import { Button } from "../../../../app/components/Button"
import { Grid, GridContainer } from "../../../../app/components/Grid"
import { Paginate } from "../../../../app/components/Pagination"
import { AdminLayout } from "../../../../app/layouts/AdminLayout"
import { PageTitle } from "../../../../app/parts/Admin/Comps"
import { ProjectWidget, SearchField, SelectField } from "../../../../app/parts/Admin/Projects"
import { ContactService } from "../../../../src/services/Contact"
import { Notification } from "../../../../src/services/Notification"
import { ProjectService } from "../../../../src/services/Project"

export interface IProjects{
    data:(Project & {
        medias: Media[];
        metas: ProjectMeta[];
    })[]
}

 const Projects=({data}:IProjects)=>{
    const sort=(data:any, sort:"time:desc"|"time:asc")=>{
        switch(sort){
            case "time:asc":{
                return data.sort((a:any, b:any)=>new Date(a.createdAt)>new Date(b.createdAt) ?1:-1)
            }
            case "time:desc":{
                return data.sort((a:any, b:any)=>new Date(a.createdAt)<new Date(b.createdAt) ?1:-1)
            }
        }
    }
    const [filteredData, setFilteredData]=React.useState({
        data:data,
        filterText:"",
        sort:"time:desc"
    })
    const router=useRouter()
    const d=filteredData.data
    React.useEffect(()=>{

        setFilteredData({
            data:data,
            filterText:"",
            sort:"time:desc"
        })
    }, [data])
    return(
        <div className="h-full w-full pl-4 md:pl-10  p-10 pb-0 md:pr-8 pr-2 flex flex-col overflow-y-auto md:overflow-hidden">
            <div className="w-full flex flex-col md:flex-row items-center justify-between pb-6 border-b">
                <div>
                    <PageTitle>Projets & Conceptions</PageTitle>
                    <p className="text-sm mt-2">Tous mes projets et conceptions</p>
                    
                </div>
                <Button onClick={()=>{
                    router.push("/admin/secure/projects/actions/add")
                }} className="mt-4 md:mt-0 !bg-secondary-500 text-white flex items-center pl-6">
                    <MdAdd className="text-xl mr-4"/>
                    Ajouter
                </Button>
            </div>
            <div className="pt-8 mb-0 pb-4 pr-2  h-full md:overflow-y-auto relative ">
                <div className="flex justify-between flex-col md:flex-row mb-8">
                    <p className="md:hidden text-sm font-medium">Rechercher</p>
                    <SearchField defaultValue={filteredData.filterText} onFilter={(filterText:string)=>{
                        if(filterText.length){
                            setFilteredData(prev=>({...prev,filterText, data:sort(data.filter((d)=>d.title.toLowerCase().includes(filterText.toLowerCase())), prev.sort as any)}))
                        }
                    }}/>
                    <div className="flex items-center mt-4 md:m-0">
                        <p className="font-medium mr-2">Trier Par :</p>
                        <div>
                            <SelectField onSort={(sortText:string)=>{
                                setFilteredData(prev=>({...prev, data:sort(prev.data, sortText as any), sort:sortText}))
                            }}/>
                        </div>
                    </div>
                </div>
                {
                    filteredData.filterText.length ?
                    <div className="mb-8 mt-0">
                        <Button style={{whiteSpace:"nowrap"}} onClick={()=>{
                            setFilteredData(prev=>({...prev, data, filterText:""}))
                        }} className="!bg-transparent !text-gray-500  border rounded-full border-gray-400 shadow-none items-center"><MdRefresh className="mr-4 text-lg"/> Réinitialiser la recherche</Button>
                    </div>
                    :<></>
                }
                 <Paginate data={d} pageLength={9}>
                    {
                        ({data:pageDate, currentIndex, prev, next})=>{
                            return (
                                Boolean(pageDate.length) ?
                                <div>
                                    <GridContainer >
                                        {
                                            pageDate.map((d:any)=>(
                                                <Grid key={d.id} xs={12} sm={6} xl={4} className="p-2">
                                                    <ProjectWidget key={d.id} data={d}/>
                                                </Grid>
                                            ))
                                        }
                                    </GridContainer>
                                    <div className="my-4">
                                        <div className="flex  items-center justify-between">
                                        <Button onClick={prev}  className="!p-3 rounded-full" disabled={currentIndex===1}><MdChevronLeft className="text-xl "/></Button>
                                            <div>
                                                <p>Page {currentIndex}</p>
                                            </div>
                                            <Button onClick={next}  className="!p-3 rounded-full"  disabled={(currentIndex * 9) >= d.length} ><MdChevronRight className="text-xl "/></Button>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="relative">
                                    <div className="absolute w-full top-1/2 -translate-y-1.2 text-center flex justify-center">
                                        <div className="text-center">
                                            <Image alt=""  src="/assets/images/undraw_void_-3-ggu.svg" className="h-72 block"/>
                                            <p className="mt-4 text-gray-500">Aucun projet trouvé</p>
                                        </div>
                                    </div>
                                </div>
                                
                            )
                        }
                    }
                </Paginate>
                
                
            </div >
        </div>
    )
}

export default Projects

Projects.getLayout=(page:any, layoutProps:any)=>{
    return (
        <AdminLayout layoutProps={layoutProps}>{page}</AdminLayout>
    )
}

export const getServerSideProps=async(ctx:any)=>{
    const service=new ProjectService()
    const {data}=await service.getAll()

    return{
        props:{
            data: Boolean(data?.length) ? data?.map((d:any)=>({
                ...d, startAt:d.startAt.toString(),
                endAt:d.endAt.toString(),
                createdAt:d.createdAt.toString(),
            })) :[],
            layoutProps:{
                unreadMessages:(await (new ContactService()).getAllContactMessages({read:false})).length,
                unreadNotifications:(await (new Notification()).getUnredNotifications())
            }
        }
    }
}

