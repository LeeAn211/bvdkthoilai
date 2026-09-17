import type { Metadata } from 'next'
import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { PatientCareSubNav } from '@/components/PatientCareSubNav'
import InpatientSurveyForm from '@/components/InpatientSurveyForm'

export const metadata: Metadata = {
  title: 'Khảo sát Sự hài lòng Người bệnh Nội trú — BVĐK Khu vực Thới Lai',
  description: 'Mẫu số 1 - Phiếu khảo sát ý kiến người bệnh điều trị nội trú theo chuẩn Bộ Y tế tại Bệnh viện Đa khoa Khu vực Thới Lai.',
}

export default function InpatientSurveyPage() {
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
