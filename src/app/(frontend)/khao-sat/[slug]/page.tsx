import { notFound } from 'next/navigation'
import { getCMS } from '@/lib/payload'
import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { PatientCareSubNav } from '@/components/PatientCareSubNav'
import SurveyForm from '@/components/SurveyForm'

export const dynamic = 'force-dynamic'

export default async function SurveyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getCMS()

  const result = await payload.find({
    collection: 'survey-campaigns',
    where: {
      and: [
        { slug: { equals: slug } },
        { active: { equals: true } },
      ],
    },
    limit: 1,
    depth: 3,
    overrideAccess: true,
  })

  const campaign: any = result.docs[0]
  if (!campaign) {
    if (slug === 'ngoai-tru' || slug === 'nguoi-benh-ngoai-tru') {
      const OutpatientSurveyForm = (await import('@/components/OutpatientSurveyForm')).default
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
              <OutpatientSurveyForm />
            </div>
          </main>
          <SiteFooter />
        </>
      )
    }
    if (slug === 'noi-tru' || slug === 'nguoi-benh-noi-tru') {
      const InpatientSurveyForm = (await import('@/components/InpatientSurveyForm')).default
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
              <InpatientSurveyForm />
            </div>
          </main>
          <SiteFooter />
        </>
      )
    }
    if (slug === 'nhan-vien' || slug === 'nhan-vien-y-te' || slug === 'khao-sat-nhan-vien') {
      const StaffSurveyForm = (await import('@/components/StaffSurveyForm')).default
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
              <StaffSurveyForm />
            </div>
          </main>
          <SiteFooter />
        </>
      )
    }
    return notFound()
  }

  const now = Date.now()
  if (campaign.startAt && new Date(campaign.startAt).getTime() > now) return notFound()
  if (campaign.endAt && new Date(campaign.endAt).getTime() < now) return notFound()

  const version: any = campaign.templateVersion
  const questions = (version?.questions || [])
    .map((q: any) => (typeof q === 'object' ? q : null))
    .filter(Boolean)
    .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow="KHẢO SÁT Ý KIẾN NGƯỜI BỆNH"
        title={campaign.title}
        description={campaign.publicNote || 'Ý kiến phản hồi chân thực từ quý người bệnh là cơ sở quan trọng nhất để Bệnh viện Đa khoa Khu vực Thới Lai không ngừng cải tiến và nâng cao chất lượng phục vụ.'}
        breadcrumb={campaign.title}
      />

      <main className="patientCareSection">
        <div className="container">
          <PatientCareSubNav activeKey="khao-sat" />

          <div className="surveyContainer">
            <div className="surveyHeaderCard">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
                <span className="patientCareCardBadge badgeActive">🟢 Đang tiếp nhận ý kiến</span>
                {campaign.endAt && (
                  <span style={{ fontSize: '13px', color: '#64748b' }}>
                    Thời hạn: đến <strong>{new Date(campaign.endAt).toLocaleDateString('vi-VN')}</strong>
                  </span>
                )}
              </div>
              <h2>{campaign.title}</h2>
              <p>
                {campaign.publicNote || 'Vui lòng dành 2-3 phút để đánh giá các câu hỏi dưới đây. Khảo sát hoàn toàn ẩn danh và bảo mật tuyệt đối.'}
              </p>
            </div>

            <SurveyForm campaignId={String(campaign.id)} questions={questions} />
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
