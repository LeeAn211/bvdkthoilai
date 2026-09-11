import type { Metadata } from 'next'
import React, { type CSSProperties } from 'react'
import Script from 'next/script'
import { WebsiteAssistant } from '@/components/WebsiteAssistant'
import { getGlobal } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import '../globals.css'
import '../styles/00-tokens.css'
import '../styles/10-public-base.css'
import '../styles/30-home-editorial.css'
import '../styles/90-css-policy.css'

export async function generateMetadata(): Promise<Metadata> {
  let seo: any = {}
  try { seo = await getGlobal('seo-settings') } catch {}
  const siteName = seo?.siteName || 'Bệnh viện Đa khoa Khu vực Thới Lai'
  const defaultTitle = seo?.defaultTitle || siteName
  const description = seo?.defaultDescription || 'Cổng thông tin Bệnh viện Đa khoa Khu vực Thới Lai'
  const image = mediaUrl(seo?.defaultImage)
  const verification = seo?.googleSiteVerification || process.env.GOOGLE_SITE_VERIFICATION
  return {
    title: { default: defaultTitle, template: seo?.titleTemplate || '%s | BVĐK Khu vực Thới Lai' },
    description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    robots: seo?.allowIndexing === false ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: { type: 'website', locale: 'vi_VN', siteName, title: defaultTitle, description, images: image ? [image] : [] },
    twitter: { card: 'summary_large_image', title: defaultTitle, description, images: image ? [image] : [] },
    verification: verification ? { google: verification } : undefined,
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let settings: any = {}
  let chatbotSettings: any = {}
  let theme: any = {}
  const gaID = process.env.NEXT_PUBLIC_GA_ID
  try { settings = await getGlobal('site-settings') } catch {}
  try { chatbotSettings = await getGlobal('chatbot-settings') } catch {}
  try { theme = await getGlobal('theme-settings') } catch {}
  const assistant = { ...(settings?.websiteAssistant || {}), ...(chatbotSettings || {}) }
  const fontFamily = theme?.fontFamily === 'arial' ? 'Arial, sans-serif' : theme?.fontFamily === 'tahoma' ? 'Tahoma, sans-serif' : '"Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif'
  const fontScale = Math.max(0.9, Math.min(1.4, Number(theme?.fontScale || 115) / 100))
  const bodyStyle = {
    '--site-base-font-size': `${theme?.baseFontSize || 16}px`,
    '--site-font-family': fontFamily,
    '--site-fs-6-5': `${6.5 * fontScale}px`, '--site-fs-7-5': `${7.5 * fontScale}px`, '--site-fs-8': `${8 * fontScale}px`,
    '--site-fs-8-5': `${8.5 * fontScale}px`, '--site-fs-9-5': `${9.5 * fontScale}px`, '--site-fs-10': `${10 * fontScale}px`,
    '--site-fs-11': `${11 * fontScale}px`, '--site-fs-12': `${12 * fontScale}px`,
    '--site-title-scale': fontScale,
  } as CSSProperties
  return (
    <html lang="vi">
      <body style={bodyStyle}>
        {gaID && <><Script src={`https://www.googletagmanager.com/gtag/js?id=${gaID}`} strategy="afterInteractive"/><Script id="ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaID}',{anonymize_ip:true});`}</Script></>}
        {children}
        <WebsiteAssistant
          enabled={assistant.enabled !== false}
          backToTopEnabled={assistant.backToTopEnabled !== false}
          assistantName={assistant.assistantName || 'Trợ lý Thới Lai'}
          statusText={assistant.statusText || 'Đang trực tuyến'}
          greeting={assistant.greeting}
          logoUrl={mediaUrl(assistant.assistantLogo || settings?.logo)}
          primaryColor={assistant.primaryColor || settings?.brand?.primaryColor || '#0878D1'}
          hotline={settings?.hotline || settings?.emergencyHotline || process.env.NEXT_PUBLIC_HOTLINE || '02923689115'}
          medproUrl={settings?.medproUrl || process.env.NEXT_PUBLIC_MEDPRO_URL || 'https://medpro.vn/'}
          inputPlaceholder={assistant.inputPlaceholder || 'Nhập nội dung cần hỏi…'}
          noticeText={assistant.noticeText || 'Thông tin chỉ mang tính tham khảo. Trường hợp cấp cứu, vui lòng gọi bệnh viện ngay.'}
          fallbackResponse={assistant.fallbackResponse || 'Tôi chưa hiểu rõ câu hỏi. Bạn có thể gửi nội dung này cho tư vấn viên.'}
          fallbackLinkLabel={assistant.fallbackLinkLabel || 'Liên hệ bệnh viện'}
          fallbackLinkUrl={assistant.fallbackLinkUrl || '/lien-he'}
          quickTopics={Array.isArray(assistant.quickTopics) ? assistant.quickTopics : undefined}
          customAnswers={Array.isArray(assistant.customAnswers) ? assistant.customAnswers : undefined}
        />
      </body>
    </html>
  )
}
