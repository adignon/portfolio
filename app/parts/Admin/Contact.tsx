import React, { HTMLAttributes, useMemo } from "react"
import {  MdCircle, MdFlag, MdOutlineApps, MdSearch, MdRefresh, MdDelete, MdBadge, MdArrowBack} from "react-icons/md"
import {IconBaseProps} from "react-icons"
import { clx } from "../../utils/comp"
import { useRouter } from "next/router"
import { Checkbox, ICheckbox } from "../../components/Input/Checkbox"
import { Button, IconButton, CTAButton } from "../../components/Button"
import { Drawer } from "../../components/Drawer"
import { Store, useStore } from "../../utils/store"
import { Alert } from "../../components/Alert"
import { ContactMessage } from "@prisma/client"
import { formatDistanceToNow, format } from "date-fns"
import Fr from "date-fns/locale/fr"
import S from "string"
import axios from "axios"
import { Backdrop } from "../../components/Backdrop"
import { Modal, ModalBody, ModalFooter, ModalHeader } from "../../components/Modal"
import Link from "next/link"
import Image from "next/image"

const mailStore=new Store()
const storeKey="mail"



const FLAGS_ROUTE:any={
    PENDING_REVIEW :"pending",REVIEWED:"resolved", IMPORTANT:"importants",
}

interface IContactMenuListItem extends HTMLAttributes<HTMLDivElement>{
    leftIcon:{
        icon:React.FC
    } & IconBaseProps,
    children: React.ReactNode,
    flag?:React.ReactNode
    flagProps?:HTMLAttributes<HTMLSpanElement>
    activeClassName?:string
    basePath:string
    href:string
}
const ContactMenuListItem=({className,activeClassName,  basePath, href,  children,flagProps, flag, leftIcon:{icon,children:iconChildren, ...iconProps}}:IContactMenuListItem)=>{
    const {className:flagClass, ...flagProp}=flagProps??{}
    const router=useRouter()
    const matche=new RegExp((basePath+href).replace("*", "(.*?)")).test(router.asPath[router.asPath.length -1]==="/" ?router.asPath : router.asPath +"/")
    return(
        <Link href={(basePath+href).replace("*", "")}>
            <a>
            <div className={clx("flex justify-between p-2 px-4 hover:cursor-pointer hover:bg-gray-100 font-medium", className, matche ?( activeClassName ??""):"")}>
                <div className="flex items-center">
                    <div className="mr-4">
                        {React.createElement(icon, {...((iconProps as any) ??{})})}
                    </div>
                    <p>{children}</p>
                </div>
                <div>
                {
                    flag ?
                    <span {...flagProp} className={clx("p-1 rounded-full bg-red-100 text-xs text-red-500 px-1.5", flagClass)} style={{fontSize:"0.8rem"}}>4</span>
                    :<></>
                }
                </div>
            </div>
            </a>
        </Link>
    )
}
export const ContactMenu=()=>{
    //importants resolved pending
    return(
        <div className="py-8">
            <ContactMenuListItem
                basePath="/admin/secure/contact-emails"
                activeClassName="bg-gray-200"
                href="/all"
                leftIcon={{
                    icon:MdCircle,
                    className:"text-sm text-primary"
                }}
            >Tout</ContactMenuListItem>
            <ContactMenuListItem
                basePath="/admin/secure/contact-emails"
                activeClassName="bg-gray-200"
                href="/importants/*"
                leftIcon={{
                    icon:MdCircle,
                    className:"text-sm text-red-400"
                }}
            >Important</ContactMenuListItem>
            <ContactMenuListItem
                activeClassName="bg-gray-200"
                basePath="/admin/secure/contact-emails"
                href="/resolved/*"
                leftIcon={{
                    icon:MdCircle,
                    className:"text-sm text-green-400"
                }}
            >Résolu</ContactMenuListItem>
            <ContactMenuListItem
                basePath="/admin/secure/contact-emails"
                href="/pending/*"
                activeClassName="bg-gray-200"
                leftIcon={{
                    icon:MdCircle,
                    className:"text-sm text-yellow-400"
                }}
            >En Attente</ContactMenuListItem>
        </div>
    )
}

