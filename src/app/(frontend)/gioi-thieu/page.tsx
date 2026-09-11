import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { getCMS } from '@/lib/payload'
export const revalidate=300
export default async function Page(){
  let deps:any[]=[]
  try{const p=await getCMS();const r=await p.find({collection:'departments',sort:'name',limit:200});deps=r.docs as any[]}catch{}
  const khoa=deps.filter(x=>x.kind==='department'), phong=deps.filter(x=>x.kind==='office')
  return <><SiteHeader/><PageHero eyebrow="GIỚI THIỆU" title="Sơ đồ tổ chức" description="Khoa/phòng và đội ngũ chuyên môn."/><main className="section soft"><div className="container"><div className="org org-large"><div className="org-node primary">BAN GIÁM ĐỐC</div><div className="org-line"></div><div className="org-grid"><div className="org-node">KHỐI KHOA<div className="org-links">{khoa.map(x=><a key={x.id} href={`/don-vi/${x.slug}`}>{x.name}</a>)}</div></div><div className="org-node">KHỐI PHÒNG<div className="org-links">{phong.map(x=><a key={x.id} href={`/don-vi/${x.slug}`}>{x.name}</a>)}</div></div></div></div></div></main><SiteFooter/></>
}
