import type { Metadata } from 'next'
import { PageHero } from '@/components/PageHero'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { ExaminationFlowView } from './ExaminationFlowView'
import { getGlobal } from '@/lib/payload'
import './quy-trinh-kham-benh.css'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Quy trình Khám bệnh — Bệnh viện Đa khoa Khu vực Thới Lai',
  description:
    'Sơ đồ và hướng dẫn chi tiết quy trình khám bệnh có thẻ BHYT, khám thu phí dịch vụ và quy trình cấp cứu 24/24 tại Bệnh viện Đa khoa Khu vực Thới Lai.',
}

export default async function ExaminationFlowPage() {
  let medproUrl = process.env.NEXT_PUBLIC_MEDPRO_URL || 'https://medpro.vn/'
  let hotline = '0292 3861 234'
  let emergencyHotline = '0292 3861 115'
  let flowSettings: any = {}

  try {
    const siteSettings: any = await getGlobal('site-settings').catch(() => ({}))
    const contactSettings: any = await getGlobal('contact-settings').catch(() => ({}))
    flowSettings = siteSettings?.examinationFlowPage || {}
    medproUrl = siteSettings?.medproUrl || medproUrl
    hotline = contactSettings?.hotline || siteSettings?.hotline || hotline
    emergencyHotline = contactSettings?.emergencyHotline || siteSettings?.emergencyHotline || emergencyHotline
  } catch (err) {
    console.error('[ExaminationFlowPage] Lỗi lấy cấu hình site:', err)
  }

  const eyebrow = flowSettings.eyebrow || 'HƯỚNG DẪN DÀNH CHO NGƯỜI BỆNH'
  const title = flowSettings.title || 'Quy trình Khám chữa bệnh'
  const description =
    flowSettings.description ||
    'Sơ đồ và các bước hướng dẫn người bệnh khi đến thăm khám có thẻ BHYT, khám thu phí dịch vụ hoặc tiếp nhận cấp cứu tại Bệnh viện Đa khoa Khu vực Thới Lai.'

  return (
    <>
      <SiteHeader />
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        breadcrumb="Quy trình khám bệnh"
      />
      <main className="section">
        <div className="container">
          {flowSettings.showNoticeBanner && (flowSettings.noticeContent || flowSettings.noticeTitle) && (
            <div
              style={{
                background: '#eff6ff',
                border: '1.5px solid #93c5fd',
                borderRadius: '16px',
                padding: '20px 24px',
                marginBottom: '28px',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.08)',
                textAlign: flowSettings.noticeAlign || 'left',
              }}
            >
              {flowSettings.noticeTitle && (
                <h3
                  style={{
                    margin: '0 0 10px',
                    color: '#1e40af',
                    fontSize: '17px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    justifyContent:
                      flowSettings.noticeAlign === 'center'
                        ? 'center'
                        : flowSettings.noticeAlign === 'right'
                        ? 'flex-end'
                        : 'flex-start',
                    textWrap: 'balance',
                  }}
                >
                  <span>ℹ️</span> {flowSettings.noticeTitle}
                </h3>
              )}
              {flowSettings.noticeContent && (
                <p
                  style={{
                    margin: 0,
                    color: '#1d4ed8',
                    fontSize: '14px',
                    lineHeight: 1.7,
                    whiteSpace: 'pre-line',
                    textWrap: 'balance',
                  }}
                >
                  {flowSettings.noticeContent}
                </p>
              )}
            </div>
          )}

          <ExaminationFlowView
            medproUrl={medproUrl}
            hotline={hotline}
            emergencyHotline={emergencyHotline}
            settings={flowSettings}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
