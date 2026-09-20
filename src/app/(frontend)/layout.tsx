import type { Metadata } from 'next'
import React, { type CSSProperties } from 'react'
import Script from 'next/script'
import { WebsiteAssistant } from '@/components/WebsiteAssistant'
import { MobileBottomNav } from '@/components/MobileBottomNav'
import { getGlobal } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'
import { resolveBookingConfig } from '@/lib/booking'
import '../globals.css'
import '../styles/00-tokens.css'
import '../styles/10-public-base.css'
import '../styles/30-home-editorial.css'
import '../styles/daily-schedule.css'
import '../styles/patient-care.css'
import '../styles/outpatient-survey.css'
import '../styles/mobile-medpro.css'
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
  let footer: any = {}
  let displaySettings: any = {}
  let medproSettings: any = {}
  const gaID = process.env.NEXT_PUBLIC_GA_ID
  try { settings = await getGlobal('site-settings') } catch {}
  try { chatbotSettings = await getGlobal('chatbot-settings') } catch {}
  try { theme = await getGlobal('theme-settings') } catch {}
  try { footer = await getGlobal('footer') } catch {}
  try { displaySettings = await getGlobal('display-settings') } catch {}
  try { medproSettings = await getGlobal('medpro-settings') } catch {}
  const assistant = { ...(settings?.websiteAssistant || {}), ...(chatbotSettings || {}) }
  const booking = resolveBookingConfig(medproSettings, settings)
  const fontFamily = theme?.fontFamily === 'arial' ? 'Arial, sans-serif' : theme?.fontFamily === 'tahoma' ? 'Tahoma, sans-serif' : '"Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif'
  const fontScale = Math.max(0.9, Math.min(1.4, Number(theme?.fontScale || 115) / 100))
  const pageHero = theme?.pageHero || {}
  const pageHeroBgType = pageHero.bgType || 'gradient'
  const pageHeroBg = pageHeroBgType === 'solid'
    ? (pageHero.bgSolidColor || '#0754a8')
    : `linear-gradient(135deg, ${pageHero.bgGradientStart || '#072b4c'} 0%, ${pageHero.bgGradientMiddle || '#0754a8'} 55%, ${pageHero.bgGradientEnd || '#0878d1'} 100%)`

  const bodyStyle = {
    '--site-base-font-size': `${theme?.baseFontSize || 16}px`,
    '--site-font-family': fontFamily,
    '--site-fs-6-5': `${6.5 * fontScale}px`, '--site-fs-7-5': `${7.5 * fontScale}px`, '--site-fs-8': `${8 * fontScale}px`,
    '--site-fs-8-5': `${8.5 * fontScale}px`, '--site-fs-9-5': `${9.5 * fontScale}px`, '--site-fs-10': `${10 * fontScale}px`,
    '--site-fs-11': `${11 * fontScale}px`, '--site-fs-12': `${12 * fontScale}px`,
    '--site-title-scale': fontScale,
    // Page Hero tokens
    '--page-hero-bg': pageHeroBg,
    '--page-hero-padding': `${pageHero.paddingVertical ?? 22}px 0 20px`,
    '--page-hero-title-color': pageHero.titleColor || '#ffffff',
    '--page-hero-title-size': `${pageHero.titleFontSize ?? 26}px`,
    '--page-hero-desc-color': pageHero.descColor || '#e2f1fc',
    '--page-hero-desc-size': `${pageHero.descFontSize ?? 14}px`,
    '--page-hero-breadcrumb-color': pageHero.breadcrumbColor || '#bae6fd',
    '--page-hero-breadcrumb-link': pageHero.breadcrumbLinkColor || '#e0f2fe',
    // Section Global tokens
    '--section-global-background': theme?.sectionGlobal?.bgColor || '#ffffff',
    '--section-global-border-radius': `${theme?.sectionGlobal?.borderRadius ?? 18}px`,
    '--section-global-padding-top': `${theme?.sectionGlobal?.paddingTop ?? 28}px`,
    '--section-global-padding-bottom': `${theme?.sectionGlobal?.paddingBottom ?? 28}px`,
    '--section-global-content-width': `${theme?.sectionGlobal?.contentWidth ?? 1180}px`,
    '--section-global-eyebrow-color': theme?.sectionGlobal?.eyebrowColor || '#0878d1',
    '--section-global-eyebrow-size': `${theme?.sectionGlobal?.eyebrowSize ?? 11}px`,
    '--section-global-title-color': theme?.sectionGlobal?.titleColor || '#124064',
    '--section-global-title-size': `${theme?.sectionGlobal?.titleSize ?? 26}px`,
    '--section-global-desc-color': theme?.sectionGlobal?.descColor || '#657f92',
    '--section-global-desc-size': `${theme?.sectionGlobal?.descSize ?? 13}px`,
    '--section-global-heading-gap': `${theme?.sectionGlobal?.headingGap ?? 18}px`,
  } as CSSProperties
  return (
    <html lang="vi" data-scroll-behavior="smooth">
      <body style={bodyStyle}>
        {gaID && <><Script src={`https://www.googletagmanager.com/gtag/js?id=${gaID}`} strategy="afterInteractive"/><Script id="ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaID}',{anonymize_ip:true});`}</Script></>}
        {children}
        <WebsiteAssistant
          enabled={assistant.enabled !== false}
          backToTopEnabled={assistant.backToTopEnabled !== false}
          assistantVisibility={displaySettings?.floatingAssistant || 'both'}
          backToTopVisibility={displaySettings?.floatingBackToTop || 'both'}
          assistantName={assistant.assistantName || 'Trợ lý Thới Lai'}
          statusText={assistant.statusText || 'Đang trực tuyến'}
          greeting={assistant.greeting}
          logoUrl={mediaUrl(assistant.assistantLogo || settings?.logo)}
          primaryColor={assistant.primaryColor || settings?.brand?.primaryColor || '#0878D1'}
          hotline={settings?.hotline || settings?.emergencyHotline || process.env.NEXT_PUBLIC_HOTLINE || '02923689115'}
          medproUrl={booking.url}
          bookingEnabled={booking.enabled}
          inputPlaceholder={assistant.inputPlaceholder || 'Nhập nội dung cần hỏi…'}
          noticeText={assistant.noticeText || 'Thông tin chỉ mang tính tham khảo. Trường hợp cấp cứu, vui lòng gọi bệnh viện ngay.'}
          fallbackResponse={assistant.fallbackResponse || 'Tôi chưa hiểu rõ câu hỏi. Bạn có thể gửi nội dung này cho tư vấn viên.'}
          fallbackLinkLabel={assistant.fallbackLinkLabel || 'Liên hệ bệnh viện'}
          fallbackLinkUrl={assistant.fallbackLinkUrl || '/lien-he'}
          quickTopics={Array.isArray(assistant.quickTopics) ? assistant.quickTopics : undefined}
          customAnswers={Array.isArray(assistant.customAnswers) ? assistant.customAnswers : undefined}
        />
        <MobileBottomNav
          enabled={footer?.showMobileBar !== false}
          hotline={settings?.hotline || process.env.NEXT_PUBLIC_HOTLINE || '02923686115'}
          emergencyHotline={settings?.emergencyHotline || '02923686115'}
          medproUrl={booking.url}
          bookingOpenNewTab={booking.openNewTab}
          navVisibility={displaySettings?.mobileBottomNav || 'mobile_only'}
          bookingBtnVisibility={booking.enabled ? (displaySettings?.mobileBottomBookingBtn || 'mobile_only') : 'off'}
          emergencyBtnVisibility={displaySettings?.mobileBottomEmergencyBtn || 'mobile_only'}
        />
      </body>
    </html>
  )
}
