import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { AppointmentBookingForm } from '@/components/AppointmentBookingForm'
import { getCMS, getGlobal } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'Đặt lịch khám tại cơ sở — Bệnh viện Đa khoa Khu vực Thới Lai',
  description: 'Đăng ký đặt lịch khám tại Bệnh viện Đa khoa Khu vực Thới Lai trực tuyến 24/7. Nhận mã phiếu hẹn ưu tiên tiếp đón nhanh tại viện.',
}

export default async function AppointmentBookingPage() {
  let specialties: Array<{ id: string | number; name: string }> = []
  let doctors: Array<{ id: string | number; name: string; title?: string; specialtyName?: string }> = []
  let settings: any = {}

  try {
    const [payload, appSettings] = await Promise.all([
      getCMS(),
      getGlobal('appointment-settings' as any).catch(() => ({})),
    ])

    settings = appSettings || {}

    // Lấy danh sách Chuyên khoa theo cấu hình trong Admin (appointment-settings)
    const specialtySource = settings?.specialtySource || 'auto'

    if (specialtySource === 'custom' && Array.isArray(settings?.customSpecialties) && settings.customSpecialties.length > 0) {
      specialties = settings.customSpecialties
        .filter((item: any) => item?.name)
        .map((item: any, idx: number) => ({
          id: item.code || item.name,
          name: item.name,
        }))
    } else if (specialtySource === 'selected' && Array.isArray(settings?.selectedSpecialties) && settings.selectedSpecialties.length > 0) {
      specialties = settings.selectedSpecialties
        .map((s: any) => ({
          id: typeof s === 'object' ? s.id : s,
          name: typeof s === 'object' ? s.name : String(s),
        }))
        .filter((s: any) => s.name)
    } else {
      // Mặc định 'auto': Lấy danh sách Chuyên khoa đang hoạt động
      const specsResult = await payload.find({
        collection: 'specialties',
        where: { active: { not_equals: false } },
        sort: 'order',
        limit: 100,
        depth: 0,
        overrideAccess: true,
      })

      specialties = (specsResult.docs || []).map((s: any) => ({
        id: s.id,
        name: s.name,
      }))

      // Nếu specialties rỗng thì fallback lấy từ Departments (Khoa lâm sàng)
      if (specialties.length === 0) {
        const deptsResult = await payload.find({
          collection: 'departments',
          where: { active: { not_equals: false }, unitType: { equals: 'clinical' } },
          sort: 'order',
          limit: 50,
          depth: 0,
          overrideAccess: true,
        })
        specialties = (deptsResult.docs || []).map((d: any) => ({
          id: d.id,
          name: d.name,
        }))
      }
    }

    // Lấy danh sách Bác sĩ
    const doctorsResult = await payload.find({
      collection: 'doctors',
      where: { active: { not_equals: false } },
      sort: 'order',
      limit: 100,
      depth: 1,
      overrideAccess: true,
    })

    doctors = (doctorsResult.docs || []).map((d: any) => ({
      id: d.id,
      name: d.name,
      title: d.title,
      specialtyName: typeof d.specialty === 'object' ? d.specialty?.name : undefined,
    }))
  } catch (error) {
    console.error('Error loading booking data:', error)
  }

  const eyebrow = settings.eyebrow || 'DỊCH VỤ NGƯỜI BỆNH'
  const title = settings.pageTitle || 'Đăng ký đặt lịch khám tại cơ sở'
  const description =
    settings.pageDescription ||
    'Chủ động đăng ký khám bệnh tại Bệnh viện Đa khoa Khu vực Thới Lai. Quý khách sẽ nhận được mã phiếu hẹn và được ưu tiên hỗ trợ tiếp đón nhanh tại viện.'

  const formMaxWidth = settings.formMaxWidth ? `${settings.formMaxWidth}px` : '960px'

  return (
    <>
      <SiteHeader />
      <PageHero eyebrow={eyebrow} title={title} description={description} />
      <main className="section">
        <div className="container" style={{ maxWidth: formMaxWidth }}>
          <AppointmentBookingForm
            specialties={specialties}
            doctors={doctors}
            settings={settings}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
