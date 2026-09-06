import { notFound } from 'next/navigation'
import { getCMS } from '@/lib/payload'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import SurveyForm from '@/components/SurveyForm'
export const dynamic='force-dynamic'
export default async function SurveyPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params; const p=await getCMS(); const r=await p.find({collection:'survey-campaigns',where:{and:[{slug:{equals:slug}},{active:{equals:true}}]},limit:1,depth:3,overrideAccess:true}); const c:any=r.docs[0]; if(!c)return notFound(); const now=Date.now(); if(c.startAt&&new Date(c.startAt).getTime()>now)return notFound(); if(c.endAt&&new Date(c.endAt).getTime()<now)return notFound(); const v:any=c.templateVersion; const qs=(v?.questions||[]).map((q:any)=>typeof q==='object'?q:null).filter(Boolean).sort((a:any,b:any)=>(a.order||0)-(b.order||0)); return <><SiteHeader/><main className="section"><div className="container" style={{maxWidth:900}}><h1>{c.title}</h1>{c.publicNote&&<p>{c.publicNote}</p>}<SurveyForm campaignId={String(c.id)} questions={qs}/></div></main><SiteFooter/></>}
