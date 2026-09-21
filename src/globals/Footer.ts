import type { GlobalConfig } from 'payload'
import { loggedIn, moduleAccess } from '@/access'
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
    group: '🌐 Trang chủ & Giao diện Website',
    description: 'Quản lý toàn bộ nội dung Footer. Có thể ẩn/hiện từng thông tin, thêm/bớt cột và từng liên kết mà không cần sửa code.',
  },
  access: { read: loggedIn, update: moduleAccess('site-settings', 'edit') },
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
      name: 'quickBar',
      label: 'Thanh tiện ích nhanh & Cấp cứu (Đầu chân trang)',
      type: 'group',
      admin: {
        description: 'Tùy chỉnh bật/tắt thanh tiện ích nhanh ở đầu chân trang và các nút gọi cấp cứu, đặt khám, hướng dẫn.',
      },
      fields: [
        { name: 'enabled', label: 'Bật hiển thị thanh tiện ích nhanh đầu chân trang', type: 'checkbox', defaultValue: true },
        {
          type: 'row',
          fields: [
            { name: 'showEmergency', label: 'Hiện thẻ gọi Cấp cứu 24/24', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
            { name: 'showBooking', label: 'Hiện nút Đặt khám trực tuyến', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'showGuide', label: 'Hiện nút Quy trình khám', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
            { name: 'showFeedback', label: 'Hiện nút Góp ý & Liên hệ', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'emergencyLabel', label: 'Nhãn thẻ cấp cứu (mặc định: Cấp cứu trực 24/24)', type: 'text', admin: { width: '50%', placeholder: 'Cấp cứu trực 24/24' } },
            { name: 'emergencyPhone', label: 'Số điện thoại cấp cứu riêng tại chân trang (để trống lấy từ Liên hệ & Bản đồ)', type: 'text', admin: { width: '50%', placeholder: 'VD: 0292 3861 115' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'guideLabel', label: 'Tên nút Quy trình (mặc định: Quy trình khám)', type: 'text', admin: { width: '50%', placeholder: 'Quy trình khám' } },
            { name: 'guideUrl', label: 'Đường dẫn nút Quy trình', type: 'text', admin: { width: '50%', placeholder: '/quy-trinh-kham-benh' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'feedbackLabel', label: 'Tên nút Góp ý (mặc định: Góp ý & Liên hệ)', type: 'text', admin: { width: '50%', placeholder: 'Góp ý & Liên hệ' } },
            { name: 'feedbackUrl', label: 'Đường dẫn nút Góp ý', type: 'text', admin: { width: '50%', placeholder: '/lien-he' } },
          ],
        },
      ],
    },
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
      defaultValue: [
        {
          visible: true,
          title: 'Dành cho người bệnh',
          links: [
            { visible: true, label: 'Đặt lịch khám', linkMode: 'external', url: 'https://medpro.vn/' },
            { visible: true, label: 'Giờ làm việc', linkMode: 'internal', url: '/lich-lam-viec' },
            { visible: true, label: 'Lịch khám & Trực', linkMode: 'internal', url: '/lich-kham' },
            { visible: true, label: 'Bảng giá dịch vụ', linkMode: 'internal', url: '/bang-gia' },
            { visible: true, label: 'Hướng dẫn BHYT', linkMode: 'internal', url: '/trang/kham-bhyt' },
          ],
        },
        {
          visible: true,
          title: 'Thông tin bệnh viện',
          links: [
            { visible: true, label: 'Giới thiệu', linkMode: 'internal', url: '/gioi-thieu' },
            { visible: true, label: 'Tin tức', linkMode: 'internal', url: '/tin-tuc' },
            { visible: true, label: 'Thông báo', linkMode: 'internal', url: '/thong-bao' },
            { visible: true, label: 'Đấu thầu – Mua sắm', linkMode: 'internal', url: '/dau-thau-mua-sam' },
          ],
        },
        {
          visible: true,
          title: 'Hỗ trợ',
          links: [
            { visible: true, label: 'Góp ý – Phản hồi', linkMode: 'internal', url: '/lien-he' },
            { visible: true, label: 'Văn bản – Tài liệu', linkMode: 'internal', url: '/van-ban' },
            { visible: true, label: 'Tìm kiếm thông tin', linkMode: 'internal', url: '/tim-kiem' },
          ],
        },
      ],
      fields: [
        { name: 'visible', label: 'Hiển thị cột này', type: 'checkbox', defaultValue: true },
        { name: 'title', label: 'Tiêu đề cột', type: 'text', required: true },
        {
          name: 'textAlign',
          label: 'Canh lề cột',
          type: 'select',
          dbName: 'ft_col_align',
          defaultValue: 'left',
          options: [
            { label: 'Canh trái (Mặc định)', value: 'left' },
            { label: 'Canh giữa', value: 'center' },
            { label: 'Canh phải', value: 'right' },
          ],
        },
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
    {
      name: 'visitStats',
      label: 'Thống kê lượt truy cập website',
      type: 'group',
      admin: {
        description: 'Quản lý hiển thị số lượt truy cập (hôm nay, tháng này, tổng số, đang online) tại chân trang website.',
      },
      fields: [
        {
          name: 'showStats',
          label: 'Bật hiển thị thống kê lượt truy cập ngoài Website (Footer)',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'BẬT / TẮT hiển thị thanh thống kê lượt truy cập ở chân trang ngoài website công khai.',
          },
        },
        {
          type: 'row',
          fields: [
            { name: 'showOnline', label: 'Hiện số người đang online', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
            { name: 'showToday', label: 'Hiện lượt truy cập hôm nay', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'showMonth', label: 'Hiện lượt truy cập tháng này', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
            { name: 'showTotal', label: 'Hiện tổng lượt truy cập', type: 'checkbox', defaultValue: true, admin: { width: '50%' } },
          ],
        },
        {
          name: 'initialOffset',
          label: 'Số lượt truy cập khởi tạo cộng thêm',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Cộng thêm số lượt truy cập ban đầu từ hệ thống cũ (nếu có) vào tổng lượt hiển thị.',
          },
        },
      ],
    },
    { name: 'showMobileBar', label: 'Hiển thị thanh tiện ích mobile', type: 'checkbox', defaultValue: true },
  ],
}
