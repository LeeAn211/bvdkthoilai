import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { RichText } from '@/components/RichText'
import { getCMS } from '@/lib/payload'
type Props={params:Promise<{slug:string}>}
export default async function Page({params}:Props){
  const {slug}=await params
  const p=await getCMS()
  const r=await p.find({collection:'departments',where:{slug:{equals:slug}},limit:1})
  const dep:any=r.docs[0]
  if(!dep)notFound()
  const dr=await p.find({collection:'doctors',where:{department:{equals:dep.id}},limit:100})
  return <><SiteHeader/><main className="article-shell container"><div className="article-meta">{dep.kind==='department'?'KHOA':'PHÒNG'}</div><h1>{dep.name}</h1>{dep.summary&&<p className="article-lead">{dep.summary}</p>}<RichText data={dep.content}/><section className="doctor-section"><h2>Đội ngũ</h2><div className="cards-3">{(dr.docs as any[]).map(d=><a className="content-card doctor-card" href={`/bac-si/${d.slug}`} key={d.id}><div className="card-body"><h3>{d.title||''} {d.name}</h3><p>{d.specialty||''}</p></div></a>)}</div></section></main><SiteFooter/></>
}
