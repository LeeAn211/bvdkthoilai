import type { Metadata } from 'next'
import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { PatientCareSubNav } from '@/components/PatientCareSubNav'
import StaffSurveyForm from '@/components/StaffSurveyForm'

export const metadata: Metadata = {
  title: 'Khảo sát Ý kiến Nhân viên Y tế — BVĐK Khu vực Thới Lai',
  description: 'Mẫu số 3 - Phiếu khảo sát ý kiến và sự hài lòng của nhân viên y tế theo chuẩn Bộ Y tế tại Bệnh viện Đa khoa Khu vực Thới Lai.',
}

export default function StaffSurveyPage() {
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
