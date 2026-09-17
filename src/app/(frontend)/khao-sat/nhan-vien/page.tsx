import type { Metadata } from 'next'
import { getCMS, getGlobal } from '@/lib/payload'
import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { PatientCareSubNav } from '@/components/PatientCareSubNav'
import StaffSurveyForm from '@/components/StaffSurveyForm'

export const metadata: Metadata = {
  title: 'Khảo sát Ý kiến Nhân viên Y tế — BVĐK Khu vực Thới Lai',
  description: 'Mẫu số 3 - Phiếu khảo sát ý kiến và sự hài lòng của nhân viên y tế theo chuẩn Bộ Y tế tại Bệnh viện Đa khoa Khu vực Thới Lai.',
}

export const dynamic = 'force-dynamic'

export default async function StaffSurveyPage() {
  let siteSettings: any = {}
  let campOptions: any = {}
  let surveyConf: any = {}
  try {
    const [specSurvey, settings, payload] = await Promise.all([
      getGlobal('survey-page-settings' as any).catch(() => null),
      getGlobal('site-settings' as any).catch(() => ({})),
      getCMS().catch(() => null),
    ])
    siteSettings = settings || {}
    surveyConf = (specSurvey && Object.keys(specSurvey).length > 0) ? specSurvey : (siteSettings?.surveyPage || {})
    if (payload) {
      const res = await payload.find({
        collection: 'survey-campaigns',
        where: { slug: { equals: 'nhan-vien' } },
        limit: 1,
        overrideAccess: true,
      }).catch(() => ({ docs: [] }))
      if (res.docs.length > 0) {
        campOptions = (res.docs[0] as any).customOptions || {}
      }
    }
  } catch {}

  const rawPositions = campOptions.staffPositions || surveyConf.staffPositions
  const rawUnitTypes = campOptions.staffUnitTypes || surveyConf.staffUnitTypes
  const rawStaffDepts = campOptions.staffDepartments || surveyConf.staffDepartments

  const customPositions = typeof rawPositions === 'string' && rawPositions.trim()
    ? rawPositions.split(/\r?\n/).map((s: string) => s.trim()).filter(Boolean)
    : undefined

  const customUnitTypes = typeof rawUnitTypes === 'string' && rawUnitTypes.trim()
    ? rawUnitTypes.split(/\r?\n/).map((s: string) => s.trim()).filter(Boolean)
    : undefined

  const customDepartments = typeof rawStaffDepts === 'string' && rawStaffDepts.trim()
    ? rawStaffDepts.split(/\r?\n/).map((s: string) => s.trim()).filter(Boolean)
    : undefined

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow="KHẢO SÁT NỘI BỘ & PHÁT TRIỂN NGUỒN LỰC"
        title="Khảo sát Ý kiến & Sự hài lòng Nhân viên Y tế"
        description="Mẫu số 3 ban hành theo Quyết định của Bộ Y tế. Ý kiến đóng góp dân chủ, trách nhiệm và thẳng thắn của toàn thể cán bộ, nhân viên y tế là cơ sở để Ban Giám đốc xây dựng môi trường làm việc ngày càng văn minh, đoàn kết, công bằng và đãi ngộ xứng đáng."
        breadcrumb="Khảo sát Nhân viên y tế"
      />

      <main className="patientCareSection">
        <div className="container">
          <PatientCareSubNav activeKey="khao-sat" />
          <StaffSurveyForm
            customPositions={customPositions}
            customUnitTypes={customUnitTypes}
            customDepartments={customDepartments}
          />
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
