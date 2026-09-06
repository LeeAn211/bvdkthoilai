import { notFound } from 'next/navigation'
import { getCMS } from '@/lib/payload'
import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { DynamicPublicForm } from '@/components/DynamicPublicForm'
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const payload=await getCMS();const result=await payload.find({collection:'forms',where:{and:[{slug:{equals:slug}},{active:{equals:true}}]},limit:1,depth:0,overrideAccess:true});const form:any=result.docs[0];if(!form)notFound();return <><SiteHeader/><PageHero eyebrow="BIỂU MẪU" title={form.title} description={form.description||'Vui lòng điền đầy đủ thông tin bên dưới.'}/><main className="section"><div className="container narrow"><DynamicPublicForm form={form}/></div></main><SiteFooter/></>}
