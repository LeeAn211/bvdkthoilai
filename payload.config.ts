import path from 'path'
import { fileURLToPath } from 'url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
import { vi } from '@payloadcms/translations/languages/vi'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Users } from './src/collections/Users'
import { Media } from './src/collections/Media'
import { News } from './src/collections/News'
import { Notices } from './src/collections/Notices'
import { Procurement } from './src/collections/Procurement'
import { Documents } from './src/collections/Documents'
import { Departments } from './src/collections/Departments'
import { Doctors } from './src/collections/Doctors'
import { Specialties } from './src/collections/Specialties'
import { Schedules } from './src/collections/Schedules'
import { Services } from './src/collections/Services'
import { Vaccinations } from './src/collections/Vaccinations'
import { ServicePrices } from './src/collections/ServicePrices'
import { Vaccines } from './src/collections/Vaccines'
import { VaccinePrices } from './src/collections/VaccinePrices'
import { VaccinationSchedules } from './src/collections/VaccinationSchedules'
import { ImportJobs } from './src/collections/ImportJobs'
import { Recruitment } from './src/collections/Recruitment'
import { Pages } from './src/collections/Pages'
import { Feedback } from './src/collections/Feedback'
import { Consultations } from './src/collections/Consultations'
import { Categories } from './src/collections/Categories'
import { Redirects } from './src/collections/Redirects'
import { DynamicModules } from './src/collections/DynamicModules'
import { ContentSections } from './src/collections/ContentSections'
import { CustomPosts } from './src/collections/CustomPosts'
import { FAQs } from './src/collections/FAQs'
import { Forms } from './src/collections/Forms'
import { FormSubmissions } from './src/collections/FormSubmissions'
import { FeedbackCategories } from './src/collections/FeedbackCategories'
import { FeedbackCases } from './src/collections/FeedbackCases'
import { FeedbackActions } from './src/collections/FeedbackActions'
import { ChatbotIntents } from './src/collections/ChatbotIntents'
import { ChatbotConversations } from './src/collections/ChatbotConversations'
import { ChatbotUnanswered } from './src/collections/ChatbotUnanswered'
import { SurveyTemplates } from './src/collections/SurveyTemplates'
import { SurveyTemplateVersions } from './src/collections/SurveyTemplateVersions'
import { SurveyQuestions } from './src/collections/SurveyQuestions'
import { SurveyCampaigns } from './src/collections/SurveyCampaigns'
import { SurveyCodes } from './src/collections/SurveyCodes'
import { SurveyResponses } from './src/collections/SurveyResponses'
import { SurveyAnswers } from './src/collections/SurveyAnswers'
import { SurveyStatistics } from './src/collections/SurveyStatistics'
import { AuditLogs } from './src/collections/AuditLogs'
import { SiteSettings } from './src/globals/SiteSettings'
import { Navigation } from './src/globals/Navigation'
import { Homepage } from './src/globals/Homepage'
import { OrganizationChart } from './src/globals/OrganizationChart'
import { UploadSettings } from './src/globals/UploadSettings'
import { Footer } from './src/globals/Footer'
import { ContactSettings } from './src/globals/ContactSettings'
import { SocialSettings } from './src/globals/SocialSettings'
import { MedproSettings } from './src/globals/MedproSettings'
import { ThemeSettings } from './src/globals/ThemeSettings'
import { DefaultMediaSettings } from './src/globals/DefaultMediaSettings'
import { SeoSettings } from './src/globals/SeoSettings'
import { ChatbotSettings } from './src/globals/ChatbotSettings'
import { SystemSettings } from './src/globals/SystemSettings'
import { ScheduleSettings } from './src/globals/ScheduleSettings'
import { QuickLinksSettings } from './src/globals/QuickLinksSettings'
import { withAudit, withGlobalAudit } from './src/lib/audit'
import { hospitalEditor } from './src/editor/hospitalEditor'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const isProduction = process.env.NODE_ENV === 'production'
const payloadSecret = process.env.PAYLOAD_SECRET
const databaseURL = process.env.DATABASE_URL
const siteURL = process.env.NEXT_PUBLIC_SITE_URL
const localOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000']
const allowedOrigins = Array.from(new Set([...(siteURL ? [siteURL] : []), ...(!isProduction ? localOrigins : [])]))

