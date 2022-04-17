import { Tab, TabBody, TabHead, TabHeader, TabPanel } from "../../../app/components/Tabs";
import { AdminLayout } from "../../../app/layouts/AdminLayout";
import { PageTitle } from "../../../app/parts/Admin/Comps";
import { ConfidentialityForm, SecurityForm } from "../../../app/parts/Admin/Settings";
import { ContactService } from "../../../src/services/Contact";
import { Notification } from "../../../src/services/Notification";
import { PortfolioService } from "../../../src/services/Portfolio";
import { getUser } from "../../api/auth/[...nextauth]";

export default function Settings(props:{
    accountEmail: string;
    rootEmail: any;
    confidentiality: any;
}){
    return(
        <div className="flex h-full md:flex-row flex-col overflow-y-auto xl:overflow-hidden">
            <div className="md:h-full w-full md:p-10 !pb-0 md:pr-2 flex flex-col p-6 ">
                <PageTitle>Paramètres</PageTitle>
                <div className="py-8  mb-0 pb-2 px-2 overflow-y-auto ">
                    <Tab>
                        <TabHead className="border-b">
                            <TabHeader>Confidentialité</TabHeader>
                            <TabHeader>Sécurité</TabHeader>
                        </TabHead>
                        <TabBody>
                            <TabPanel>
                                <ConfidentialityForm defaultValue={props.confidentiality}/>
                            </TabPanel>
                            <TabPanel>
                                <SecurityForm accountEmail={props.accountEmail} rootEmail={props.rootEmail}/>
                            </TabPanel>
                        </TabBody>
                    </Tab>
                </div >
            </div>
        </div>
    )
}

Settings.getLayout=(page:any, layoutProps:any)=>{
    return(
        <AdminLayout layoutProps={layoutProps}>
            {page}
        </AdminLayout>
    )
}

export const getServerSideProps=async(ctx:any)=>{
    const user=await getUser(ctx.req)
    if(user){
        const portfolioService=new PortfolioService()
        return{
            props:{
                ...await portfolioService.getSettings(),
                accountEmail:user.email,
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