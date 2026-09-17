import type { Metadata } from 'next'
import { getCMS, getGlobal } from '@/lib/payload'
import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { PatientCareSubNav } from '@/components/PatientCareSubNav'
import InpatientSurveyForm from '@/components/InpatientSurveyForm'

export const metadata: Metadata = {
  title: 'Khảo sát Sự hài lòng Người bệnh Nội trú — BVĐK Khu vực Thới Lai',
  description: 'Mẫu số 1 - Phiếu khảo sát ý kiến người bệnh điều trị nội trú theo chuẩn Bộ Y tế tại Bệnh viện Đa khoa Khu vực Thới Lai.',
}

export const dynamic = 'force-dynamic'

export default async function InpatientSurveyPage() {
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
        where: { slug: { equals: 'noi-tru' } },
        limit: 1,
        overrideAccess: true,
      }).catch(() => ({ docs: [] }))
      if (res.docs.length > 0) {
        campOptions = (res.docs[0] as any).customOptions || {}
      }
    }
  } catch {}

  const rawDepartments = campOptions.inpatientDepartments || surveyConf.inpatientDepartments
  const rawAreas = campOptions.areaSuggestions || surveyConf.areaSuggestions

  const customDepartments = typeof rawDepartments === 'string' && rawDepartments.trim()
    ? rawDepartments.split(/\r?\n/).map((s: string) => s.trim()).filter(Boolean)
    : undefined

  const customAreas = typeof rawAreas === 'string' && rawAreas.trim()
    ? rawAreas.split(/\r?\n/).map((s: string) => s.trim()).filter(Boolean)
    : undefined

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow="CHĂM SÓC NGƯỜI BỆNH & KHẢO SÁT"
        title="Khảo sát Sự hài lòng Người bệnh Nội trú"
        description="Mẫu số 1 ban hành theo Quyết định của Bộ Y tế. Ý kiến đóng góp chân thực từ Quý người bệnh và thân nhân là thước đo quan trọng nhất để Bệnh viện Đa khoa Khu vực Thới Lai không ngừng cải tiến y đức, tinh thần chăm sóc và điều kiện cơ sở vật chất buồng bệnh."
        breadcrumb="Khảo sát Nội trú"
      />

      <main className="patientCareSection">
        <div className="container">
          <PatientCareSubNav activeKey="khao-sat" />
          <InpatientSurveyForm customDepartments={customDepartments} customAreas={customAreas} />
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
