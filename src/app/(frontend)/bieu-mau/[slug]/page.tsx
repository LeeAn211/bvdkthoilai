import { notFound } from 'next/navigation'
import { getCMS } from '@/lib/payload'
import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { PatientCareSubNav } from '@/components/PatientCareSubNav'
import { DynamicPublicForm } from '@/components/DynamicPublicForm'

export default async function FormDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getCMS()

  const result = await payload.find({
    collection: 'forms',
    where: {
      and: [
        { slug: { equals: slug } },
        { active: { equals: true } },
      ],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  const form: any = result.docs[0]
  if (!form) notFound()

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow="BIỂU MẪU ĐIỆN TỬ"
        title={form.title}
        description={form.description || 'Vui lòng điền đầy đủ và chính xác các trường thông tin bên dưới để bệnh viện tiếp nhận xử lý kịp thời.'}
        breadcrumb={form.title}
      />

      <main className="patientCareSection">
        <div className="container">
          <PatientCareSubNav activeKey="bieu-mau" />

          <div className="surveyContainer">
            <div className="surveyHeaderCard">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
                <span className="patientCareCardBadge badgeActive">🟢 Tiếp nhận trực tuyến</span>
                <span style={{ fontSize: '13px', color: '#64748b' }}>Bệnh viện Đa khoa Khu vực Thới Lai</span>
              </div>
              <h2>{form.title}</h2>
              {form.description && <p>{form.description}</p>}
            </div>

            <div style={{ background: '#ffffff', borderRadius: '18px', padding: '28px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)' }}>
              <DynamicPublicForm form={form} />
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <a href="/bieu-mau" className="btnCareSecondary" style={{ display: 'inline-flex' }}>
                ← Quay lại danh mục biểu mẫu
              </a>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
