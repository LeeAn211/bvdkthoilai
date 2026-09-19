import type { Metadata } from 'next'
import { PageHero } from '@/components/PageHero'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { getCMS, getGlobal } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import { SpecialtiesDirectoryClient, type SpecialtyItem } from './SpecialtiesDirectoryClient'
import './specialties.css'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Danh mục Chuyên khoa Y tế | BVĐK Khu vực Thới Lai',
  description: 'Tra cứu danh mục các chuyên khoa chuyên môn sâu, khối lâm sàng, cận lâm sàng và khoa/phòng phụ trách tại Bệnh viện Đa khoa Khu vực Thới Lai.',
}

export default async function SpecialtiesPage() {
  let specialties: SpecialtyItem[] = []
  let siteSettings: any = null

  try {
    const payload = await getCMS()
    const [result, siteRes] = await Promise.all([
      payload.find({
        collection: 'specialties',
        where: {
          and: [
            { active: { equals: true } },
            { _status: { equals: 'published' } },
          ],
        },
        limit: 200,
        sort: ['order', 'name'],
        depth: 1,
      }),
      getGlobal('site-settings').catch(() => null),
    ])

    siteSettings = siteRes

    specialties = (result.docs as any[]).map((item) => {
      const dept = typeof item.department === 'object' ? item.department : null
      const deptKind = (dept?.kind || dept?.unitType || '').toLowerCase()
      const nameLower = (item.name || '').toLowerCase()

      let kindGroup: 'clinical' | 'paraclinical' | 'other' = 'clinical'
      if (
        deptKind === 'paraclinical' ||
        nameLower.includes('chẩn đoán hình ảnh') ||
        nameLower.includes('xét nghiệm') ||
        nameLower.includes('kiểm soát nhiễm khuẩn')
      ) {
        kindGroup = 'paraclinical'
      } else if (
        deptKind === 'office' ||
        deptKind === 'leadership' ||
        nameLower.includes('kế hoạch') ||
        nameLower.includes('phòng')
      ) {
        kindGroup = 'other'
      }

      return {
        id: item.id,
        name: item.name,
        slug: item.slug,
        icon: item.icon,
        tagline: item.tagline,
        summary: item.summary,
        coverUrl: mediaUrl(item.cover),
        department: dept
          ? {
              id: dept.id,
              name: dept.name,
              slug: dept.slug,
              kind: dept.kind,
              location: dept.location,
              phone: dept.phone,
            }
          : null,
        kindGroup,
      }
    })
  } catch {}

  const hotline = siteSettings?.hotline || process.env.NEXT_PUBLIC_HOTLINE || '02923686115'
  const bookingUrl = siteSettings?.medproBookingUrl || process.env.NEXT_PUBLIC_MEDPRO_URL || 'https://medpro.vn/trung-tam-y-te-khu-vuc-thoi-lai'

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow="CHUYÊN MÔN Y TẾ"
        title="Danh mục Chuyên khoa"
        description="Hệ thống các lĩnh vực chuyên môn sâu, khối lâm sàng, cận lâm sàng cùng đội ngũ y bác sĩ giàu kinh nghiệm tại Bệnh viện Đa khoa Khu vực Thới Lai."
      />
      <main className="specialtiesListPage">
        <div className="container" style={{ marginTop: '36px' }}>
          <SpecialtiesDirectoryClient
            specialties={specialties}
            hospitalHotline={hotline}
            bookingUrl={bookingUrl}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

