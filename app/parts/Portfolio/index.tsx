import format from "date-fns/format"
import { fr } from "date-fns/locale"
import React, { HTMLAttributes, useMemo } from "react"
import { MdMenu, MdClose, MdDone } from "react-icons/md"
import S from "string"
import { IconButton, Button } from "../../components/Button"
import { Backdrop } from "../../components/Backdrop"
import { Modal, ModalHeader, ModalBody } from "../../components/Modal"
import { BsGithub } from "react-icons/bs"
import { clx, pp } from "../../utils/comp"
import style from "./style.module.css"
import { GridContainer, Grid } from "../../components/Grid"
import axios from "axios"
import { DetailType, KnowledgesType, ProjectType } from "../../../pages"
import { getProgess } from "../Admin/Projects"
import { Store } from "../../utils/store"
import { CTAButtonValid, DescriptionFieldForm, TextFieldForm } from "../Admin/AddProjectForm"
import Joi from "joi"
import Typewriter from 'typewriter-effect';
import ViewProject from "../../../pages/admin/secure/projects/[id]"
import { IntercectionDisplayer } from "../../components/Displayer"
import Image from "next/image"
/*
 whoAmIRef: null;
    knowLedgeRef: null;
    projetsRef: null;
    contactFormRef: null; */
export const Menu=({refs}:{refs:any})=>{
    const [open, setOpen]=React.useState(false)
    const [showMenu, setShowMenu]=React.useState(false)
    React.useEffect(()=>{
        if(open){
            const timer=setTimeout(()=>{
                console.log("setTimeout called")
                setShowMenu(true)
            }, 200)
            return ()=>clearTimeout(timer)
        }
    }, [open])
    return(
        <div className="absolute md:static right-0 md:w-2/5 xl:w-4/12 lg: pl-10">
            <div style={{transition:"width 200ms, height 200ms", zIndex:20}} className={"mt-4 md:mt-0 fixed w-12 h-12 md:!w-auto md:!h-auto !-top-4 "+(open?"z-10  !w-full !h-full":"")+" top-0 right-0 md:static bg-primary text-white   rounded-l-full rounded-br-full "} >
                <div className={"hidden md:flex flex-col justify-between items-center  md:py-14 lg:py-20 text-xl text-center  lg:text-2xl "+(showMenu ? "!flex  !justify-center h-full":"")}>
                    <MenuLink onClick={()=>{
                        if(Boolean(refs.top.current)){
                            refs.top.current.scrollIntoView({behavior:"smooth", block:"start"})
                        }
                         if(showMenu){
                            setShowMenu(false)
                        }
                        setOpen(prev=>!prev)
                    }}>Home</MenuLink>
                    <MenuLink onClick={()=>{
                        if(Boolean(refs.whoAmIRef)){
                            refs.whoAmIRef.scrollIntoView({behavior:"smooth", block:"start"})
                        }
                         if(showMenu){
                            setShowMenu(false)
                        }
                        setOpen(prev=>!prev)
                    }}>Who Am I ?</MenuLink>
                    <MenuLink onClick={()=>{
                        if(Boolean(refs.knowLedgeRef)){
                            refs.knowLedgeRef.scrollIntoView({behavior:"smooth", block:"start"})
                        }
                         if(showMenu){
                            setShowMenu(false)
                        }
                        setOpen(prev=>!prev)
                    }}>My Skills</MenuLink>
                    <MenuLink onClick={()=>{
                        if(Boolean(refs.projetsRef)){
                            refs.projetsRef.scrollIntoView({behavior:"smooth", block:"start"})
                        }
                         if(showMenu){
                            setShowMenu(false)
                        }
                        setOpen(prev=>!prev)
                    }}>My Projets & Works</MenuLink>
                    <MenuLink onClick={()=>{
                        if(Boolean(refs.contactFormRef)){
                            refs.contactFormRef.scrollIntoView({behavior:"smooth", block:"start"})
                        }
                         if(showMenu){
                            setShowMenu(false)
                        }
                        setOpen(prev=>!prev)
                    }}>Contacte Me</MenuLink>
                </div>
                <div className={"md:hidden  absolute right-1 top-0 pl-2"}>
                    <IconButton onClick={()=>{
                        if(showMenu){
                            setShowMenu(false)
                        }
                        setOpen(prev=>!prev)
                    }}>
                        {
                            open ? <MdClose/>:<MdMenu/>
                        }
                    </IconButton>
                </div>
            </div>
        </div>
    )
}

