import { PageHero } from '@/components/PageHero'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { getCMS } from '@/lib/payload'

export const revalidate = 60

export default async function SpecialtiesPage() {
  let specialties: any[] = []
  try {
    const payload = await getCMS()
    const result = await payload.find({
      collection: 'specialties',
      where: { and: [{ active: { equals: true } }, { _status: { equals: 'published' } }] },
      limit: 200,
      sort: ['order', 'name'],
      depth: 1,
    })
    specialties = result.docs as any[]
  } catch {}

  return <>
    <SiteHeader />
    <PageHero eyebrow="CHUYÊN MÔN" title="Chuyên khoa" description="Thông tin các chuyên khoa, khoa/phòng phụ trách và đội ngũ bác sĩ của bệnh viện." />
    <main className="section soft"><div className="container">
      {specialties.length ? <div className="directoryGrid">{specialties.map((item) => {
        const department = typeof item.department === 'object' ? item.department?.name : ''
        return <a className="directoryCard" href={`/chuyen-khoa/${item.slug}`} key={item.id}>
          <span className="directoryIcon">✚</span><div><small>{department || 'CHUYÊN KHOA'}</small><h3>{item.name}</h3><p>{item.summary || 'Xem thông tin chuyên khoa và đội ngũ bác sĩ'}</p></div><i>›</i>
        </a>
      })}</div> : <div className="professionalEmpty">Danh sách chuyên khoa đang được cập nhật.</div>}
    </div></main>
    <SiteFooter />
  </>
}
