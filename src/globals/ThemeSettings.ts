import type { GlobalConfig, Field } from 'payload'
import { loggedIn } from '@/access'

const colorField = (name: string, label: string, defaultValue?: string): Field => ({
  name,
  label,
  type: 'text',
  ...(defaultValue ? { defaultValue } : {}),
  admin: { components: { Field: '/src/components/admin/ColorPickerField#default' } },
} as Field)

export const ThemeSettings: GlobalConfig = {
  slug: 'theme-settings',
  label: 'Màu sắc & Giao diện',
  admin: { group: 'Trang chủ & Giao diện' },
  access: { read: loggedIn, update: loggedIn },
  versions: { max: 20 },
  fields: [
    colorField('primaryColor', 'Màu chính', '#0878D1'),
    colorField('secondaryColor', 'Màu phụ', '#0754A8'),
    colorField('accentColor', 'Màu nhấn', '#16A36A'),
    {
      name: 'fontFamily',
      label: 'Font chữ',
      type: 'select',
      defaultValue: 'system',
      options: [
        { label: 'Segoe UI / hệ thống', value: 'system' },
        { label: 'Arial', value: 'arial' },
        { label: 'Tahoma', value: 'tahoma' },
      ],
    },
    {
      name: 'baseFontSize',
      label: 'Cỡ chữ toàn website (px)',
      type: 'number',
      defaultValue: 16,
      min: 13,
      max: 22,
      admin: {
        description: 'Điều chỉnh đồng bộ cỡ chữ nội dung toàn website. Khuyến nghị 16–18 px; mặc định 16 px.',
      },
    },
    {
      name: 'fontScale',
      label: 'Tỷ lệ phóng chữ giao diện (%)',
      type: 'number',
      defaultValue: 115,
      min: 90,
      max: 140,
      admin: {
        description: 'Phóng riêng hệ thống chữ giao diện, không làm phóng ảnh/banner. 100% = cỡ cũ; khuyến nghị 110–120%.',
      },
    },
    { name: 'contentMaxWidth', label: 'Độ rộng nội dung tối đa (px)', type: 'number', defaultValue: 1300, min: 960, max: 1600 },

    // =========================================================================
    // CẤU HÌNH MẪU GIAO DIỆN TRANG CHI TIẾT BÀI VIẾT (CHUẨN)
    // =========================================================================
    {
      name: 'detailLayout',
      label: 'Mẫu giao diện trang chi tiết bài viết (Chuẩn)',
      type: 'group',
      admin: {
        description:
          'Tùy biến toàn diện mẫu giao diện chi tiết: phạm vi áp dụng, thanh chia sẻ mạng xã hội, banner đặt lịch/hành động, hiển thị tin liên quan và nguồn bài viết.',
      },
      fields: [
        // --- 1. PHẠM VI ÁP DỤNG ---
        {
          name: 'applyNews',
          label: 'Áp dụng cho Tin tức & Hoạt động (/tin-tuc/[slug])',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'applyProcurement',
          label: 'Áp dụng cho Đấu thầu – Mua sắm (/dau-thau-mua-sam/[slug])',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'applyRecruitment',
          label: 'Áp dụng cho Tuyển dụng (/tuyen-dung/[slug])',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'applyCustomPosts',
          label: 'Áp dụng cho Bài viết mục Menu mở rộng (/noi-dung/[section]/[slug])',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'applyAllNewSections',
          label: 'Tự động áp dụng cho TẤT CẢ các mục nội dung / chuyên đề mới tạo trong tương lai',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description:
              'Khi bật, bất kỳ mục menu/nội dung mới nào được tạo trong tương lai đều sẽ tự động dùng mẫu chuẩn này mà không cần thiết kế lại.',
          },
        },
        {
          name: 'customSlugsText',
          label: 'Danh sách các mục nội dung áp dụng (Ngăn cách bằng dấu phẩy)',
          type: 'textarea',
          admin: {
            description:
              'Nhập các slug mục mới muốn áp dụng mẫu chuẩn, ngăn cách bằng dấu phẩy. Ví dụ: chuyen-doi-so, dao-tao, nghien-cuu-khoa-hoc, hoat-dong-doan-the',
            placeholder: 'chuyen-doi-so, dao-tao, khao-sat',
          },
        },

        // --- 2. TÙY CHỈNH THANH CHIA SẺ BÊN TRÁI ---
        {
          name: 'shareSettings',
          label: 'Cài đặt thanh chia sẻ bài viết (Cột trái)',
          type: 'group',
          fields: [
            { name: 'enabled', label: 'Bật thanh chia sẻ mạng xã hội', type: 'checkbox', defaultValue: true },
            {
              name: 'position',
              label: 'Vị trí thanh chia sẻ',
              type: 'select',
              dbName: 'share_pos',
              defaultValue: 'left',
              options: [
                { label: 'Cột bên trái (Mặc định - Chuẩn giao diện)', value: 'left' },
                { label: 'Cột bên phải (Phía trên sidebar)', value: 'right' },
                { label: 'Nằm ngang dưới tiêu đề bài viết', value: 'top' },
                { label: 'Nằm ngang dưới cuối bài viết', value: 'bottom' },
              ],
            },
            {
              name: 'platformsOrder',
              label: 'Thứ tự hiển thị các nút chia sẻ',
              type: 'text',
              defaultValue: 'facebook, zalo, copy, print, custom',
              admin: {
                description:
                  'Sắp xếp thứ tự các nút bằng cách hoán đổi vị trí các từ: facebook, zalo, copy, print, custom (ngăn cách bằng dấu phẩy).',
                placeholder: 'facebook, zalo, copy, print, custom',
              },
            },
            { name: 'showFacebook', label: 'Nút chia sẻ Facebook', type: 'checkbox', defaultValue: true },
            {
              name: 'facebookCustomIcon',
              label: 'Đổi Icon nút Facebook (Tùy chọn tải ảnh/icon riêng)',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Để trống sẽ dùng icon Facebook chuẩn tích hợp.' },
            },
            { name: 'showZalo', label: 'Nút gửi tin qua Zalo', type: 'checkbox', defaultValue: true },
            {
              name: 'zaloCustomIcon',
              label: 'Đổi Icon nút Zalo (Tùy chọn tải ảnh/icon riêng)',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Để trống sẽ dùng icon Zalo chuẩn tích hợp.' },
            },
            { name: 'showCopyLink', label: 'Nút sao chép liên kết bài viết', type: 'checkbox', defaultValue: true },
            {
              name: 'copyLinkCustomIcon',
              label: 'Đổi Icon nút Sao chép liên kết',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Để trống sẽ dùng icon sao chép chuẩn tích hợp.' },
            },
            { name: 'showPrint', label: 'Nút in bài viết (Print)', type: 'checkbox', defaultValue: true },
            {
              name: 'printCustomIcon',
              label: 'Đổi Icon nút In bài viết',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Để trống sẽ dùng icon máy in chuẩn tích hợp.' },
            },
            {
              name: 'customSharesJson',
              label: 'Thêm nhiều nền tảng chia sẻ tùy chỉnh (Định dạng JSON)',
              type: 'textarea',
              admin: {
                description:
                  'Thêm thoải mái nhiều nền tảng mới (Telegram, X/Twitter, WhatsApp, LinkedIn, Email, v.v.). Hỗ trợ {url} và {title}.',
                placeholder:
                  '[\n  { "title": "Telegram", "shareUrlTemplate": "https://t.me/share/url?url={url}&text={title}", "iconUrl": "" },\n  { "title": "X (Twitter)", "shareUrlTemplate": "https://twitter.com/intent/tweet?url={url}&text={title}" },\n  { "title": "Email", "shareUrlTemplate": "mailto:?subject={title}&body={url}" }\n]',
              },
            },
          ],
        },

        // --- 3. TÙY CHỈNH DANH SÁCH BANNER SIDEBAR (CỘT PHẢI) ---
        {
          name: 'sidebarBanner',
          label: 'Cài đặt Banner hành động trên Sidebar (Cột phải)',
          type: 'group',
          fields: [
            { name: 'enabled', label: 'Hiển thị khối Banner trên Sidebar', type: 'checkbox', defaultValue: true },
            {
              name: 'position',
              label: 'Vị trí hiển thị Banner so với Tin mới nhất',
              type: 'select',
              dbName: 'banner_pos',
              defaultValue: 'aboveLatest',
              options: [
                { label: 'Nằm TRÊN mục "Tin mới nhất" (Mặc định)', value: 'aboveLatest' },
                { label: 'Nằm DƯỚI mục "Tin mới nhất"', value: 'belowLatest' },
              ],
            },
            // Banner chính #1
            { name: 'title', label: 'Tiêu đề Banner #1', type: 'text', defaultValue: 'ĐẶT LỊCH KHÁM BỆNH' },
            {
              name: 'description',
              label: 'Mô tả ngắn Banner #1',
              type: 'textarea',
              defaultValue: 'Khám chữa bệnh nhanh chóng, tiện lợi, không phải chờ đợi qua ứng dụng y tế.',
            },
            { name: 'buttonText', label: 'Chữ trên nút Banner #1', type: 'text', defaultValue: 'Đặt lịch khám ngay →' },
            { name: 'buttonLink', label: 'Đường dẫn liên kết Banner #1', type: 'text', defaultValue: 'https://medpro.vn/' },
            { name: 'openNewTab', label: 'Mở Banner #1 trong tab mới', type: 'checkbox', defaultValue: true },
            {
              name: 'customBannerImage',
              label: 'Tải ảnh Banner #1 (Nếu muốn thay khối chữ bằng ảnh)',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Tải ảnh banner đặt khám hoặc poster chương trình.' },
            },

            // Banner phụ #2
            { name: 'banner2Enabled', label: 'Bật hiển thị thêm Banner #2', type: 'checkbox', defaultValue: false },
            { name: 'banner2Title', label: 'Tiêu đề Banner #2', type: 'text', defaultValue: 'LỊCH TIÊM CHỦNG' },
            { name: 'banner2Description', label: 'Mô tả ngắn Banner #2', type: 'textarea', defaultValue: 'Tra cứu thông tin và lịch tiêm vắc xin cho trẻ em và người lớn.' },
            { name: 'banner2ButtonText', label: 'Chữ trên nút Banner #2', type: 'text', defaultValue: 'Xem lịch tiêm →' },
            { name: 'banner2ButtonLink', label: 'Đường dẫn liên kết Banner #2', type: 'text', defaultValue: '/tiem-chung' },
            { name: 'banner2OpenNewTab', label: 'Mở Banner #2 trong tab mới', type: 'checkbox', defaultValue: false },
            {
              name: 'banner2Image',
              label: 'Tải ảnh Banner #2',
              type: 'upload',
              relationTo: 'media',
            },

            // Banner phụ #3
            { name: 'banner3Enabled', label: 'Bật hiển thị thêm Banner #3', type: 'checkbox', defaultValue: false },
            { name: 'banner3Title', label: 'Tiêu đề Banner #3', type: 'text', defaultValue: 'BẢNG GIÁ DỊCH VỤ' },
            { name: 'banner3Description', label: 'Mô tả ngắn Banner #3', type: 'textarea', defaultValue: 'Công khai giá khám chữa bệnh BHYT và dịch vụ yêu cầu.' },
            { name: 'banner3ButtonText', label: 'Chữ trên nút Banner #3', type: 'text', defaultValue: 'Tra cứu giá →' },
            { name: 'banner3ButtonLink', label: 'Đường dẫn liên kết Banner #3', type: 'text', defaultValue: '/bang-gia' },
            { name: 'banner3OpenNewTab', label: 'Mở Banner #3 trong tab mới', type: 'checkbox', defaultValue: false },
            {
              name: 'banner3Image',
              label: 'Tải ảnh Banner #3',
              type: 'upload',
              relationTo: 'media',
            },

            // Banner mở rộng dạng danh sách JSON (Thêm không giới hạn banner 4, 5, 6...)
            {
              name: 'extraBannersJson',
              label: 'Thêm nhiều banner khác không giới hạn (Định dạng JSON)',
              type: 'textarea',
              admin: {
                description:
                  'Cấu hình thêm banner dạng ảnh hoặc box nút bấm. Ví dụ: [{"imageUrl": "/branding/banner.png", "link": "/khuyen-mai", "title": "Khuyến mãi"}, {"title": "Tư vấn", "desc": "Hỗ trợ 24/7", "btnText": "Gọi ngay", "btnLink": "tel:02923686115"}]',
                placeholder: '[\n  { "imageUrl": "", "link": "https://...", "title": "Tiêu đề banner", "openNewTab": true }\n]',
              },
            },
          ],
        },

        // --- 4. TÙY CHỈNH HIỂN THỊ TIN TỨC LIÊN QUAN & NGUỒN BÀI VIẾT ---
        {
          name: 'displayOptions',
          label: 'Tùy chọn hiển thị nội dung & chân trang',
          type: 'group',
          fields: [
            { name: 'showViews', label: 'Hiển thị lượt xem bài viết', type: 'checkbox', defaultValue: true },
            { name: 'showDate', label: 'Hiển thị ngày đăng', type: 'checkbox', defaultValue: true },
            { name: 'showCategory', label: 'Hiển thị chuyên mục', type: 'checkbox', defaultValue: true },
            { name: 'showSidebarLatest', label: 'Hiển thị mục "Tin mới nhất" ở Sidebar', type: 'checkbox', defaultValue: true },
            { name: 'sidebarLatestTitle', label: 'Tiêu đề danh sách ở Sidebar', type: 'text', defaultValue: 'Tin mới nhất' },
            { name: 'showRelatedSection', label: 'Hiển thị khối "Tin liên quan" dưới chân bài', type: 'checkbox', defaultValue: true },
            { name: 'relatedSectionTitle', label: 'Tiêu đề khối tin liên quan', type: 'text', defaultValue: 'Tin tức cùng chuyên mục' },
            { name: 'defaultSourceName', label: 'Tên nguồn mặc định cuối bài', type: 'text', defaultValue: 'Bệnh viện Đa khoa Khu vực Thới Lai' },
          ],
        },
      ],
    },
  ],
}
