import type { GlobalConfig } from 'payload'
import { admins } from '@/access'

// Helper tạo trường lựa chọn hiển thị đa thiết bị (4 trạng thái)
const visibilityField = (name: string, label: string, defaultValue = 'both', description?: string) => ({
  name,
  label,
  type: 'select' as const,
  defaultValue,
  options: [
    { label: '🖥️📱 Hiển thị trên CẢ HAI (Máy tính & Điện thoại)', value: 'both' },
    { label: '🖥️ Chỉ hiển thị trên Máy tính (Ẩn trên Điện thoại)', value: 'desktop_only' },
    { label: '📱 Chỉ hiển thị trên Điện thoại (Ẩn trên Máy tính)', value: 'mobile_only' },
    { label: '❌ TẮT hoàn toàn trên CẢ HAI', value: 'hidden' },
  ],
  admin: {
    description: description || 'Chọn thiết bị được phép hiển thị mục này.',
  },
})

export const DisplaySettings: GlobalConfig = {
  slug: 'display-settings',
  label: 'Bố cục & Hiển thị Đa thiết bị (Desktop / Mobile)',
  admin: {
    group: '🌐 Trang chủ & Giao diện Website',
    description: 'Quản lý tập trung toàn diện các khối hiển thị và các nút Đặt lịch / Hành động trên website theo từng thiết bị (Máy tính Desktop / Điện thoại Mobile / Cả hai / Tắt).',
  },
  access: { read: () => true, update: admins },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // =====================================================================
        // TAB 1: CHI TIẾT BÀI VIẾT & TIN TỨC
        // =====================================================================
        {
          label: '📑 Chi tiết Bài viết & Tin tức',
          description: 'Cấu hình bật/tắt từng khối thông tin trên các trang chi tiết bài viết (/tin-tuc/[slug], /thong-bao/[slug], /ky-thuat-chuyen-sau/[slug]...).',
          fields: [
            {
              type: 'collapsible',
              label: '📌 Đầu trang & Thanh chia sẻ bài viết',
              admin: { initCollapsed: false },
              fields: [
                visibilityField('articleBreadcrumbs', 'Thanh đường dẫn (Breadcrumbs)', 'both'),
                visibilityField('articleDate', 'Khối ngày đăng bài viết', 'both'),
                visibilityField('articleViews', 'Khối số lượt xem bài viết', 'both'),
                visibilityField('articleCategory', 'Khối chuyên mục bài viết', 'both'),
                visibilityField('articleShare', 'Thanh chia sẻ Mạng xã hội (Facebook, Zalo, Copy, Print)', 'both', 'Trên máy tính là cột cố định bên trái, trên điện thoại là thanh ngang dưới tiêu đề.'),
              ],
            },
            {
              type: 'collapsible',
              label: '📝 Thân bài viết & Tóm tắt',
              admin: { initCollapsed: false },
              fields: [
                visibilityField('articleHighlights', 'Khối tóm tắt nổi bật (Highlights / Ưu điểm)', 'both'),
                visibilityField('articleExcerpt', 'Đoạn trích dẫn Sapo đầu bài viết', 'hidden', 'Mặc định ẩn, bật lên nếu muốn hiển thị đoạn sapo in đậm đầu bài.'),
                visibilityField('articleSource', 'Khối Nguồn bài viết ở cuối bài', 'both'),
                {
                  name: 'articleDefaultSourceName',
                  label: 'Tên nguồn mặc định (nếu bật)',
                  type: 'text',
                  defaultValue: 'Bệnh viện Đa khoa Khu vực Thới Lai',
                },
                visibilityField('articleBackToList', 'Nút quay lại danh mục / trang chủ', 'both'),
              ],
            },
            {
              type: 'collapsible',
              label: '📰 Cột Sidebar & Chân trang bài viết',
              admin: { initCollapsed: false },
              fields: [
                visibilityField('articleSidebar', 'Toàn bộ cột Sidebar bên phải', 'both', 'Nếu tắt trên Mobile, cột sidebar sẽ ẩn hoàn toàn giúp bài viết gọn gàng.'),
                visibilityField('articleSidebarLatest', 'Khối Tin mới nhất trên Sidebar', 'both'),
                {
                  name: 'articleSidebarLatestTitle',
                  label: 'Tiêu đề khối tin mới trên Sidebar',
                  type: 'text',
                  defaultValue: 'Tin mới nhất',
                },
                visibilityField('articleSidebarBanners', 'Khối Banner tiện ích hành động trên Sidebar (Medpro, Tiêm chủng, Bảng giá...)', 'both'),
                visibilityField('articleRelated', 'Khối Tin tức cùng chuyên mục ở chân bài viết', 'both'),
                {
                  name: 'articleRelatedTitle',
                  label: 'Tiêu đề khối tin cùng chuyên mục',
                  type: 'text',
                  defaultValue: 'Tin tức cùng chuyên mục',
                },
              ],
            },
          ],
        },

        // =====================================================================
        // TAB 2: NÚT ĐẶT LỊCH CHUYÊN GIA & BÁC SĨ
        // =====================================================================
        {
          label: '🩺 Chuyên gia & Bác sĩ',
          description: 'Cấu hình hiển thị nút Đặt lịch khám và hộp ghi chú trên trang Bác sĩ và khối Chuyên gia.',
          fields: [
            {
              type: 'collapsible',
              label: '👨‍⚕️ Nút Đặt lịch trên Trang Bác sĩ (/bac-si/[slug])',
              admin: { initCollapsed: false },
              fields: [
                visibilityField('doctorBookingBtn', 'Nút Đặt lịch khám của Bác sĩ', 'both', 'Hiển thị nút to nổi bật bên dưới ảnh chân dung của bác sĩ.'),
                visibilityField('doctorBookingNotice', 'Hộp ghi chú tiếp đón ưu tiên bên dưới nút Đặt lịch', 'both', 'Ô viền xanh với nội dung hướng dẫn người bệnh.'),
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'doctorBookingDefaultText',
                      label: 'Chữ mặc định trên nút Đặt lịch',
                      type: 'text',
                      defaultValue: 'Đặt lịch khám',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'doctorBookingDefaultUrl',
                      label: 'Đường dẫn liên kết mặc định',
                      type: 'text',
                      defaultValue: '/dat-lich-kham',
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
            },
            {
              type: 'collapsible',
              label: '🌟 Nút xem & Đặt lịch trên Thẻ Bác sĩ (Trang danh sách & Carousel)',
              admin: { initCollapsed: false },
              fields: [
                visibilityField('doctorCardBookingBtn', 'Nút liên kết đặt lịch nhanh trên thẻ Bác sĩ', 'both', 'Cho phép người bệnh bấm vào để chuyển nhanh sang trang đặt lịch hẹn.'),
              ],
            },
          ],
        },

        // =====================================================================
        // TAB 3: LỊCH KHÁM BỆNH & LỊCH TRỰC CẤP CỨU
        // =====================================================================
        {
          label: '📅 Lịch khám & Lịch trực',
          description: 'Cấu hình hiển thị các nút thao tác nhanh trên trang Lịch khám (/lich-kham) và Lịch trực cấp cứu 24/7.',
          fields: [
            {
              type: 'collapsible',
              label: '📅 Trang Lịch khám bệnh (/lich-kham)',
              admin: { initCollapsed: false },
              fields: [
                visibilityField('scheduleBookingBtn', 'Nút Đặt lịch khám trực tuyến trên trang Lịch khám', 'both', 'Nút liên kết đến hệ thống Medpro / Đặt lịch bệnh viện.'),
                visibilityField('scheduleHotlineBtn', 'Nút Gọi Hotline tiếp đón trên bảng thông báo', 'both'),
                visibilityField('scheduleNotes', 'Khối Lưu ý quan trọng khi đến khám bệnh', 'both'),
              ],
            },
            {
              type: 'collapsible',
              label: '🚨 Bảng Lịch trực cấp cứu 24/7 (Emergency Matrix)',
              admin: { initCollapsed: false },
              fields: [
                visibilityField('emergencyPrintBtn', 'Nút In lịch trực tuần', 'desktop_only', 'Mặc định chỉ hiện trên máy tính Desktop vì điện thoại ít khi kết nối máy in.'),
                visibilityField('emergencyContacts', 'Khối Đường dây nóng trực ban & Danh bạ khẩn cấp', 'both'),
                visibilityField('emergencyGeneralNote', 'Khối Ghi chú điều động & công tác trong tuần', 'both'),
              ],
            },
          ],
        },

        // =====================================================================
        // TAB 4: ĐẦU TRANG & CHÂN TRANG MOBILE
        // =====================================================================
        {
          label: '📱 Đầu trang & Chân trang Mobile',
          description: 'Cấu hình bật/tắt các thanh tiện ích cố định trên điện thoại di động (< 900px).',
          fields: [
            {
              type: 'collapsible',
              label: '🔝 Thanh tiện ích trên cùng điện thoại (Mobile Top Bar)',
              admin: { initCollapsed: false },
              fields: [
                visibilityField('mobileTopBar', 'Thanh công cụ trên cùng (Mobile Top Bar)', 'mobile_only', 'Thanh cố định trên đầu trang khi xem trên màn hình nhỏ < 900px.'),
                visibilityField('mobileTopSearch', 'Ô tìm kiếm dịch vụ / bác sĩ trên thanh Top Bar', 'mobile_only'),
                visibilityField('mobileTopSocials', 'Cụm icon Mạng xã hội trên thanh Top Bar', 'mobile_only'),
              ],
            },
            {
              type: 'collapsible',
              label: '🔻 Thanh điều hướng dưới đáy điện thoại (Mobile Bottom Nav)',
              admin: { initCollapsed: false },
              fields: [
                visibilityField('mobileBottomNav', 'Thanh điều hướng dưới đáy (Trang chủ - Lịch khám - Đặt khám - Cấp cứu)', 'mobile_only', 'Thanh 4 nút bấm cố định sát đáy màn hình điện thoại.'),
                visibilityField('mobileBottomBookingBtn', 'Nút tròn nổi bật ĐẶT KHÁM ở giữa thanh đáy', 'mobile_only'),
                visibilityField('mobileBottomEmergencyBtn', 'Nút CẤP CỨU (Gọi ngay) trên thanh đáy', 'mobile_only'),
              ],
            },
            {
              type: 'collapsible',
              label: '📢 Tiện ích nổi toàn trang (Floating Widgets)',
              admin: { initCollapsed: false },
              fields: [
                visibilityField('floatingAssistant', 'Nút Trợ lý ảo bệnh viện', 'both'),
                visibilityField('floatingBackToTop', 'Nút Cuộn lên đầu trang (Back to top)', 'both'),
                visibilityField('scrollingTicker', 'Thanh chữ chạy thông báo khẩn (Ticker)', 'both', 'Tùy chọn ẩn trên điện thoại nếu muốn tiết kiệm diện tích màn hình.'),
              ],
            },
          ],
        },
      ],
    },
  ],
}
