import type { GlobalConfig } from 'payload'
import { admins } from '@/access'

export const ArticleDetailSettings: GlobalConfig = {
  slug: 'article-detail-settings',
  label: 'Bố cục & Chi tiết Bài viết',
  admin: {
    group: '🌐 Trang chủ & Giao diện Website',
    description:
      'Quản lý độc lập toàn diện mẫu giao diện chi tiết bài viết, tin tức, thông báo: Tùy chọn vị trí Tiêu đề (Trên dải Hero xanh hay Thân bài), thanh chia sẻ mạng xã hội, các banner hành động trên sidebar và khối tin liên quan.',
  },
  access: { read: () => true, update: admins },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // =====================================================================
        // TAB 1: BỐ CỤC ĐẦU TRANG & VỊ TRÍ TIÊU ĐỀ
        // =====================================================================
        {
          label: '🎯 Vị trí Tiêu đề & Dải Hero',
          description: 'Cấu hình vị trí xuất hiện của Tiêu đề bài viết và phong cách dải Hero nền xanh y tế.',
          fields: [
            {
              name: 'titlePosition',
              label: 'Vị trí hiển thị Tiêu đề bài viết',
              type: 'select',
              defaultValue: 'hero',
              options: [
                {
                  label: '⭐ Nằm trên Dải Hero xanh (Khuyên dùng - Sang trọng, bề thế, giống trang Chuyên gia / Bác sĩ)',
                  value: 'hero',
                },
                {
                  label: '📄 Nằm ở Thân bài viết bên dưới (Kiểu truyền thống báo chí)',
                  value: 'body',
                },
              ],
              admin: {
                description:
                  'Khi chọn "Nằm trên Dải Hero xanh", tiêu đề bài viết sẽ hiển thị bằng chữ trắng đậm nổi bật ngay dưới thanh đường dẫn Breadcrumb trên dải xanh thương hiệu.',
              },
            },
            {
              name: 'heroPadding',
              label: 'Kiểu khoảng cách đệm Dải Hero xanh',
              type: 'select',
              defaultValue: 'standard',
              options: [
                { label: 'Chuẩn y tế gọn gàng (32px trên/dưới - Mặc định)', value: 'standard' },
                { label: 'Rộng rãi thoáng đãng (42px trên/dưới)', value: 'spacious' },
                { label: 'Nhỏ gọn tiết kiệm diện tích (22px trên/dưới)', value: 'compact' },
              ],
            },
          ],
        },

        // =====================================================================
        // TAB 2: PHẠM VI ÁP DỤNG
        // =====================================================================
        {
          label: '🌐 Phạm vi Áp dụng',
          description: 'Lựa chọn các chuyên mục / loại bài viết áp dụng mẫu giao diện này.',
          fields: [
            {
              name: 'applyNews',
              label: 'Áp dụng cho Tin tức & Hoạt động (/tin-tuc/[slug])',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'applyNotices',
              label: 'Áp dụng cho Thông báo (/thong-bao/[slug])',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'applyAdvancedTechniques',
              label: 'Áp dụng cho Kỹ thuật chuyên sâu (/ky-thuat-chuyen-sau/[slug])',
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
                  'Khi bật, bất kỳ mục menu/nội dung mới nào được tạo trong tương lai đều sẽ tự động dùng mẫu chuẩn này mà không cần cấu hình lại.',
              },
            },
            {
              name: 'customSlugsText',
              label: 'Danh sách các mục nội dung áp dụng bổ sung (Ngăn cách bằng dấu phẩy)',
              type: 'textarea',
              admin: {
                description:
                  'Nhập các slug mục muốn áp dụng mẫu chuẩn, ngăn cách bằng dấu phẩy. Ví dụ: chuyen-doi-so, dao-tao, nghien-cuu-khoa-hoc, hoat-dong-doan-the',
                placeholder: 'chuyen-doi-so, dao-tao, khao-sat',
              },
            },
          ],
        },

        // =====================================================================
        // TAB 3: THANH CHIA SẺ MẠNG XÃ HỘI
        // =====================================================================
        {
          label: '📤 Thanh Chia sẻ',
          description: 'Cài đặt vị trí và các nút chia sẻ mạng xã hội (Facebook, Zalo, Copy, Print).',
          fields: [
            {
              name: 'shareSettings',
              label: 'Cài đặt thanh chia sẻ bài viết',
              type: 'group',
              fields: [
                { name: 'enabled', label: 'Bật thanh chia sẻ mạng xã hội', type: 'checkbox', defaultValue: true },
                {
                  name: 'position',
                  label: 'Vị trí thanh chia sẻ',
                  type: 'select',
                  defaultValue: 'left',
                  options: [
                    { label: 'Cột bên trái (Mặc định - Chuẩn giao diện y tế)', value: 'left' },
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
                  },
                },
                // Facebook
                {
                  type: 'collapsible',
                  label: '🔵 Nút chia sẻ Facebook',
                  admin: { initCollapsed: false },
                  fields: [
                    { name: 'showFacebook', label: 'Bật nút Facebook', type: 'checkbox', defaultValue: true },
                    {
                      name: 'facebookCustomIcon',
                      label: 'Tải icon riêng cho Facebook (Tùy chọn tải ảnh/icon riêng)',
                      type: 'upload',
                      relationTo: 'media',
                      admin: { description: 'Để trống sẽ dùng icon Facebook chuẩn SVG tích hợp.' },
                    },
                    {
                      name: 'facebookUrlTemplate',
                      label: 'Đường dẫn chia sẻ Facebook (Mẫu URL)',
                      type: 'text',
                      defaultValue: 'https://www.facebook.com/sharer/sharer.php?u={url}',
                      admin: { description: 'Hỗ trợ biến {url} tự động thay bằng địa chỉ trang hiện tại.' },
                    },
                  ],
                },

                // Zalo
                {
                  type: 'collapsible',
                  label: '💬 Nút chia sẻ Zalo',
                  admin: { initCollapsed: false },
                  fields: [
                    { name: 'showZalo', label: 'Bật nút Zalo', type: 'checkbox', defaultValue: true },
                    {
                      name: 'zaloCustomIcon',
                      label: 'Tải icon riêng cho Zalo (Tùy chọn tải ảnh/icon riêng)',
                      type: 'upload',
                      relationTo: 'media',
                      admin: { description: 'Để trống sẽ dùng icon Zalo chuẩn SVG tích hợp.' },
                    },
                    {
                      name: 'zaloUrlTemplate',
                      label: 'Đường dẫn liên kết Zalo (Mẫu URL)',
                      type: 'text',
                      defaultValue: 'https://zalo.me',
                      admin: { description: 'Nhập link Zalo OA bệnh viện, nhóm hoặc chat Zalo (ví dụ: https://zalo.me/02923686115).' },
                    },
                  ],
                },

                // Sao chép liên kết
                {
                  type: 'collapsible',
                  label: '🔗 Nút Sao chép liên kết (Copy link)',
                  admin: { initCollapsed: false },
                  fields: [
                    { name: 'showCopyLink', label: 'Bật nút Sao chép liên kết', type: 'checkbox', defaultValue: true },
                    {
                      name: 'copyLinkCustomIcon',
                      label: 'Tải icon riêng cho nút Sao chép',
                      type: 'upload',
                      relationTo: 'media',
                      admin: { description: 'Để trống sẽ dùng icon mắt xích chuẩn SVG tích hợp.' },
                    },
                  ],
                },

                // In bài viết
                {
                  type: 'collapsible',
                  label: '🖨️ Nút In bài viết (Print)',
                  admin: { initCollapsed: false },
                  fields: [
                    { name: 'showPrint', label: 'Bật nút In bài viết', type: 'checkbox', defaultValue: true },
                    {
                      name: 'printCustomIcon',
                      label: 'Tải icon riêng cho nút In bài viết',
                      type: 'upload',
                      relationTo: 'media',
                      admin: { description: 'Để trống sẽ dùng icon máy in chuẩn SVG tích hợp.' },
                    },
                  ],
                },

                // Danh sách các nút icon chia sẻ tùy chỉnh thêm mới
                {
                  name: 'customButtons',
                  label: '➕ Thêm các nút Icon chia sẻ mới (Không giới hạn)',
                  type: 'array',
                  dbName: 'ads_share_btns',
                  labels: { singular: 'Nút icon chia sẻ', plural: 'Các nút icon chia sẻ' },
                  fields: [
                    { name: 'enabled', label: 'Bật nút này', type: 'checkbox', defaultValue: true },
                    { name: 'title', label: 'Tên nút / Mạng xã hội', type: 'text', required: true, admin: { placeholder: 'Telegram, TikTok, YouTube, Gọi điện...' } },
                    {
                      name: 'customIcon',
                      label: 'Tải hình ảnh icon riêng (PNG, SVG, JPG)',
                      type: 'upload',
                      relationTo: 'media',
                    },
                    {
                      name: 'shareUrlTemplate',
                      label: 'Đường dẫn liên kết khi bấm vào nút (Hỗ trợ {url} và {title})',
                      type: 'text',
                      required: true,
                      admin: {
                        placeholder: 'https://t.me/share/url?url={url}&text={title} hoặc tel:02923686115',
                      },
                    },
                    { name: 'openNewTab', label: 'Mở trong tab mới', type: 'checkbox', defaultValue: true },
                  ],
                },

                // Dự phòng JSON mở rộng
                {
                  name: 'customSharesJson',
                  label: 'Thêm nhanh dạng mã JSON (Tùy chọn nâng cao)',
                  type: 'textarea',
                  admin: {
                    description:
                      'Dành cho kỹ thuật viên nhập nhanh hàng loạt mạng xã hội: [{"title": "Telegram", "shareUrlTemplate": "https://t.me/share/url?url={url}&text={title}"}]',
                  },
                },
              ],
            },
          ],
        },

        // =====================================================================
        // TAB 4: BANNER SIDEBAR HÀNH ĐỘNG
        // =====================================================================
        {
          label: '📢 Banner Tiện ích Sidebar',
          description: 'Cài đặt các khối banner đặt khám, tiêm chủng, bảng giá ở cột phải của bài viết.',
          fields: [
            {
              name: 'sidebarBanner',
              label: 'Cài đặt Banner hành động trên Sidebar',
              type: 'group',
              fields: [
                { name: 'enabled', label: 'Hiển thị khối Banner trên Sidebar', type: 'checkbox', defaultValue: true },
                {
                  name: 'position',
                  label: 'Vị trí hiển thị Banner so với Tin mới nhất',
                  type: 'select',
                  defaultValue: 'aboveLatest',
                  options: [
                    { label: 'Nằm TRÊN mục "Tin mới nhất" (Mặc định)', value: 'aboveLatest' },
                    { label: 'Nằm DƯỚI mục "Tin mới nhất"', value: 'belowLatest' },
                  ],
                },
                // --- PHẠM VI ÁP DỤNG BANNER THEO CHUYÊN MỤC ---
                {
                  name: 'scopeMode',
                  label: 'Chế độ áp dụng Banner Sidebar theo chuyên mục',
                  type: 'select',
                  defaultValue: 'all',
                  options: [
                    { label: '🌟 Bật cho tất cả chuyên mục bài viết (Mặc định)', value: 'all' },
                    { label: '⚙️ Bật/tắt tùy ý theo từng chuyên mục riêng biệt (Chọn bên dưới)', value: 'custom' },
                    { label: '⛔ Tắt tất cả banner trên mọi chuyên mục', value: 'none' },
                  ],
                  admin: {
                    description:
                      'Lựa chọn phạm vi hiển thị banner: Có thể "Bật tất cả", "Tắt tất cả" hoặc "Bật/tắt tùy ý từng mục" (Ví dụ: tắt ở Tin tức nhưng Thông báo vẫn hiển thị đầy đủ).',
                  },
                },
                {
                  type: 'collapsible',
                  label: '🎯 Danh sách Chuyên mục áp dụng Banner (Khi chọn "Bật/tắt tùy ý")',
                  admin: { initCollapsed: false },
                  fields: [
                    {
                      name: 'applyNews',
                      label: 'Bật Banner cho mục Tin tức & Hoạt động (/tin-tuc)',
                      type: 'checkbox',
                      defaultValue: true,
                    },
                    {
                      name: 'applyNotices',
                      label: 'Bật Banner cho mục Thông báo (/thong-bao)',
                      type: 'checkbox',
                      defaultValue: true,
                    },
                    {
                      name: 'applyAdvancedTechniques',
                      label: 'Bật Banner cho mục Kỹ thuật chuyên sâu (/ky-thuat-chuyen-sau)',
                      type: 'checkbox',
                      defaultValue: true,
                    },
                    {
                      name: 'applyProcurement',
                      label: 'Bật Banner cho mục Đấu thầu – Mua sắm (/dau-thau-mua-sam)',
                      type: 'checkbox',
                      defaultValue: true,
                    },
                    {
                      name: 'applyRecruitment',
                      label: 'Bật Banner cho mục Tuyển dụng (/tuyen-dung)',
                      type: 'checkbox',
                      defaultValue: true,
                    },
                    {
                      name: 'applyCustomPosts',
                      label: 'Bật Banner cho mục Bài viết Menu mở rộng (/noi-dung)',
                      type: 'checkbox',
                      defaultValue: true,
                    },
                    {
                      name: 'applyClinicalProtocols',
                      label: 'Bật Banner cho mục Phác đồ điều trị (/phac-do-dieu-tri)',
                      type: 'checkbox',
                      defaultValue: true,
                    },
                    {
                      name: 'applyHealthWarnings',
                      label: 'Bật Banner cho mục Góc cảnh báo (/goc-canh-bao)',
                      type: 'checkbox',
                      defaultValue: true,
                    },
                    {
                      name: 'applyScientificActivities',
                      label: 'Bật Banner cho mục Hoạt động khoa học (/hoat-dong-khoa-hoc)',
                      type: 'checkbox',
                      defaultValue: true,
                    },
                    {
                      name: 'applyDocuments',
                      label: 'Bật Banner cho mục Văn bản điều hành (/van-ban)',
                      type: 'checkbox',
                      defaultValue: true,
                    },
                    {
                      name: 'customSectionsText',
                      label: 'Nhập thêm các đường dẫn / slug chuyên mục muốn bật banner (ngăn cách bằng dấu phẩy)',
                      type: 'textarea',
                      admin: {
                        placeholder: 'chuyen-doi-so, khao-sat, dao-tao',
                        description: 'Hỗ trợ nhập thêm các slug tùy biến khác nếu có nhu cầu.',
                      },
                    },
                  ],
                },
                // Banner 1
                { name: 'banner1Enabled', label: 'Bật hiển thị Banner #1', type: 'checkbox', defaultValue: true },
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
                },
                // Banner 2
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
                // Banner 3
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
                // Extra Banners
                {
                  name: 'extraBannersJson',
                  label: 'Thêm nhiều banner khác không giới hạn (Định dạng JSON)',
                  type: 'textarea',
                },
              ],
            },
          ],
        },

        // =====================================================================
        // TAB 5: TÙY CHỌN HIỂN THỊ NỘI DUNG & CHÂN TRANG
        // =====================================================================
        {
          label: '📑 Khối Nội dung & Chân trang',
          description: 'Bật/tắt các khối thông tin ngày đăng, lượt xem, chuyên mục, bài viết liên quan.',
          fields: [
            {
              name: 'displayOptions',
              label: 'Tùy chọn hiển thị nội dung & chân trang',
              type: 'group',
              fields: [
                { name: 'showCoverImage', label: 'Hiển thị ảnh đại diện / ảnh bìa đầu bài viết', type: 'checkbox', defaultValue: true },
                { name: 'fullWidthImages', label: 'Mở rộng ảnh hiển thị bài viết Full 100% bề ngang khi ẩn Sidebar', type: 'checkbox', defaultValue: true },
                { name: 'showBreadcrumbs', label: 'Hiển thị thanh đường dẫn (Breadcrumbs)', type: 'checkbox', defaultValue: true },
                { name: 'showDate', label: 'Hiển thị ngày đăng bài viết', type: 'checkbox', defaultValue: true },
                { name: 'showViews', label: 'Hiển thị lượt xem bài viết', type: 'checkbox', defaultValue: true },
                { name: 'showCategory', label: 'Hiển thị chuyên mục bài viết', type: 'checkbox', defaultValue: true },
                { name: 'showHighlights', label: 'Hiển thị khối tóm tắt nổi bật (Highlights)', type: 'checkbox', defaultValue: true },
                { name: 'showExcerpt', label: 'Hiển thị đoạn trích dẫn Sapo đầu bài', type: 'checkbox', defaultValue: false },
                { name: 'showSource', label: 'Hiển thị Nguồn bài viết ở cuối bài', type: 'checkbox', defaultValue: true },
                { name: 'defaultSourceName', label: 'Tên nguồn mặc định cuối bài', type: 'text', defaultValue: 'Bệnh viện Đa khoa Khu vực Thới Lai' },
                { name: 'showSidebar', label: 'Hiển thị toàn bộ cột Sidebar bên phải', type: 'checkbox', defaultValue: true },
                { name: 'showSidebarLatest', label: 'Hiển thị mục "Tin mới nhất" ở Sidebar', type: 'checkbox', defaultValue: true },
                { name: 'sidebarLatestTitle', label: 'Tiêu đề danh sách ở Sidebar', type: 'text', defaultValue: 'Tin mới nhất' },
                { name: 'showSidebarBanners', label: 'Hiển thị các Banner tiện ích ở Sidebar', type: 'checkbox', defaultValue: true },
                { name: 'showRelatedSection', label: 'Hiển thị khối "Tin tức cùng chuyên mục" dưới chân bài', type: 'checkbox', defaultValue: true },
                { name: 'relatedSectionTitle', label: 'Tiêu đề khối tin cùng chuyên mục', type: 'text', defaultValue: 'Tin tức cùng chuyên mục' },
                { name: 'showBackToList', label: 'Hiển thị nút quay lại danh mục / trang chủ', type: 'checkbox', defaultValue: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
