import type { GlobalConfig } from 'payload'
import { loggedIn } from '@/access'
import { resolveSmartLink } from '@/lib/managedLinks'

const footerLinkFields: any[] = [
  { name: 'visible', label: 'Hiển thị liên kết', type: 'checkbox', defaultValue: true },
  { name: 'label', label: 'Tên liên kết', type: 'text', required: true },
  {
    name: 'linkMode',
    label: 'Cách tạo liên kết',
    type: 'select',
    defaultValue: 'internal',
    options: [
      { label: 'Tự tạo trang mới / dùng trang cùng slug đã có', value: 'auto-page' },
      { label: 'Chọn một Trang nội dung đã có', value: 'existing-page' },
      { label: 'Nhập đường dẫn nội bộ', value: 'internal' },
      { label: 'Liên kết website bên ngoài', value: 'external' },
    ],
  },
  { name: 'linkedPage', label: 'Chọn trang đã có', type: 'relationship', relationTo: 'pages', admin: { condition: (_data: unknown, siblingData: any) => siblingData?.linkMode === 'existing-page' } },
  { name: 'newPageTitle', label: 'Tên trang sẽ tự tạo', type: 'text', admin: { condition: (_data: unknown, siblingData: any) => siblingData?.linkMode === 'auto-page' } },
  { name: 'newPageSlug', label: 'Slug trang mới (không bắt buộc)', type: 'text', admin: { condition: (_data: unknown, siblingData: any) => siblingData?.linkMode === 'auto-page' } },
  { name: 'url', label: 'Đường dẫn', type: 'text', admin: { condition: (_data: unknown, siblingData: any) => ['internal', 'external'].includes(siblingData?.linkMode || 'internal') } },
  { name: 'openNewTab', label: 'Mở tab mới', type: 'checkbox', defaultValue: false },
]

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Chân trang',
  admin: {
    group: 'Trang chủ & Giao diện',
    description: 'Quản lý toàn bộ nội dung Footer. Có thể ẩn/hiện từng thông tin, thêm/bớt cột và từng liên kết mà không cần sửa code.',
  },
  access: { read: loggedIn, update: loggedIn },
  versions: { max: 30 },
  hooks: {
    beforeChange: [async ({ data, req }) => {
      for (const column of data?.columns || []) {
        for (const link of column?.links || []) await resolveSmartLink(req, link, link?.label || column?.title || 'Trang nội dung')
      }
      return data
    }],
  },
  fields: [
    { name: 'enabled', label: 'Hiển thị Footer', type: 'checkbox', defaultValue: true },
    {
      name: 'brandOptions',
      label: 'Khối thông tin bệnh viện',
      type: 'group',
      fields: [
        { name: 'showLogo', label: 'Hiển thị logo', type: 'checkbox', defaultValue: true },
        { name: 'showHospitalName', label: 'Hiển thị tên bệnh viện', type: 'checkbox', defaultValue: true },
        { name: 'showAddress', label: 'Hiển thị địa chỉ', type: 'checkbox', defaultValue: true },
        { name: 'showPhone', label: 'Hiển thị điện thoại', type: 'checkbox', defaultValue: true },
        { name: 'showEmergencyHotline', label: 'Hiển thị số cấp cứu riêng (nếu khác số chính)', type: 'checkbox', defaultValue: true },
        { name: 'showEmail', label: 'Hiển thị email', type: 'checkbox', defaultValue: true },
        { name: 'showWorkingHours', label: 'Hiển thị thời gian làm việc', type: 'checkbox', defaultValue: true },
        { name: 'showDescription', label: 'Hiển thị mô tả bệnh viện', type: 'checkbox', defaultValue: true },
      ],
    },
    { name: 'description', label: 'Mô tả bệnh viện tại Footer', type: 'textarea', admin: { description: 'Để trống sẽ lấy mô tả Footer/Cấu hình website hiện có.' } },
    {
      name: 'columns',
      label: 'Các cột liên kết',
      type: 'array',
      minRows: 0,
      maxRows: 6,
      admin: { description: 'Kéo thả để sắp xếp. Có thể xóa toàn bộ cột nếu không cần. Mỗi cột và mỗi liên kết đều có công tắc ẩn/hiện.' },
      fields: [
        { name: 'visible', label: 'Hiển thị cột này', type: 'checkbox', defaultValue: true },
        { name: 'title', label: 'Tiêu đề cột', type: 'text', required: true },
        { name: 'links', label: 'Liên kết', type: 'array', minRows: 0, fields: footerLinkFields },
      ],
    },
    { name: 'showSocial', label: 'Hiển thị mạng xã hội ở Footer', type: 'checkbox', defaultValue: true, admin: { description: 'Chỉ bật/tắt hiển thị. Link và icon Facebook/Zalo/YouTube/TikTok được quản lý tại Header & Nhận diện để đồng bộ với Header.' } },
    {
      name: 'bottom', label: 'Thanh cuối Footer', type: 'group', fields: [
        { name: 'showCopyright', label: 'Hiển thị bản quyền', type: 'checkbox', defaultValue: true },
        { name: 'copyright', label: 'Nội dung bản quyền', type: 'text', defaultValue: '© {CURRENT_YEAR} Bệnh viện Đa khoa Khu vực Thới Lai' },
        { name: 'showRightText', label: 'Hiển thị nội dung bên phải', type: 'checkbox', defaultValue: true },
        { name: 'rightText', label: 'Nội dung bên phải', type: 'text', defaultValue: 'Cổng thông tin điện tử' },
      ],
    },
    { name: 'showMobileBar', label: 'Hiển thị thanh tiện ích mobile', type: 'checkbox', defaultValue: true },
  ],
}
