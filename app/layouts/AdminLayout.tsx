import { Button, IconButton } from "../components/Button"
import { AuthContextProvider } from "../contexts/AuthContext"
import { Sidebar } from "../parts/Admin/Sidebar"
import React from "react"
import { useResize } from "../utils/hooks/useResize"
import { Logo } from "../components/Logo"
import { Drawer } from "../components/Drawer"
import { MdClose, MdMenu, MdNotifications } from "react-icons/md"
import { PageDataProvider } from "../contexts/PageDataProvider"
import { Notification } from "@prisma/client"
import { NotificationList } from "../parts/Admin/Notification"



export interface IAdminLayout{
    children:React.ReactNode,
    layoutProps:{ unreadMessages: number, unreadNotifications: Array<Notification> }
}




export const AdminLayout=({children, layoutProps}:IAdminLayout)=>{
    const isLg:any=useResize("lg", "up")
    const [openDrawer, setOpenDrawer]=React.useState(false)
    const [openNotDrawer, setOpenNotDrawer]=React.useState(false)
    const baseSecurePath="/admin/secure"
    const [notifications, setNotifications]=React.useState(layoutProps.unreadNotifications)
    return(
        <AuthContextProvider >
            <PageDataProvider>
               <div className="h-screen w-screen overflow-x-hidden">
               <div className="flex h-screen w-screen">
                    <style jsx global>{`
                        body{
                            background:#F3FDFF;
                            overflow:hidden;
                        }
                    `}</style>
                    <div className="lg:w-1/4">
                        <div className="hidden lg:block ">
                            <Sidebar layoutProps={layoutProps} basePath={baseSecurePath}/>
                        </div>
                        <div className="block lg:hidden">
                            <Drawer open={openDrawer} onClose={()=>setOpenDrawer(false)}>
                                <Sidebar layoutProps={layoutProps} basePath={baseSecurePath}/>
                            </Drawer>
                        </div>
                    </div>
                    <div className="w-full flex flex-col lg:w-3/4">
                        {/* Mobile header */}
                        <div className="lg:hidden h-14 flex justify-between items-center px-2">
                            <div className="flex justify-start ">
                                <div>
                                    <IconButton onClick={()=>setOpenDrawer(true)}><MdMenu/></IconButton>
                                </div>
                            </div>
                            <div className="pt-2 pb-4">
                                <Logo/>
                            </div>
                            <div className="relative">
                                <IconButton className="text-gray-600 text-2xl " onClick={()=>setOpenNotDrawer(true)}>
                                <MdNotifications/>
                                
                                </IconButton>
                                {
                                    notifications.length ?
                                    <span className="absolute px-1 py-0.5 rounded-full bg-red-500 text-white top-0 text-xs left-0">{notifications.length}</span>
                                    :<></>
                                }
                            </div>
                        </div>
                        {/* Destokp header */}
                        <div className="hidden lg:flex h-14  justify-between items-center px-2">
                            <div></div>
                            <div className="relative">
                                <IconButton className="text-gray-600 text-2xl" onClick={()=>setOpenNotDrawer(true)} ><MdNotifications/></IconButton>
                                {
                                    notifications.length ?
                                    <span className="absolute px-1 py-0.5 rounded-full bg-red-500 text-white top-0 text-xs left-0">{notifications.length}</span>
                                    :<></>
                                }
                            </div>
                        </div>
                        {/* Content  */}
                        <div className="bg-white h-full  md:shadow shadow-md overflow-hidden" style={{borderRadius:isLg ? "50px 0px  0px 0px" : "25px 25px 0px 0px"}}>
                            {children}
                        </div>
                    </div>
                </div>
                <Drawer containerProps={{className:"!bg-[#0000003d]"}} open={openNotDrawer} position="right" onClose={()=>setOpenNotDrawer(false)}>
                    <div className="sm:w-72 w-full h-full flex flex-col">
                        <div className="flex p-2 border-b  h-16 shadow">
                            <IconButton onClick={()=>setOpenNotDrawer(false)}><MdClose/></IconButton>
                            <div className="py-2 px-4  text-xl ">Notifications</div>
                        </div>
                        <div className="h-full overflow-y-auto">
                            <NotificationList setItems={setNotifications} items={notifications}/>
                        </div>
                        <div className="h-18">
                            <Button className="shadow-none !bg-transparent h-full rounded-none border-t !text-gray-500" fullWidth>Effacer Tout</Button>
                        </div>
                    </div>
                </Drawer>
               </div>
            </PageDataProvider>
        </AuthContextProvider>
    )
}

interface IContactAdminLayout extends IAdminLayout{
    children:React.ReactNode,
    
}

export const ContactAdminLayout=({children, layoutProps}:IContactAdminLayout)=>{
    return(
        <AdminLayout layoutProps={layoutProps}>
                {children}
        </AdminLayout>
    )
}