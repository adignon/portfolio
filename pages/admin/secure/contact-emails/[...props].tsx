import { getSession } from "next-auth/react"
import React from "react"
import { ContactService } from "../../../../src/services/Contact"
import { ContactAdminLayout} from "../../../../app/layouts/AdminLayout"
import { MailContent, MailListing } from "../../../../app/parts/Admin/Contact"
import Joi from "joi"
import {Store} from "../../../../app/utils/store"
import { Notification } from "../../../../src/services/Notification"
 const ContactEmail=(props:any)=>{
    const store=new Store()
    const storeKey="listing-key"
    
    return(
        props.contacts instanceof Array ?
        <MailListing contacts={props.contacts ??[]} mailCheckRowKey={storeKey} mailCheckRowStore={store}/>
        :
        <MailContent contact={props.contacts}/>
    )
}

ContactEmail.getLayout=(page:any, layoutProps:any)=>{
    return(
        <ContactAdminLayout layoutProps={layoutProps}>
            {page}
        </ContactAdminLayout>
    )
}

export const getServerSideProps=async (ctx:any)=>{

    try{
        const session=await getSession({req:ctx.req})

        if(session && (ctx.params.props.length === 1 || ctx.params.props.length === 2) && ["all", "importants", "resolved", "pending"].includes(ctx.params.props[0]) && (!ctx.params.props[1] || !((Joi.string().uuid().validate(ctx.params.props[1])['error'])))){
            const contactservice=new ContactService()
            
            const contacts=(await contactservice.getAllContactMessages()).map((c)=>({
                ...c,
                createdAt:(new Date(c.createdAt)).getTime()
            }))
            
            let toSendContact:any=contacts
            
            if(ctx.params.props.length === 1){
                //"importants", "resolved", "pending" //IMPORTANT PENDING_REVIEW REVIEWED
                let flag=""
                flag=ctx.params.props[0] ==="importants" ?"IMPORTANT":flag
                flag=ctx.params.props[0] ==="pending" ?"PENDING_REVIEW":flag
                flag=ctx.params.props[0] === "resolved" ?"REVIEWED":flag
                toSendContact=ctx.params.props[0]!=="all" ? toSendContact.filter((c:any)=>c.badge===flag) : contacts
            
            }

            if(ctx.params.props[1]){
                const contact=await contactservice.getContactMessage(ctx.params.props[1])
                if(contact){
                    toSendContact=toSendContact.find((c:any)=>c.id===ctx.params.props[1])
                }else{
                    return {
                        notFound:true
                    }
                }
            }

            return{
                props:{
                    contacts:toSendContact,
                    layoutProps:{
                        unreadMessages:(await contactservice.getAllContactMessages({read:false})).length,
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
    }catch(e){
        return {
            notFound:true
        }
    }
    
}

export default ContactEmail;