export const MailList=( {contacts:contact,name, mailCheckRowKey, mailCheckRowStore}:{mailCheckRowKey:string, mailCheckRowStore:any,contacts:ContactMessage, name:string})=>{
    const date=new Date(contact.createdAt)

    return(
        <div className={"flex p-4 items-center border-b hover:shadow cursor-pointer "+(contact.read ? "":"bg-[#ff000008]")}>
            <div>{/*<RowCheckbox mailCheckRowKey={mailCheckRowKey} mailCheckRowStore={mailCheckRowStore} name={name}/>*/}</div>
            <Link href={"/admin/secure/contact-emails/"+(contact.badge==="IMPORTANT" ? "importants": (contact.badge==="PENDING_REVIEW" ? "pending": "resolved"))+"/"+contact.id}>
                <a className="w-full">
                <div className="flex md:items-center flex-col md:flex-row w-full">
                    <p className="font-medium text-lg ml-4 shrink-0">{contact.senderFullname.split(' ').map((s)=>S(s).capitalize().s).join(" ")}</p>
                    <div className="flex items-center md:flex px-2">
                        {
                            contact.badge==="IMPORTANT" ?
                            <div className="ml-2">
                                <p className="px-2 py-1 text-red-400 rounded-full bg-red-100 text-xs">Important</p>
                            </div>:<></>
                        }
                        {
                            contact.badge=="PENDING_REVIEW" ?
                            <div className="ml-2">
                                <p style={{width:"max-content"}} className="px-2 py-1 text-yellow-400 rounded-full bg-yellow-100 text-xs">En Attente</p>
                            </div>:<></>
                        }
                        {
                            contact.badge=="REVIEWED" ?
                            <div className="ml-2">
                                <p className="px-2 py-1 text-green-400 rounded-full bg-green-100 text-xs">Résolu</p>
                            </div>:<></>
                        }
                    </div>
                    <div className="overflow-hidden flex  justify-between  w-full ml-4 md:ml-2 " >
                        <p className="  truncate  h-6 " >
                            {contact.title}
                        </p>
                        <p className=" px-2 text-sm " style={{whiteSpace:"nowrap"}}>
                            {formatDistanceToNow(date, {locale:Fr})}
                        </p>
                    </div>
                    
            </div>
                </a>
            </Link>
        </div>
        
    )
}

export const MailListSearch=({store, storeKey}:{store:Store, storeKey:string})=>{
    const [text, setText]=React.useState("")
    React.useEffect(()=>{
        store.setItem(storeKey, {...(store.getItem(storeKey)??{}), searchText:text})
    }, [text])
    return(
        <input
            className="w-full h-full px-12 outline-none"
            placeholder="Rechercher un mail"
            onChange={(e)=>setText(e.target.value)}
            value={text}
        />
    )
}

