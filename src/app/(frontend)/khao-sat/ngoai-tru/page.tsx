import type { Metadata } from 'next'
import { getCMS, getGlobal } from '@/lib/payload'
import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { PatientCareSubNav } from '@/components/PatientCareSubNav'
import OutpatientSurveyForm from '@/components/OutpatientSurveyForm'

export const metadata: Metadata = {
  title: 'Khảo sát Sự hài lòng Người bệnh Ngoại trú — BVĐK Khu vực Thới Lai',
  description: 'Mẫu số 2 - Phiếu khảo sát ý kiến người bệnh khám ngoại trú theo chuẩn Bộ Y tế tại Bệnh viện Đa khoa Khu vực Thới Lai.',
}

export const dynamic = 'force-dynamic'

export default async function OutpatientSurveyPage() {
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
        where: { slug: { equals: 'ngoai-tru' } },
        limit: 1,
        overrideAccess: true,
      }).catch(() => ({ docs: [] }))
      if (res.docs.length > 0) {
        campOptions = (res.docs[0] as any).customOptions || {}
      }
    }
  } catch {}

  const rawClinics = campOptions.outpatientClinics || surveyConf.outpatientClinics
  const rawAreas = campOptions.areaSuggestions || surveyConf.areaSuggestions

  // Phân tách các tùy chọn từ textarea của CMS (mỗi dòng 1 phần tử)
  const customClinics = typeof rawClinics === 'string' && rawClinics.trim()
    ? rawClinics.split(/\r?\n/).map((s: string) => s.trim()).filter(Boolean)
    : undefined

  const customAreas = typeof rawAreas === 'string' && rawAreas.trim()
    ? rawAreas.split(/\r?\n/).map((s: string) => s.trim()).filter(Boolean)
    : undefined

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow="CHĂM SÓC NGƯỜI BỆNH & KHẢO SÁT"
        title="Khảo sát Sự hài lòng Người bệnh Ngoại trú"
        description="Mẫu số 2 ban hành theo Quyết định của Bộ Y tế. Ý kiến phản hồi chân thực từ Quý người bệnh là cơ sở quan trọng nhất để Bệnh viện Đa khoa Khu vực Thới Lai không ngừng cải tiến và nâng cao chất lượng phục vụ."
        breadcrumb="Khảo sát Ngoại trú"
      />

      <main className="patientCareSection">
        <div className="container">
          <PatientCareSubNav activeKey="khao-sat" />
          <OutpatientSurveyForm customClinics={customClinics} customAreas={customAreas} />
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
