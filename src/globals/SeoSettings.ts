import type { GlobalConfig } from 'payload'
import { admins } from '@/access'

export const SeoSettings: GlobalConfig = {
  slug: 'seo-settings',
  label: 'SEO & Công cụ tìm kiếm',
  admin: {
    group: 'Hệ thống',
    description: 'Cấu hình SEO mặc định, robots, sitemap và thông tin chia sẻ mạng xã hội cho toàn website.',
  },
  access: { read: () => true, update: admins },
  versions: { drafts: true, max: 20 },
  fields: [
    { name: 'siteName', label: 'Tên website', type: 'text', defaultValue: 'Bệnh viện Đa khoa Khu vực Thới Lai', required: true },
    { name: 'defaultTitle', label: 'Tiêu đề SEO mặc định', type: 'text', maxLength: 70, defaultValue: 'Bệnh viện Đa khoa Khu vực Thới Lai' },
    { name: 'titleTemplate', label: 'Mẫu tiêu đề trang con', type: 'text', defaultValue: '%s | BVĐK Khu vực Thới Lai', admin: { description: 'Giữ %s để hệ thống thay bằng tiêu đề từng trang.' } },
    { name: 'defaultDescription', label: 'Mô tả SEO mặc định', type: 'textarea', maxLength: 180, defaultValue: 'Cổng thông tin Bệnh viện Đa khoa Khu vực Thới Lai.' },
    { name: 'defaultImage', label: 'Ảnh chia sẻ mặc định', type: 'upload', relationTo: 'media' },
    { type: 'row', fields: [
      { name: 'allowIndexing', label: 'Cho phép công cụ tìm kiếm lập chỉ mục', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
      { name: 'enableSitemap', label: 'Bật sitemap.xml', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
    ] },
    { name: 'robotsDisallow', label: 'Đường dẫn không cho crawler truy cập', type: 'array', defaultValue: [{ path: '/admin/' }, { path: '/api/' }], fields: [{ name: 'path', label: 'Đường dẫn', type: 'text', required: true }] },
    { name: 'googleSiteVerification', label: 'Google Site Verification', type: 'text', admin: { description: 'Không bắt buộc. Có thể để trống và dùng biến môi trường GOOGLE_SITE_VERIFICATION.' } },
    { name: 'organizationName', label: 'Tên đơn vị cho dữ liệu cấu trúc', type: 'text', defaultValue: 'Bệnh viện Đa khoa Khu vực Thới Lai' },
  ],
}
