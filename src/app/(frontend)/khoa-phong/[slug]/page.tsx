import { notFound } from 'next/navigation'
import { RichText } from '@/components/RichText'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { getCMS } from '@/lib/payload'

type Props = { params: Promise<{ slug: string }> }

export default async function DepartmentDetail({ params }: Props) {
  const { slug } = await params
  const payload = await getCMS()
  const result = await payload.find({ collection: 'departments', where: { slug: { equals: slug } }, limit: 1, depth: 2 })
  const dep: any = result.docs[0]
  if (!dep || dep.active === false) notFound()
  const [doctors, specialties] = await Promise.all([
    payload.find({ collection: 'doctors', where: { and: [{ department: { equals: dep.id } }, { active: { equals: true } }] }, limit: 100, sort: ['order', 'name'], depth: 1 }),
    payload.find({ collection: 'specialties', where: { and: [{ department: { equals: dep.id } }, { active: { equals: true } }] }, limit: 100, sort: ['order', 'name'], depth: 1 }),
  ])
  return <><SiteHeader/><main className="article-shell container"><div className="article-meta">{(dep.unitType || dep.kind) === 'office' ? 'PHÒNG CHỨC NĂNG' : 'KHOA CHUYÊN MÔN'}</div><h1>{dep.name}</h1>
    {dep.summary && <p className="article-lead">{dep.summary}</p>}
    {(dep.leader || dep.phone || dep.location) && <p><strong>Phụ trách:</strong> {dep.leader || 'Đang cập nhật'}{dep.phone ? ` · ${dep.phone}` : ''}{dep.location ? ` · ${dep.location}` : ''}</p>}
    <RichText data={dep.content}/>
    {dep.functions && <><h2>Chức năng – nhiệm vụ</h2><RichText data={dep.functions}/></>}
    {dep.activities && <><h2>Hoạt động chuyên môn</h2><RichText data={dep.activities}/></>}
    {(specialties.docs as any[]).length > 0 && <section><h2>Chuyên khoa</h2><div className="cards-3">{(specialties.docs as any[]).map((s) => <a className="content-card" href={`/chuyen-khoa/${s.slug}`} key={s.id}><div className="card-body"><h3>{s.name}</h3><p>{s.summary || 'Xem thông tin chuyên khoa'}</p></div></a>)}</div></section>}
    <section className="doctor-section"><h2>Đội ngũ bác sĩ</h2><div className="cards-3">{(doctors.docs as any[]).map((d) => <a className="content-card doctor-card" href={`/bac-si/${d.slug}`} key={d.id}><div className="card-body"><h3>{d.title || ''} {d.name}</h3><p>{typeof d.specialtyRef === 'object' ? d.specialtyRef?.name : d.specialty || ''}</p></div></a>)}</div></section>
    {dep.achievements && <><h2>Thành tích / điểm nổi bật</h2><RichText data={dep.achievements}/></>}
    <p><a className="btn btn-outline" href="/khoa-phong">← Trở lại danh sách khoa/phòng</a></p>
  </main><SiteFooter/></>
}
