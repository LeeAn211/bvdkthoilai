import { notFound } from 'next/navigation'
import { RichText } from '@/components/RichText'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { getCMS } from '@/lib/payload'

type Props = { params: Promise<{ slug: string }> }

export default async function SpecialtyDetail({ params }: Props) {
  const { slug } = await params
  const payload = await getCMS()
  const result = await payload.find({ collection: 'specialties', where: { slug: { equals: slug } }, limit: 1, depth: 2 })
  const specialty: any = result.docs[0]
  if (!specialty || specialty.active === false) notFound()
  const doctors = await payload.find({ collection: 'doctors', where: { and: [{ specialtyRef: { equals: specialty.id } }, { active: { equals: true } }] }, limit: 100, sort: ['order', 'name'], depth: 1 })
  const department = typeof specialty.department === 'object' ? specialty.department : null

  return <><SiteHeader/><main className="article-shell container">
    <div className="article-meta">CHUYÊN KHOA</div><h1>{specialty.name}</h1>
    {department?.name && <p className="article-lead"><a href={`/khoa-phong/${department.slug}`}>{department.name}</a></p>}
    {specialty.summary && <p className="article-lead">{specialty.summary}</p>}
    <RichText data={specialty.content}/>
    {specialty.services && <><h2>Dịch vụ / kỹ thuật nổi bật</h2><RichText data={specialty.services}/></>}
    <section className="doctor-section"><h2>Đội ngũ bác sĩ</h2><div className="cards-3">{(doctors.docs as any[]).map((d) => <a className="content-card doctor-card" href={`/bac-si/${d.slug}`} key={d.id}><div className="card-body"><h3>{d.title || ''} {d.name}</h3><p>{d.degree || specialty.name}</p></div></a>)}</div></section>
    <p><a className="btn btn-outline" href="/chuyen-khoa">← Trở lại danh sách chuyên khoa</a></p>
  </main><SiteFooter/></>
}