export const MenuLink=({children, className, onClick}:{children:React.ReactNode, className?:string, onClick:Function})=>{
    return(
        <div onClick={onClick as any} className={clx(style.link, "mb-4  font-nunito-bold  ", className)}>{children}</div>
    )
}

export const PageHeader=({knowledge, refs}:{knowledge:KnowledgesType, refs:any})=>{
    const Timer=()=>{
        const [currentTime, setCurrentTime]=React.useState(Date.now())
        React.useEffect(()=>{
            const timer=setTimeout(()=>{
                setCurrentTime(Date.now())
            }, 1000*60)
            return ()=>clearTimeout(timer)
        }, [])
        const d=format(new Date(currentTime), "HH:mm", {locale:fr})
        return(
            <span className="absolute top-4 left-1/2 -translate-x-1/2"><span className="font-medium">{d.split(" ").map((v)=>S(v).capitalize().s).join(" ")}</span></span>
        )
    }
    const knowledges=knowledge.length ?  
    knowledge.map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value.title) : ["SYMFONY"]

    
    return(
        <div className=" " style={{fontSize:20}} >
            <div className="flex justify-between md:p-4 p-2 relative">
                {/* Logo */}
                <div className="font-pacifico-regular text-3xl">Adignon</div>

                {/* Timer */}
                <div>
                    <Timer/>
                </div>
                {/* Modile icon */}
            </div>
            <div className="flex relative -top-header-desktop ">
                {/* First section */}
                <div className="w-full xl:w-8/12 md:w-2/3  justify-between pt-header px-4 ">
                    <div className="py-12">
                        <p className="text-3xl sm:text-3xl md:text-4xl font-pacifico-regular xl:text-5xl lg:text-4xl" >I am</p>
                        <div>
                        <p className="text-6xl sm:text-8xl md:text-8xl lg:text-9xl my-4   text-secondary-500 font-nunito-semibold">
                            <Typewriter
                                options={{
                                    loop:true
                                }}
                                onInit={(typewriter) => {
                                    let type=typewriter
                                    knowledges.forEach((k, i)=>{
                                        type=type
                                        .typeString(k)
                                        .pauseFor(5000)
                                        .deleteAll()
                                    
                                    })
                                    type
                                    .start()
                                }}
                            />
                        </p>
                        </div>
                        <p className="text-4xl sm:text-5xl md:text-7xl font-nunito-semibold mt-2" >Developer.</p>
                    </div>
                </div >
                {/* Desktop Menu  */}
                <Menu refs={refs}/>
            </div>
            <div className="relative -top-header-desktop md:top-0">
                <Divider/>
            </div>
        </div>
    )
}

const Divider=()=>{
    return(
        <svg width="100%" height="35.438232px" viewBox="0 0 1440 35.438232" version="1.1"  xmlns="http://www.w3.org/2000/svg">
            <path d="M0 2.5L84.0877 32.9382L161.669 2.5L264.776 32.9382L345.36 2.5L424.442 32.9382L502.023 2.5L602.128 32.1866L674.703 2.5L779.813 32.1866L861.899 2.5L951.992 32.1866L1019.06 2.5L1100.15 32.1866L1163.21 2.5L1240.29 32.1866L1298.85 2.5L1377.94 32.1866L1440 2.5" id="Line" fill="none" fillRule="evenodd" stroke="#1BD5FF" strokeWidth="5" strokeLinecap="square" />
        </svg>
    )
}

export const SessionTitle=({children}:{children:React.ReactNode})=>{
    return(
        <div className="flex justify-center my-8 md:my-16 relative">
            <div className={clx(style.underline, "text-2xl text-primary after:!w-24 after:!-bottom-3 after:!h-1.5 md:text-3xl md:text-5xl  font-nunito-bold after:bg-primary sm:after:!w-32 sm:after:!-bottom-4 sm:after:!h-2 after:rounded-full")}>
                {children}
            </div>
        </div>
    )
}