export const MailListing=({contacts, mailCheckRowKey, mailCheckRowStore}:{contacts:ContactMessage[], mailCheckRowKey:string, mailCheckRowStore:Store})=>{
    const [openApp, setOpenApp]=React.useState(false)
    const searchText=useStore(storeKey, mailStore, (store)=>store?.searchText) 
    const list=useMemo(()=>{
        if(searchText && typeof searchText ==="string"){
            return contacts.filter((c)=>c.title.toLowerCase().includes(searchText.toLowerCase()))
        }
        return contacts
    }, [searchText, contacts])
    const globalCheckbox="global-list"

    //Initialize state value
    mailCheckRowStore.setItem(mailCheckRowKey, {
        [globalCheckbox]:false
    }, false)
    return(
        <div className="h-full flex relative">
            <div className="flex flex-col w-1/4 border-r pt-8 md:flex hidden">
                <div className="h-full overflow-y-auto my-4">
                    <ContactMenu/>
                </div>
            </div>
            <div>
                <Drawer open={openApp} onClose={()=>setOpenApp(false)}>
                    <div className=" pt-8 w-64">
                        <div className="px-4 flex justify-center ">
                            <Button fullWidth>Composer</Button>
                        </div>
                        <div className="h-full overflow-y-auto my-4">
                            <ContactMenu/>
                        </div>
                    </div>
                </Drawer>
            </div>
            <div className="w-full flex flex-col md:w-3/4">
                <div className="h-14 border-b w-full flex relative">
                    <div className="flex items-center md:px-2 pl-8 pr-2 md:hidden">
                        <IconButton onClick={()=>setOpenApp(true)}>
                            <MdOutlineApps/>
                        </IconButton>
                    </div>
                    <div className="w-full py-2">
                       <div className=" py-2">
                            <MdSearch className="absolute top-1/2 ml-4 -translate-y-1/2 text-xl text-primary "/>
                            <MailListSearch
                                    store={mailStore} storeKey={storeKey}
                            />
                       </div>
                    </div>
                </div>
                {/*
                    list.length ?
                    <div className="flex justify-between items-center px-4 border-b !h-12">
                        <div><RowCheckbox mailCheckRowKey={mailCheckRowKey} mailCheckRowStore={mailCheckRowStore} name={globalCheckbox}/>}</div>
                        <div className="flex">
                            <DeleteList contacts={list} mailCheckRowKey={mailCheckRowKey} mailCheckRowStore={mailCheckRowStore}/>
                            <IconButton><MdRefresh/></IconButton>
                        </div>
                    </div>
                :<></>
                */}
                <div className="h-full overflow-y-auto " >
                    {
                        (()=>{
                            const d:any={}
                            const lists= list.map((m, i)=>{
                                const name='contact-'+i
                                d['contact-'+i]=false
                                return (
                                    <MailList mailCheckRowKey={mailCheckRowKey} mailCheckRowStore={mailCheckRowStore} name={name} key={m.id} contacts={m}/>
                                )
                            })
                            const data=mailCheckRowStore.getItem(mailCheckRowKey)

                            mailCheckRowStore.setItem(mailCheckRowKey, {...data, ...d}, false)
                            return lists
                        })()
                    }
                    {
                        !list.length ?
                        <div className="relative h-1/4 ">
                            <div className="absolute w-full top-1/2 -translate-y-1.2 text-center flex justify-center">
                                <div className="text-center">
                                    <Image alt=""  src="/assets/images/undraw_void_-3-ggu.svg" className="h-72 block"/>
                                    <p className="mt-4 text-gray-500">Aucun méssage trouvé</p>
                                </div>
                            </div>
                        </div>:<></>
                    }
                </div>
            </div>
        </div>
    )
}

const DeleteList=({contacts, mailCheckRowKey, mailCheckRowStore}:{contacts:any, mailCheckRowKey:string, mailCheckRowStore:any})=>{
    const listFields=useStore(mailCheckRowKey, mailCheckRowStore, (store:any)=>store) 
    const globalList:any=Object.keys(listFields).find((k)=>k.includes("global"))
    let deleteContacts=listFields[globalList] ? contacts : []
    const [openModal, setOpen]=React.useState(false)
    if(!listFields[globalList] ){
        deleteContacts=Object.keys(listFields).filter((k)=>{
            return !k.includes("global") && Boolean(listFields[k])
        }).map((k)=>contacts[Number(k.slice(k.indexOf('-')+1))])
    }
    const router=useRouter()
    return(
        <>
            {
                Boolean(deleteContacts.length)?<IconButton onClick={()=>setOpen(true)}  className="text-red-500"><MdDelete/></IconButton>:<></>
            }
            <DeleteModal 
                open={openModal} 
                deleteContacts={deleteContacts}
                onCancel={()=>{
                    setOpen(false)
                }}
                onConfirm={()=>{
                    setOpen(false)
                    router.reload()
                }}
            />
        </>
    )
}



