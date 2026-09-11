import type { GlobalConfig } from 'payload'
import { loggedIn } from '@/access'
import { resolveSmartLink } from '@/lib/managedLinks'

const defaultQuickLinks = [
  { visible: true, title: 'Đặt lịch khám', description: 'Đặt lịch nhanh chóng', url: 'https://medpro.vn/', visualMode: 'icon', icon: 'calendar', imageFit: 'contain', openNewTab: true },
  { visible: true, title: 'Lịch khám bệnh', description: 'Xem lịch khám bác sĩ', url: '/lich-kham', visualMode: 'icon', icon: 'doctor', imageFit: 'contain', openNewTab: false },
  { visible: true, title: 'Lịch tiêm chủng', description: 'Lịch tiêm theo ngày', url: '/tiem-chung', visualMode: 'icon', icon: 'insurance', imageFit: 'contain', openNewTab: false },
  { visible: true, title: 'Bảng giá dịch vụ', description: 'Tra cứu chi phí', url: '/bang-gia', visualMode: 'icon', icon: 'price', imageFit: 'contain', openNewTab: false },
  { visible: true, title: 'Thông báo', description: 'Thông tin mới nhất', url: '/thong-bao', visualMode: 'icon', icon: 'hospital', imageFit: 'contain', openNewTab: false },
  { visible: true, title: 'Đấu thầu – Mua sắm', description: 'Công khai, minh bạch', url: '/dau-thau-mua-sam', visualMode: 'icon', icon: 'map', imageFit: 'contain', openNewTab: false },
  { visible: true, title: 'Văn bản – Tài liệu', description: 'Tra cứu tài liệu', url: '/van-ban', visualMode: 'icon', icon: 'document', imageFit: 'contain', openNewTab: false },
  { visible: true, title: 'Liên hệ', description: 'Hỗ trợ và phản hồi', url: '/lien-he', visualMode: 'icon', icon: 'phone', imageFit: 'contain', openNewTab: false },
]

export const QuickLinksSettings: GlobalConfig = {
  slug: 'quick-links-settings',
  label: 'Dịch vụ nhanh trang chủ',
  admin: {
    group: 'Trang chủ & Giao diện',
    description: 'Quản lý thanh dịch vụ nhanh dưới banner: thêm, bớt, ẩn/hiện, kéo thả thứ tự và chọn icon hoặc hình riêng cho từng mục.',
  },
  access: { read: loggedIn, update: loggedIn },
  versions: { drafts: true, max: 20 },
  hooks: {
    beforeChange: [async ({ data, req }) => {
      for (const item of data?.items || []) await resolveSmartLink(req, item, item.title || 'Dịch vụ nhanh')
      return data
    }],
  },
  fields: [
    {
      name: 'enabled',
      label: 'Hiển thị khối Dịch vụ nhanh trên trang chủ',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'items',
      label: 'Các mục dịch vụ nhanh',
      type: 'array',
      minRows: 0,
      maxRows: 12,
      defaultValue: defaultQuickLinks,
      admin: {
        description: 'Kéo thả để sắp xếp. Có thể thêm/xóa mục. Muốn tạm ẩn một mục thì bỏ chọn “Hiển thị mục này”.',
      },
      fields: [
        { name: 'visible', label: 'Hiển thị mục này', type: 'checkbox', defaultValue: true },
        { name: 'title', label: 'Tên dịch vụ', type: 'text', required: true },
        { name: 'description', label: 'Mô tả ngắn', type: 'text' },
        {
          name: 'linkMode',
          label: 'Cách tạo liên kết',
          type: 'select',
          defaultValue: 'internal',
          options: [
            { label: 'Tự tạo trang mới / tự dùng trang đã có cùng slug', value: 'auto-page' },
            { label: 'Chọn một Trang nội dung đã có', value: 'existing-page' },
            { label: 'Nhập đường dẫn nội bộ', value: 'internal' },
            { label: 'Liên kết website bên ngoài', value: 'external' },
          ],
          admin: { description: 'Khuyên dùng “Tự tạo trang mới” hoặc “Chọn trang đã có” để không phải nhập URL thủ công.' },
        },
        { name: 'linkedPage', label: 'Chọn trang đã có', type: 'relationship', relationTo: 'pages', admin: { condition: (_data: unknown, siblingData: any) => siblingData?.linkMode === 'existing-page' } },
        { name: 'newPageTitle', label: 'Tên trang sẽ tự tạo', type: 'text', admin: { condition: (_data: unknown, siblingData: any) => siblingData?.linkMode === 'auto-page', description: 'Để trống sẽ dùng Tên dịch vụ. Nếu slug đã tồn tại, hệ thống tự dùng lại trang đó.' } },
        { name: 'newPageSlug', label: 'Slug trang mới (không bắt buộc)', type: 'text', admin: { condition: (_data: unknown, siblingData: any) => siblingData?.linkMode === 'auto-page' } },
        { name: 'url', label: 'Liên kết khi bấm', type: 'text', admin: { condition: (_data: unknown, siblingData: any) => ['internal','external'].includes(siblingData?.linkMode || 'internal'), description: 'Với chế độ tự tạo/chọn trang, trường này được hệ thống tự điền khi lưu.' } },
        { name: 'openNewTab', label: 'Mở liên kết ở tab mới', type: 'checkbox', defaultValue: false },
        {
          name: 'visualMode',
          label: 'Kiểu hình hiển thị',
          type: 'select',
          defaultValue: 'icon',
          options: [
            { label: 'Dùng icon có sẵn', value: 'icon' },
            { label: 'Dùng hình / icon tải lên', value: 'image' },
          ],
        },
        {
          name: 'icon',
          label: 'Icon có sẵn',
          type: 'select',
          defaultValue: 'calendar',
          admin: { condition: (_data: unknown, siblingData: any) => siblingData?.visualMode !== 'image' },
          options: [
            { label: 'Lịch', value: 'calendar' },
            { label: 'Bác sĩ', value: 'doctor' },
            { label: 'Bảng giá', value: 'price' },
            { label: 'BHYT / Tiêm chủng', value: 'insurance' },
            { label: 'Bệnh viện / Thông báo', value: 'hospital' },
            { label: 'Vị trí / Đấu thầu', value: 'map' },
            { label: 'Điện thoại', value: 'phone' },
            { label: 'Tài liệu', value: 'document' },
          ],
        },
        {
          name: 'image',
          label: 'Hình / icon riêng',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (_data: unknown, siblingData: any) => siblingData?.visualMode === 'image',
            description: 'Chọn ảnh đã có trong Media hoặc tải ảnh mới. Khuyên dùng PNG/WebP/SVG vuông, nền trong suốt.',
          },
        },
        {
          name: 'imageFit',
          label: 'Cách vừa khung hình',
          type: 'select',
          defaultValue: 'contain',
          admin: { condition: (_data: unknown, siblingData: any) => siblingData?.visualMode === 'image' },
          options: [
            { label: 'Hiện toàn bộ hình (không cắt)', value: 'contain' },
            { label: 'Phủ đầy khung (có thể cắt mép)', value: 'cover' },
          ],
        },
      ],
    },
  ],
}