export const WhoAmISession=({details, setRef}:{details:DetailType, setRef:Function})=>{
    const ref:any=React.useRef()
    React.useEffect(()=>{
        if(ref?.current){
            setRef(ref?.current)
        }
    },[ref])
    return(
        <div ref={ref} className="pt-10 md:pt-4">
            <div  className="relative -top-header-desktop md:top-0">
            <div className="">
                <SessionTitle>WHO AM I ?</SessionTitle>
                </div>
                <div className="flex flex-col  md:flex-row">
                    <div className="w-full md:w-2/5  ">
                        <div className="rounded-bl-full overflow-hidden rounded-full md:rounded-tl-none rounded-r-full ">
                            <Image alt=""  src={details.media?.fullPath as string} className="object-cover w-full max-w-xxs md:max-w-xl rounded-full md:rounded-none mx-auto md:mx-0"/>
                        </div>
                    </div>
                    <div className="w-full md:w-3/5 px-4 md:pl-8 text-center md:text-left my-4 md:my-0">
                        <p className="text-3xl sm:text-4xl md:text-5xl font-nunito-bold text-secondary">{details.subslogan ?? "Hey I'm Adignon!"}</p>
                        <p className="text-4xl smtext-5xl md:text-6xl font-nunito-bold text-secondary my-4">{details.slogan ?? "Welcome to my portfolio"}</p>
                        <div className="rotate-180 relative my-4">
                            <Divider/>
                        </div>
                        <p className="text-xl sm:text-2xl font-nunito-semibold ">
                        {details.description ?? <span className="italic">(Unavailable description)</span>}
                        </p>
                    </div>
                </div>
        </div>
        </div>
    )
}

interface IProgress{
    progress:number, 
    title:string
    showProcess?:boolean,
    componentsProps?:{
        div:HTMLAttributes<HTMLDivElement> &{
            children?:{
                div1?:HTMLAttributes<HTMLDivElement> &{
                    children?:{
                        p1?:HTMLAttributes<HTMLParagraphElement> 
                        p2?:HTMLAttributes<HTMLParagraphElement> 
                    }
                },
                div2?:HTMLAttributes<HTMLDivElement> &{
                    children?:{
                        div1?:HTMLAttributes<HTMLParagraphElement> 
                        div2?:HTMLAttributes<HTMLParagraphElement> 
                    }
                }
            }
        }
    }
}

export const ProgressKnowledge=({progress, title, showProcess=true, componentsProps}:IProgress)=>{
    return(
        <div {...pp({...componentsProps?.div, className:clx("mb-8", componentsProps?.div?.className)})}>
            <div {...pp({ ...componentsProps?.div?.children?.div1,className:clx("flex justify-between items-center mb-2", componentsProps?.div?.children?.div1?.className)})}>
                <p {...pp({...componentsProps?.div?.children?.div1?.children?.p1, className:clx("font-nunito-bold text-lg sm:text-xl", componentsProps?.div?.children?.div1?.children?.p1?.className)})}>
                    {title}
                </p>
                {
                    showProcess ?
                    <p  {...pp({...componentsProps?.div?.children?.div1?.children?.p2,className:clx("font-nunito-semibold", componentsProps?.div?.children?.div1?.children?.p2?.className)})}>
                        {progress}%
                    </p>
                    :
                    <div></div>
                }
                
            </div>
            <div
                {...pp({...componentsProps?.div?.children?.div2,className:clx("relative", componentsProps?.div?.children?.div2?.className)})}>
                <div {...pp({...componentsProps?.div?.children?.div2?.children?.div1,className:clx("h-3 sm:h-4 bg-gray-200 rounded-full", componentsProps?.div?.children?.div2?.children?.div1?.className)})}></div>
                <div    { ...pp({...componentsProps?.div?.children?.div2?.children?.div2,className:clx("absolute h-3 sm:h-4 bg-gradient-to-r from-secondary-300 to-secondary-500 rounded-full top-0 left-0 ", componentsProps?.div?.children?.div2?.children?.div2?.className),style:{width:`${progress}%`, ...((componentsProps?.div?.children?.div2?.children?.div2?.style) ?? {})}})} ></div>
            </div>
        </div>
    )
}

