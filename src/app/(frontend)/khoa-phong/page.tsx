import { PageHero } from '@/components/PageHero'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { getCMS } from '@/lib/payload'

export const revalidate = 60

export default async function DepartmentsPage({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  const requestedKind = (await searchParams).kind
  let departments: any[] = []
  try {
    const payload = await getCMS()
    const result = await payload.find({ collection: 'departments', limit: 200, sort: ['order', 'name'], depth: 0 })
    departments = (result.docs as any[]).filter((item) => item.active !== false && (!requestedKind || item.kind === requestedKind))
  } catch {}
  return <><SiteHeader/><PageHero eyebrow="TỔ CHỨC BỆNH VIỆN" title="Khoa, phòng trực thuộc" description="Thông tin các khoa chuyên môn và phòng chức năng của Bệnh viện Đa khoa khu vực Thới Lai." />
    <main className="section soft"><div className="container">{departments.length ? <div className="directoryGrid">{departments.map((item) => <a className="directoryCard" href={`/khoa-phong/${item.slug}`} key={item.id}><span className="directoryIcon">{(item.unitType || item.kind) === 'office' ? '⌂' : '✚'}</span><div><small>{(item.unitType || item.kind) === 'office' ? 'PHÒNG CHỨC NĂNG' : (item.unitType || item.kind) === 'paraclinical' ? 'KHOA CẬN LÂM SÀNG' : 'KHOA CHUYÊN MÔN'}</small><h3>{item.name}</h3><p>{item.location || item.summary || 'Xem thông tin chi tiết đơn vị'}</p></div><i>›</i></a>)}</div> : <div className="professionalEmpty">Danh sách khoa, phòng đang được cập nhật.</div>}</div></main><SiteFooter/></>
}
