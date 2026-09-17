import type { Metadata } from 'next'
import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { PatientCareSubNav } from '@/components/PatientCareSubNav'
import OutpatientSurveyForm from '@/components/OutpatientSurveyForm'

export const metadata: Metadata = {
  title: 'Khảo sát Sự hài lòng Người bệnh Ngoại trú — BVĐK Khu vực Thới Lai',
  description: 'Mẫu số 2 - Phiếu khảo sát ý kiến người bệnh khám ngoại trú theo chuẩn Bộ Y tế tại Bệnh viện Đa khoa Khu vực Thới Lai.',
}

export default function OutpatientSurveyPage() {
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