interface RowCheckbox extends ICheckbox{
    name:string,
    mailCheckRowKey:string, mailCheckRowStore:any
}
export const RowCheckbox=({mailCheckRowKey, mailCheckRowStore, ...props}:RowCheckbox)=>{
    const listFields=useStore(mailCheckRowKey, mailCheckRowStore, (store:any)=>{

        if(store[props.name]){

            if(typeof store==="object"){
                const listFields:any={}
                if(props.name.includes("global")){
                    store
                }else{
                    Object.keys(store).filter((k)=>k.includes("global") || k===props.name).forEach((k)=>listFields[k]=store[k])
                }
                
                return listFields;
            }
            
        }else{

            return store
        }
        
    })

    return(
        <Checkbox {...props} checked={listFields[props.name]} name={props.name} onChange={(e)=>{
            let storeItems=Boolean (mailCheckRowStore?.getItem(mailCheckRowKey)) ? mailCheckRowStore?.getItem(mailCheckRowKey) :{}
            storeItems={...storeItems, [props.name]:e.target.checked}
            if(props.name.includes("global")){
                let editeditems:any={
                    [props.name]:listFields[props.name]===undefined  ? false : e.target.checked
                }
                Object.keys(storeItems).filter((k)=>!k.includes("global")).forEach((k)=>{
                    editeditems[k]= editeditems[props.name]
                })
                storeItems={
                    ...storeItems,
                    ...editeditems
                }
            }else{
                let editeditems:any={}
                const objs=Object.keys(storeItems).filter((k)=>!k.includes("global"))
                const checkedEls=objs.filter((o)=>storeItems[o])
                const unCheckedEls=objs.filter((o)=>!storeItems[o])
                const result= unCheckedEls.length === 0 ? true : (checkedEls.length === 0 ? false : undefined)
                
                Object.keys(storeItems).filter((k)=>k.includes("global")).forEach((k)=>{
                    editeditems[k]=result
                })
                storeItems={
                    ...storeItems,
                    ...editeditems
                }
            }

         mailCheckRowStore.setItem(mailCheckRowKey, {...storeItems})
            e.stopPropagation()
        }}/>
    )
}

interface IDeletModal{
    open:boolean,
    onCancel:Function,
    onConfirm:Function
    deleteContacts:any
}
export const DeleteModal=({open=false,deleteContacts, onCancel, onConfirm}:IDeletModal)=>{
    const [state, setState]=React.useState(undefined as any)


    const handleDelete=async ()=>{
        try{
            setState(null)
            const data=await axios.post("/api/contacts/delete",{
                data:deleteContacts
            })

            onConfirm()
        }catch(e){
            setState(false)
        }
    }
    return(
       
        <Backdrop open={open}> 
            <div className="w-full md:max-w-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:max-w-xl sm:max-w-xs ">
                {
                    state===false ?
                    <div className="mb-4">
                        <Alert theme="danger" onClose={()=>setState(undefined)}>
                            Une erreur est survenue. Veillez rééssayer!
                        </Alert>
                    </div>
                    :<></>
                }
                <Modal >
                    <ModalHeader>Confirmation de suppression</ModalHeader>
                    <ModalBody>
                        Voulez-vous vraiment supprimer {deleteContacts.length > 1 ? "ces messages": "ce message"} ? Notez que cette action est irréversible.
                    </ModalBody>
                    <ModalFooter className="flex justify-end">
                        <Button onClick={onCancel as any} className="mr-4 bg-gray-500">Annuler</Button>
                        <CTAButton loading={state===null} onClick={  handleDelete  } className="flex-nowrap flex bg-red-500">Supprimer</CTAButton>
                    </ModalFooter>
                </Modal>
            </div>
        </Backdrop>
    )
}

