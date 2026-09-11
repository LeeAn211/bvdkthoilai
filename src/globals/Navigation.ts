import type { Field, GlobalConfig } from 'payload'
import { loggedIn } from '@/access'
import { resolveNavigationItem } from '@/lib/managedLinks'

const menuLinkFields = (): Field[] => [
  {
    name: 'label',
    label: 'Tên hiển thị',
    type: 'text',
    required: true,
  },
  {
    name: 'linkType',
    label: 'Menu này mở đến đâu?',
    type: 'select',
    required: true,
    defaultValue: 'preset',
    options: [
      { label: 'Gắn cả mục của website (khuyên dùng)', value: 'preset' },
      { label: 'Gắn một bài viết / nội dung cụ thể', value: 'reference' },
      { label: 'Tự tạo trang liên kết mới (1 trang nội dung)', value: 'auto-page' },
      { label: 'Tự tạo MỤC NỘI DUNG mới (có nhiều bài như Thông báo/Đấu thầu)', value: 'auto-section' },
      { label: 'Chọn MỤC NỘI DUNG mở rộng đã có', value: 'content-section' },
      { label: 'Nhập đường dẫn nội bộ', value: 'url' },
      { label: 'Liên kết website bên ngoài', value: 'custom' },
      { label: 'Chỉ làm mục cha (không mở trang)', value: 'parent' },
    ],
    admin: {
      description: 'Ví dụ: chọn “Gắn cả mục” để menu Thông báo mở toàn bộ mục Thông báo, không phải một bài thông báo.',
    },
  },
  {
    name: 'url',
    label: 'Đường dẫn nội bộ',
    type: 'text',
    admin: {
      condition: (_data, siblingData) =>
        siblingData?.linkType === 'url',
      placeholder: '/tin-tuc',
      description: 'Chỉ dùng khi mục cần gắn chưa có trong danh sách mục website.',
    },
  },
  {
    name: 'preset',
    label: 'Chọn mục của website',
    type: 'select',
    options: [
      { label: 'Trang chủ', value: '/' },
      { label: 'Giới thiệu bệnh viện', value: '/gioi-thieu' },
      { label: 'Lịch sử phát triển', value: '/gioi-thieu/lich-su-phat-trien' },
      { label: 'Sơ đồ tổ chức', value: '/so-do-to-chuc' },
      { label: 'Danh sách Khoa / Phòng', value: '/khoa-phong' },
      { label: 'Danh sách Chuyên khoa', value: '/chuyen-khoa' },
      { label: 'Đội ngũ bác sĩ', value: '/bac-si' },
      { label: 'Tin tức – Toàn bộ mục', value: '/tin-tuc' },
      { label: 'Thông báo – Toàn bộ mục', value: '/thong-bao' },
      { label: 'Lịch khám – Toàn bộ mục', value: '/lich-kham' },
      { label: 'Bảng giá dịch vụ – Toàn bộ mục', value: '/bang-gia' },
      { label: 'Tiêm chủng – Toàn bộ mục', value: '/tiem-chung' },
      { label: 'Đấu thầu – Mua sắm', value: '/dau-thau-mua-sam' },
      { label: 'Văn bản – Tài liệu', value: '/van-ban' },
      { label: 'Tuyển dụng', value: '/tuyen-dung' },
      { label: 'Hướng dẫn khám BHYT', value: '/trang/kham-bhyt' },
      { label: 'Liên hệ', value: '/lien-he' },
    ],
    admin: {
      condition: (_data, siblingData) => siblingData?.linkType === 'preset',
      description: 'Chọn một mục để khi bấm menu sẽ mở toàn bộ danh sách nội dung của mục đó.',
    },
  },
  {
    name: 'reference',
    label: 'Chọn một bài viết / nội dung cụ thể',
    type: 'relationship',
    relationTo: [
      'pages',
      'news',
      'notices',
      'procurement',
      'recruitment',
      'documents',
      'departments',
      'specialties',
      'doctors',
    ],
    admin: {
      condition: (_data, siblingData) => siblingData?.linkType === 'reference',
      description:
        'Tùy chọn này chỉ mở một bài cụ thể. Nếu muốn mở cả mục Tin tức hoặc Thông báo, hãy chọn “Gắn cả mục của website”.',
    },
  },


  {
    name: 'contentSection',
    label: 'Chọn mục nội dung mở rộng đã có',
    type: 'relationship',
    relationTo: 'content-sections',
    admin: {
      condition: (_data, siblingData) => siblingData?.linkType === 'content-section',
      description: 'Chọn mục đã có, ví dụ Chuyển đổi số. Menu sẽ tự lấy đúng liên kết của mục.',
    },
  },
  {
    name: 'newSectionTitle',
    label: 'Tên mục nội dung sẽ tự tạo',
    type: 'text',
    admin: {
      condition: (_data, siblingData) => siblingData?.linkType === 'auto-section',
      description: 'Để trống sẽ dùng Tên hiển thị của menu. Ví dụ menu “Chuyển đổi số” sẽ tạo mục nội dung “Chuyển đổi số”.',
    },
  },
  {
    name: 'newSectionSlug',
    label: 'Slug mục nội dung mới (không bắt buộc)',
    type: 'text',
    admin: {
      condition: (_data, siblingData) => siblingData?.linkType === 'auto-section',
      placeholder: 'chuyen-doi-so',
      description: 'Để trống hệ thống tự sinh từ tên. Nếu đã có cùng slug thì dùng lại mục đó, không tạo trùng.',
    },
  },
  {
    name: 'newPageTitle',
    label: 'Tên trang sẽ tự tạo',
    type: 'text',
    admin: {
      condition: (_data, siblingData) => siblingData?.linkType === 'auto-page',
      description: 'Để trống sẽ dùng Tên hiển thị của menu. Hệ thống tự sinh slug; nếu slug đã tồn tại thì dùng lại đúng trang đó.',
    },
  },
  {
    name: 'newPageSlug',
    label: 'Slug trang mới (không bắt buộc)',
    type: 'text',
    admin: {
      condition: (_data, siblingData) => siblingData?.linkType === 'auto-page',
      placeholder: 'tu-sinh-tu-ten-trang',
    },
  },
  {
    name: 'customUrl',
    label: 'Địa chỉ website bên ngoài',
    type: 'text',
    admin: {
      condition: (_data, siblingData) => siblingData?.linkType === 'custom',
      placeholder: 'https://medpro.vn/',
    },
  },
  { name: 'icon', label: 'Icon (tùy chọn)', type: 'text', admin: { description: 'Tên/icon ngắn dùng cho menu mở rộng; để trống nếu không cần.' } },
  { name: 'description', label: 'Mô tả ngắn (tùy chọn)', type: 'text' },
  {
    name: 'openInNewTab',
    label: 'Mở trong tab mới',
    type: 'checkbox',
    defaultValue: false,
  },
  {
    name: 'visible',
    label: 'Hiển thị',
    type: 'checkbox',
    defaultValue: true,
  },
]

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Menu website',
  admin: {
    group: 'Trang chủ & Giao diện',
    description:
      'Mỗi menu và menu con có thể gắn cả một mục website (Tin tức, Thông báo, Lịch khám…), một bài cụ thể hoặc một liên kết bên ngoài.',
  },
  access: {
    read: loggedIn,
    update: loggedIn,
  },
  versions: {
    max: 30,
  },
  hooks: {
    beforeChange: [async ({ data, req }) => {
      for (const item of data?.items || []) await resolveNavigationItem(req, item)
      return data
    }],
  },
  fields: [
    {
      name: 'items',
      label: 'Menu chính',
      type: 'array',
      defaultValue: [
        { label: 'TRANG CHỦ', linkType: 'preset', preset: '/', visible: true },
        {
          label: 'GIỚI THIỆU',
          linkType: 'preset',
          preset: '/gioi-thieu',
          visible: true,
          children: [
            { label: 'Giới thiệu chung', linkType: 'preset', preset: '/gioi-thieu', visible: true },
            { label: 'Lịch sử phát triển', linkType: 'preset', preset: '/gioi-thieu/lich-su-phat-trien', visible: true },
          ],
        },
        {
          label: 'TỔ CHỨC',
          linkType: 'preset',
          preset: '/so-do-to-chuc',
          visible: true,
          children: [
            { label: 'Sơ đồ tổ chức', linkType: 'preset', preset: '/so-do-to-chuc', visible: true },
            { label: 'Khoa – Phòng', linkType: 'preset', preset: '/khoa-phong', visible: true },
            { label: 'Chuyên khoa', linkType: 'preset', preset: '/chuyen-khoa', visible: true },
            { label: 'Đội ngũ Bác sĩ', linkType: 'preset', preset: '/bac-si', visible: true },
          ],
        },
        { label: 'TIN TỨC', linkType: 'preset', preset: '/tin-tuc', visible: true },
        { label: 'THÔNG BÁO', linkType: 'preset', preset: '/thong-bao', visible: true },
        { label: 'LỊCH KHÁM', linkType: 'preset', preset: '/lich-kham', visible: true },
        { label: 'BẢNG GIÁ', linkType: 'preset', preset: '/bang-gia', visible: true },
        { label: 'ĐẤU THẦU', linkType: 'preset', preset: '/dau-thau-mua-sam', visible: true },
      ],
      admin: {
        description: 'Thêm, xóa hoặc kéo thả để sắp xếp. Mỗi dòng có thể gắn cả mục website hoặc một bài cụ thể.',
      },
      labels: {
        singular: 'Mục menu',
        plural: 'Các mục menu',
      },
      fields: [
        ...menuLinkFields(),
        {
          name: 'children',
          label: 'Menu con',
          type: 'array',
          labels: {
            singular: 'Menu con',
            plural: 'Các menu con',
          },
          fields: menuLinkFields(),
        },
      ],
    },
  ],
}
