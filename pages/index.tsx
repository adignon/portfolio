import React from "react"
import Head from "next/head";
import { PageHeader, WhoAmISession, MyKnowledge, MyProjects, ContactForm } from "../app/parts/Portfolio";
import emoji from "node-emoji"
import { KnowledgeService } from "../src/services/knowledge";
import { ProjectService } from "../src/services/Project";
import { PortfolioService } from "../src/services/Portfolio"
import { Knowloadge, Project, Media, ProjectMeta, Prisma } from "@prisma/client"
import { UsageService } from "../src/services/Usage";
import { useFirstIntersectionWatcher } from "../app/utils/hooks/useIntersectionWatcher";
export type KnowledgesType=Knowloadge[]
export type DetailType={
	slogan: string | null;
	subslogan: string | null;
	description: string |  null;
	media: Media | null;
}
export type ProjectType=Project & {
	medias: Media[];
	metas: ProjectMeta[];
}
interface IHome{
	knowledges:KnowledgesType ,
	projects:ProjectType[] | undefined,
	details:DetailType
}
export default function Home(props:any) {
	const [refs, setRefs]=React.useState<any>({
		whoAmIRef:null,
		knowLedgeRef:null,
		projetsRef:null,
		contactFormRef:null,
		top:null
	})
	const ref=React.useRef()
	React.useEffect(()=>{
		if(Boolean(ref.current)){
			setRefs((prev:any)=>({...prev, top:ref?.current}))
		}
	}, [ref])
	return (
		<div >
			<Head>
				<title>My Portfolio</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			
			<style jsx global>{`
				body{
					background:radial-gradient(circle at 50px 20px, #561401 0%, #290900 2.93%, #280800 12.7%, #120300 26.77%, #000 100%);
					color:#fff;
					background-repeat: no-repeat;
				  }
			`}</style>
			<main className="max-w-screen-2xl mx-auto  ">
				<div  className="">
					<div ref={ref as any}></div>
					<PageHeader refs={refs} knowledge={props.knowledges}/>
					<WhoAmISession setRef={(ref:any)=>setRefs((prev:any)=>({...prev, whoAmIRef:ref}))} details={props.details}/>
					<MyKnowledge setRef={(ref:any)=>setRefs((prev:any)=>({...prev, knowLedgeRef:ref}))}  knowledge={props.knowledges}/>
					<MyProjects setRef={(ref:any)=>setRefs((prev:any)=>({...prev, projetsRef:ref}))} projects={props.projects}/>
					<ContactForm setRef={(ref:any)=>setRefs((prev:any)=>({...prev, contactFormRef:ref}))}/>
				</div>
				<div  className="-mt-10">
					<p className="text-center font-nunito-semibold mb-4 text-white">Made with {emoji.get("heart")} by <a href = {"mailto:"+props.details.adminEmail} className="text-primary hover:underline">Adignon</a> </p>
				</div>
			</main>
		</div>
	);
}


export const getServerSideProps=async (ctx:any) =>{
	try{
		const knowledgeService=new KnowledgeService()
		const projectService=new ProjectService()
		const portfolioService=new PortfolioService()

		const knowledges=await knowledgeService.getAll()
		const projects=(await projectService.getAll())?.data?.filter((d)=>d.status==="PUBLISHED").map((p)=>({...p, createdAt:p.createdAt.getTime(), startAt:p.startAt.getTime(), endAt:p.endAt.getTime()}))
		const details=(await portfolioService.getPortfolioData())?.data

		const usageService=new UsageService()
		await usageService.setusageData(ctx.req)

		return({
			props:{
				knowledges,
				projects,
				details
			}
		})

	}catch(e){

		return {
			notFound:true
		}

	}
}
//radial-gradient(circle, #561401 0%, #290900 2.93%, #280800 12.7%, #120300 26.77%, #000 100%)