export const MailContent=({contact}:{contact:ContactMessage})=>{
    const [openApp, setOpenApp]=React.useState(false)
    const router=useRouter()
    const ChangeFlag=()=>{
        const badges=[
            "IMPORTANT",
            "PENDING_REVIEW",
            "REVIEWED"
        ]
        const getbtn=(badge:any, props={})=>(
            <IconButton className={badge==="IMPORTANT" ?"text-red-500":(badge==="PENDING_REVIEW" ? "text-yellow-500":"text-green-500")}  {...props} >
                <MdFlag />
            </IconButton>
        )
        const [openNested, setOpen]=React.useState(false)
        const changeFlag=async(badge:string)=>{
            try{
                await axios.patch("/api/contacts", {
                    id:contact.id,
                    badge
                })

                router.push("/admin/secure/contact-emails/"+FLAGS_ROUTE[badge as any]+"/"+contact.id)
            }catch(e){
                console.log(e)
            }
        }

        return(
            <div>
                <div className="relative group">
                    {getbtn(contact.badge, {
                        onClick:()=>{
                            setOpen(prev=>!prev)
                        }
                    })}
                    <div className={"absolute hidden shadow group-hover:block   bg-white p-2 right-0 rounded-lg"+(openNested?" !block":"")}>
                        {
                            badges.filter(b=>b!==contact.badge).map((b)=>(
                                <React.Fragment key={b}>{getbtn(b, {
                                    onClick:()=>changeFlag(b)
                                })}</React.Fragment>
                            ))
                        }
                    </div>
                </div>

            </div>
        )
    }
    const DeleteAction=()=>{
        const [openModal, setOpenModal]=React.useState(false)
        return(
            <>
                <IconButton onClick={()=>setOpenModal(true)}>
                    <MdDelete/>
                </IconButton>
                <DeleteModal 
                    open={openModal} 
                    deleteContacts={[contact]}
                    onCancel={()=>{
                        setOpenModal(false)
                    }}
                    onConfirm={()=>{
                        setOpenModal(false)
                        router.back()
                    }}
                />
            </>
        )
    }
    const title=contact.title
    const description=contact.message
    return(
        <div className="h-full flex relative">
            <div className="flex flex-col w-1/4 border-r pt-8 md:flex hidden">
                <div className="h-full overflow-y-auto my-4">
                    <ContactMenu/>
                </div>
            </div>
            
            <div>
                <Drawer open={openApp} onClose={()=>setOpenApp(false)}>
                    <div className=" pt-8 w-64">
                        <div className="px-4 flex justify-center ">
                            <Button fullWidth>Composer</Button>
                        </div>
                        <div className="h-full overflow-y-auto my-4">
                            <ContactMenu/>
                        </div>
                    </div>
                </Drawer>
            </div>
            <div className="w-full flex flex-col md:w-3/4">
                <div className="h-14 border-b w-full flex relative justify-between items-center">
                    <div className=" w-7/12 md:w-10/12 mx-2">
                        <IconButton className="" onClick={()=>{
                            router.push(router.asPath.slice(0, router.asPath.lastIndexOf("/")))
                        }}><MdArrowBack/></IconButton>
                    </div>
                    <div className="flex items-center md:px-2 pl-8 pr-2 md:hidden w-2/12">
                        <IconButton onClick={()=>setOpenApp(true)}>
                            <MdOutlineApps/>
                        </IconButton>
                    </div>
                    
                    <div className="flex items-center mr-8 md:mr-4 w-3/12 md:w-2/12 flex justify-end">
                        <ChangeFlag/>
                        <DeleteAction/>
                    </div>
                </div>
                <div className="h-full overflow-y-auto p-4 ">
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4">
                        <div>
                            <p className="font-semibold text-primary">{contact.senderFullname.split(" ").map((s)=>S(s).capitalize().s)}</p>
                            <p className=" text-sm text-gray-400">{contact.senderEmail}</p>
                        </div>
                        <p className="text-gray-400 text-xs">{formatDistanceToNow(new Date(contact.createdAt), {locale:Fr})}</p>
                    </div>
                    <div className="pt-4">
                        <p className="text-lg mb-4">{title}</p>
                        <p className=" text-sm">{description}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}