import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { RichText } from '@/components/RichText'
import { getCMS, getGlobal } from '@/lib/payload'
type Props={params:Promise<{slug:string}>}
export default async function Page({params}:Props){
  const {slug}=await params
  const p=await getCMS()
  const r=await p.find({collection:'doctors',where:{slug:{equals:slug}},limit:1,depth:2})
  const d:any=r.docs[0]
  if(!d || d.active===false)notFound()
  const s:any=await getGlobal('site-settings')
  return <><SiteHeader/><main className="article-shell container"><div className="article-meta">ĐỘI NGŨ BÁC SĨ</div><h1>{d.title||''} {d.name}</h1><p className="article-lead">{(typeof d.specialtyRef==='object'?d.specialtyRef?.name:d.specialty)||''} · {d.department?.name||''}</p><h2>Giới thiệu</h2><RichText data={d.bio}/>{d.expertise&&<><h2>Lĩnh vực chuyên môn</h2><RichText data={d.expertise}/></>}<h2>Kinh nghiệm</h2><RichText data={d.experience}/><h2>Đào tạo</h2><RichText data={d.education}/>{d.achievements&&<><h2>Thành tích / nghiên cứu</h2><RichText data={d.achievements}/></>}<a className="btn btn-primary" href={s.medproUrl||'https://medpro.vn/'} target="_blank" rel="noopener noreferrer">Đặt lịch khám</a></main><SiteFooter/></>
}