const r2Bucket = process.env.R2_BUCKET || ''
const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID || ''
const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY || ''
const r2Endpoint = process.env.R2_ENDPOINT || ''
const mediaStorage = String(process.env.MEDIA_STORAGE || '').trim().toLowerCase()
const r2EnvConfigured = Boolean(r2Bucket && r2AccessKeyId && r2SecretAccessKey && r2Endpoint)

// Production có đủ biến R2 thì dùng R2. Local/offline mặc định luôn dùng thư mục /media
// để không bị lỗi khi máy không có mạng hoặc còn sót biến R2 trong .env.local.
// Muốn test R2 ở local thì đặt MEDIA_STORAGE=r2.
const r2Enabled = r2EnvConfigured && (isProduction || mediaStorage === 'r2')

if (isProduction && (!payloadSecret || payloadSecret === 'CHANGE_ME' || payloadSecret.length < 32)) {
  throw new Error('PAYLOAD_SECRET bắt buộc phải có ít nhất 32 ký tự trên Production.')
}
if (!databaseURL) throw new Error('Thiếu biến môi trường DATABASE_URL.')

export default buildConfig({
  ...(isProduction && siteURL ? { serverURL: siteURL } : {}),
  maxDepth: 4,
  upload: { limits: { fileSize: 50 * 1024 * 1024 } },
  graphQL: { disable: true },
  cors: allowedOrigins,
  csrf: allowedOrigins,
  i18n: {
    supportedLanguages: { vi },
    fallbackLanguage: 'vi',
  },
  editor: hospitalEditor,
  secret: payloadSecret || 'development-only-secret-change-before-production',
  db: postgresAdapter({
    push: process.env.PAYLOAD_DB_PUSH === 'true',
    pool: {
      connectionString: databaseURL,
      connectionTimeoutMillis: 8000,
      max: 20,
      idleTimeoutMillis: 30000,
    }
  }),
  sharp,
  // Luôn đăng ký adapter để importMap Production nhận diện đúng component S3.
  // `enabled` quyết định upload thật sự đi R2 hay local /media.
  plugins: [
    s3Storage({
      enabled: r2Enabled,
      collections: {
        // Keep Payload proxy/access control for public/internal/restricted media.
        media: true,
      },
      bucket: r2Bucket || 'r2-disabled-at-build',
      config: {
        credentials: {
          accessKeyId: r2AccessKeyId || 'r2-disabled-at-build',
          secretAccessKey: r2SecretAccessKey || 'r2-disabled-at-build',
        },
        region: 'auto',
        endpoint: r2Endpoint || 'https://example.invalid',
        forcePathStyle: true,
      },
    }),
  ],
  typescript: { outputFile: path.resolve(dirname, 'src/payload-types.ts') },
  admin: {
    user: Users.slug,
    components: {
      beforeDashboard: ['/src/components/admin/AdminDashboard'],
      beforeNavLinks: ['/src/components/admin/AdminNavHeader'],
      afterNavLinks: ['/src/components/admin/AdminLogoutButton'],
      graphics: {
        Logo: '/src/components/admin/AdminLogo',
        Icon: '/src/components/admin/AdminIcon',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: path.resolve(dirname, 'src/app/(payload)/admin/importMap.js'),
    },
    meta: {
      titleSuffix: ' — BVĐK Khu vực Thới Lai'
    }
  },
  collections: [
    Users,
    ...[Media, News, Notices, Procurement, Documents,
      Departments, Specialties, Doctors, Schedules, Services, ServicePrices, Vaccinations, VaccinationSchedules, Vaccines, VaccinePrices, Recruitment, Pages, Categories, Feedback, Consultations, FeedbackCategories, FeedbackCases, FeedbackActions, FAQs, Forms, FormSubmissions, ChatbotIntents, ChatbotConversations, ChatbotUnanswered, SurveyTemplates, SurveyTemplateVersions, SurveyQuestions, SurveyCampaigns, SurveyCodes, SurveyResponses, SurveyAnswers, SurveyStatistics, Redirects, DynamicModules, ContentSections, CustomPosts, ImportJobs
    ].map((collection) => withAudit(collection)),
    AuditLogs,
  ],
  globals: [SiteSettings, Navigation, Footer, ContactSettings, SocialSettings, MedproSettings, ThemeSettings, Homepage, OrganizationChart, UploadSettings, DefaultMediaSettings, SeoSettings, ChatbotSettings, SystemSettings, ScheduleSettings, QuickLinksSettings].map((global) => withGlobalAudit(global))
})
