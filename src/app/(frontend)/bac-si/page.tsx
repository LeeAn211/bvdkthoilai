import { PageHero } from '@/components/PageHero'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { getCMS } from '@/lib/payload'

export const revalidate = 60

export default async function DoctorsPage() {
  let doctors: any[] = []

  try {
    const payload = await getCMS()
    const result = await payload.find({
      collection: 'doctors',
      limit: 200,
      sort: ['order', 'name'],
      depth: 1,
    })
    doctors = (result.docs as any[]).filter((item) => item.active !== false)
  } catch {}

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow="ĐỘI NGŨ CHUYÊN MÔN"
        title="Đội ngũ bác sĩ"
        description="Tra cứu thông tin bác sĩ và chuyên khoa tại Bệnh viện Đa khoa khu vực Thới Lai."
      />
      <main className="section soft">
        <div className="container">
          {doctors.length > 0 ? (
            <div className="doctorDirectoryGrid">
              {doctors.map((item) => {
                const department = typeof item.department === 'object' ? item.department?.name : ''
                const specialty = typeof item.specialtyRef === 'object' ? item.specialtyRef?.name : item.specialty
                return (
                  <a className="doctorDirectoryCard" href={`/bac-si/${item.slug}`} key={item.id}>
                    <span className="doctorDirectoryAvatar">{item.name?.slice(0, 1) || 'B'}</span>
                    <div>
                      <small>{item.title || 'BÁC SĨ'}</small>
                      <h2>{item.name}</h2>
                      <p>{specialty || department || 'Thông tin chuyên khoa đang được cập nhật'}</p>
                    </div>
                    <i>›</i>
                  </a>
                )
              })}
            </div>
          ) : (
            <div className="professionalEmpty">Danh sách bác sĩ đang được cập nhật.</div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

