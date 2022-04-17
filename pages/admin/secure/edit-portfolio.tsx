import { Knowloadge } from "@prisma/client"
import { getSession } from "next-auth/react"
import { AdminLayout } from "../../../app/layouts/AdminLayout"
import { PageTitle } from "../../../app/parts/Admin/Comps"
import { EditPortfolioForm, KnowledgeSection, SavePortfolio } from "../../../app/parts/Admin/EditPortfolio"
import { Store } from "../../../app/utils/store"
import { ContactService } from "../../../src/services/Contact"
import { KnowledgeService } from "../../../src/services/knowledge"
import { Notification } from "../../../src/services/Notification"
import { PortfolioService } from "../../../src/services/Portfolio"


export const portfolioStore=new Store()
export const portfolioKey="portfolio"

export default function PortfolioEdit({data, details}:{data:Knowloadge[], details:any}){

    return(
        <div className="flex h-full md:flex-row flex-col overflow-y-auto xl:overflow-hidden">
            <div className="md:h-full w-full md:p-10 !pb-0 md:pr-2 flex flex-col p-6 ">
                <PageTitle>Edition du portfolio</PageTitle>
                <div className="py-8  mb-0 pb-2 pr-2 overflow-y-auto ">
                    <div className="w-full">
                        <EditPortfolioForm data={details}/>
                        <KnowledgeSection data={data}/>
                    </div>
                    
                </div >
            </div>
            <div className="md:h-full md:w-1/3">
                <SavePortfolio/>
            </div>
        </div>
    )
}

PortfolioEdit.getLayout=(page:any, layoutProps:any)=>{
    return(
        <AdminLayout layoutProps={layoutProps}>
            {page}
        </AdminLayout>
    )
}

export const getServerSideProps=async (ctx:any)=>{
    const session=await getSession({req:ctx.req})
    if(session){
        const knowloedgeService=new KnowledgeService()
        const portfolioService=new PortfolioService()
        return{
            props:{
                data:await knowloedgeService.getAll(),
                details:(await portfolioService.getPortfolioData())?.data,
                layoutProps:{
                    unreadMessages:(await (new ContactService()).getAllContactMessages({read:false})).length,
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