export const MyKnowledge=({knowledge, setRef}:{knowledge:KnowledgesType,setRef:Function})=>{
    const ref:any=React.useRef()
    React.useEffect(()=>{
        if(ref?.current){
            setRef(ref?.current)
        }
    },[ref])
    const frameworks = useMemo(()=>{
        return knowledge.filter(k=>k.type==="FRAMEWORK")
    }, [knowledge])
    const libraries = useMemo(()=>{
        return knowledge.filter(k=>k.type==="LIBRARY")
    }, [knowledge])

    
    return(
        <div ref={ref} className="pt-10 md:pt-4">
            <div  className="relative -top-header-desktop md:top-0">
                <div className="">
                    <SessionTitle>MY SKILLS</SessionTitle>
                </div>
                <div className="flex p-4 flex-col sm:flex-row">
                    <div className="w-full md:w-1/2 px-4 md:pr-8 lg:pr-12">
                        <p className="text-primary text-2xl pb-4 font-nunito-semibold my-2">Frameworks & Libraries</p>
                        {
                            frameworks.length ?
                            frameworks.map((f)=>(
                                <ProgressKnowledge key={f.id} title={f.title} progress={f.progress}/>
                            ))
                            :
                            <p className="text-center italic text-md">
                                (No frameworks saved)
                            </p>
                        }
                    </div>
                    <div className="w-full md:w-1/2 px-4 md:pl-8 lg:pl-12">
                        <p className="text-primary text-2xl pb-4 font-nunito-semibold my-2">Langages</p>
                        {
                            libraries.length ?
                            libraries.map((f)=>(
                                <ProgressKnowledge  key={f.id} title={f.title} progress={f.progress}/>
                            ))
                            :
                            <p className="text-center italic text-md">
                                (No languages saved)
                            </p>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export const MyProjetwidget=({ project}:{ project?:ProjectType})=>{
    const progress=useMemo(()=>getProgess(project), [project])
    const gitHub=useMemo(()=>project?.metas.find((m:any)=>m.key==="GIT_REPOSITORY"), [project?.metas])
    const [openModal, setOpenModal]=React.useState(false)
    return(
        <>
            <div className="px-4">
                <div className=" relative px-2">
                    <div className="absolute border-4 border-primary left-1/2 -translate-x-1/2 w-full bg-white overflow-hidden rounded-lg shadow-xl">
                        <Image alt=""  src={project?.medias[0]?.fullPath ?? (project?.medias[0].mediaMeta  as any ).url as string} className="h-56 w-full object-cover "/>
                    </div>
                    <div className="pt-64  p-4 border-4 border-primary rounded-lg">
                        <p className="text-xl sm:text-2xl  font-nunito-semibold pb-3 border-b border-b-gray-400">
                            {project?.title}
                        </p>
                        <div className="  mt-4">
                            <p className={style.multiline}>
                            {project?.description}
                            </p>
                        </div>
                        <div>
                        
                            <div className="my-4">
                                <p className="text-lg font-nunito-semibold mb-2">Achievement level</p>
                                {
                                    typeof progress==="number"?
                                    <div className="relative rounded-full h-3 bg-gray-300">
                                        <div 
                                            style={{
                                                width:`calc(${Math.round(progress)}%)`
                                            }}
                                            className={"absolute w-3/4 h-3 absolute left-0 top-0  rounded-full " +(progress < 100 ? "bg-yellow-500":"bg-green-500")}></div>
                                    </div>
                                    :
                                    (
                                        typeof progress==="boolean"? 
                                        <p className="text-green-500 flex items-center">
                                            <MdDone className="m-r"/>
                                            Done
                                        </p>
                                        :<p className="italic text-gray-700">Unknow Status</p>
                                    )
                                }
                            </div>
                        </div>
                        <div className="flex lg:justify-between lg:flex-row flex-col items-center md:items-auto">
                            <div>
                                {
                                    gitHub ?
                                    <a target={"_blank"} href={gitHub.value}>
                                        <Button onClick={()=>{

                                        }} className="mb-2 lg:mb-0 !px-4 font-nunito-semibold !bg-transparent shadow-none !text-gray-500 flex items-center">
                                            <BsGithub className="mr-4"/> Check git repos
                                        </Button>
                                    </a>
                                    
                                    :<></>
                                }
                                
                            </div>
                            <div>
                                <Button onClick={()=>setOpenModal(true)} className="font-nunito-semibold">Détails</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Backdrop open={openModal}>
                <Modal className="bg-[#000] mx-auto flex flex-col">
                    <ModalHeader btnProps={{className:"bg-gray-800"} as any} onClose={()=>setOpenModal(false)} className="border-b-gray-900 h-50">
                        {S(project?.title).capitalize().s}
                    </ModalHeader>
                    <ModalBody className="overflow-y-auto">
                        <ViewProject data={project as any}/>
                    </ModalBody>
                </Modal>
            </Backdrop>
        </>
    )
}

export const MyProjects=({projects, setRef}:{projects?:ProjectType[],setRef:Function})=>{
    const ref:any=React.useRef()
    React.useEffect(()=>{
        if(ref?.current){
            setRef(ref?.current)
        }
    },[ref])
    return(
        <div  ref={ref} className="pt-10 md:pt-4">
            <div className="relative -top-header-desktop md:top-0">
                <div >
                <div className="">
                    <SessionTitle>MY PROJECTS & WORKS</SessionTitle>
                </div>
                {
                    Boolean(projects?.length)?
                    <GridContainer className="px-8 md:px-16">
                        {
                            projects?.map((p)=>(
                                <Grid xs={12} md={6} key={p.id} className="mb-4">
                                    <MyProjetwidget project={p}/>
                                </Grid>
                            ))
                        }
                    </GridContainer>
                    :
                    <p className="text-center my-2 italic text-md">(No projects saved)</p>
                }
                </div>
                
            </div>
        </div>
    )
}


const formStoreKey="contact-me"
const formStore=new Store()

export const ContactForm=({setRef}:{setRef:Function})=>{
    const ref:any=React.useRef()
    React.useEffect(()=>{
        if(ref?.current){
            setRef(ref?.current)
        }
    },[ref])
    return(
        <div ref={ref} className="">
            <div  className="relative my-20 -top-header-desktop md:top-0 py-8 " style={{
                backgroundImage:"url(/assets/images/back.svg)"
            }}>
                <div  className="max-w-4xl p-4 bg-[#0000006e] shadow-lg rounded-md mx-auto">
                    <div className="">
                        
                        <SessionTitle>CONTACT ME</SessionTitle>
                    </div>
                    <div className="mt-8 font-nunito-semibold px-4">
                        <GridContainer>
                            <Grid xs={12} md={6}>
                                <div className="pr-0 md:pr-2">
                                    <TextFieldForm
                                        className="border-2 text-xl py-3"
                                        label="Fullname"
                                        name="fullName"
                                        placeholder="Enter name and firstname"
                                        storageKey={formStoreKey}
                                        storageObject={formStore}
                                        formValidationProps={{
                                            valide:true,
                                            form:{
                                                vSchema:Joi.string(),
                                                errorMessage:"Name and firstname invalide"
                                            }
                                        }}
                                    />
                                </div>
                            </Grid>
                            <Grid xs={12} md={6}>
                                <div className="md:pl-2 mt-4 md:mt-0">
                                    <TextFieldForm
                                        className="border-2 text-xl py-3"
                                        label="Email"
                                        name="email"
                                        placeholder="Enter your email"
                                        storageKey={formStoreKey}
                                        storageObject={formStore}
                                        formValidationProps={{
                                            valide:true,
                                            form:{
                                                vSchema:Joi.string().email({tlds:false}),
                                                errorMessage:"Email is invalide"
                                            }
                                        }}
                                    />
                                </div>
                            </Grid>
                            <Grid xs={12}>
                                <div className="mt-4">
                                    <TextFieldForm
                                        className="border-2 text-xl py-3"
                                        label="Subject"
                                        name="title"
                                        placeholder="Entrez the subject of your message"
                                        storageKey={formStoreKey}
                                        storageObject={formStore}
                                        formValidationProps={{
                                            valide:true,
                                            form:{
                                                vSchema:Joi.string(),
                                                errorMessage:"Invalide subject"
                                            }
                                        }}
                                    />
                                </div>
                            </Grid>
                            <Grid xs={12}>
                                <div className="mt-4">
                                    <DescriptionFieldForm
                                        label="Votre Message"
                                        rows={5}
                                        name="content"
                                        className="border-2"
                                        placeholder="How can i help you ?"
                                        storageKey={formStoreKey}
                                        storageObject={formStore}
                                        formValidationProps={{
                                            valide:true,
                                            form:{
                                                vSchema:Joi.string(),
                                                errorMessage:"Invalid Message"
                                            }
                                        }}
                                    />
                                </div>
                            </Grid>
                            <Grid xs={12} className="flex justify-center mb-16 ">
                                <SendForm/>
                            </Grid>
                        </GridContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}

const SendForm=()=>{
    const onPersistData=async (store:any)=>{
        let data:any={}
        Object.keys(store??{}).forEach((k)=>data[k]=store[k].value)

        await axios.post('/api/contacts', {
            ...data
        })
    }
    const validateForm=(store:any)=>{
        const storeArr=Object.values(store ??{})
        const errors=storeArr.filter((v:any)=>!v.valid || !Boolean(v.value)).map((v:any)=>v.errorMessage)

        return storeArr.length ? errors : ['No changes saved ']
    }
    return(
        <div className=" mt-12  w-full max-w-xs">
            <CTAButtonValid 
                ctaStore={formStore}
                ctaStoreKey={formStoreKey}
                successMessage="Your message was successfully sent"
                errorMessage="An error occur during message sending. Please retry again."
                validateForm={validateForm}
                className="text-xl"
                onPersistData={onPersistData}
            >
                    Submit
            </CTAButtonValid>
        </div>
    )
}