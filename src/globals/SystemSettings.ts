import type { GlobalConfig } from 'payload'
import { admins, loggedIn } from '@/access'

export const SystemSettings: GlobalConfig = {
  slug: 'system-settings',
  label: 'Cấu hình hệ thống',
  admin: {
    group: 'Hệ thống',
    description: 'Thiết lập vận hành, bảo mật, audit, sao lưu và chế độ bảo trì.',
  },
  access: { read: loggedIn, update: admins },
  fields: [
    { name: 'maintenanceMode', label: 'Chế độ bảo trì', type: 'checkbox', defaultValue: false },
    { name: 'maintenanceMessage', label: 'Thông báo bảo trì', type: 'textarea', defaultValue: 'Hệ thống đang được bảo trì. Vui lòng quay lại sau.' },
    { type: 'row', fields: [
      { name: 'auditRetentionDays', label: 'Lưu Audit Log tối thiểu (ngày)', type: 'number', defaultValue: 730, min: 90, max: 3650 },
      { name: 'backupRetentionDays', label: 'Lưu bản sao lưu (ngày)', type: 'number', defaultValue: 30, min: 7, max: 3650 },
    ] },
    { name: 'healthStorageProbe', label: 'Health check kiểm tra ghi/xóa Storage', type: 'checkbox', defaultValue: true },
    { name: 'productionChecklistNote', label: 'Ghi chú vận hành Production', type: 'textarea' },
    {
      name: 'dashboardSettings',
      label: 'Tùy chỉnh hiển thị Thống kê Admin Dashboard',
      type: 'group',
      admin: {
        description: 'Bật / tắt ẩn hiện các mục thống kê để tránh trùng lặp hoặc ẩn các mục chưa dùng đến.',
      },
      fields: [
        {
          type: 'collapsible',
          label: 'Ẩn / Hiện các Thẻ số liệu chính (Metric Cards)',
          admin: { initCollapsed: false },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'showNews', label: 'Tin tức & Hoạt động', type: 'checkbox', defaultValue: true },
                { name: 'showNotices', label: 'Thông báo & Công văn', type: 'checkbox', defaultValue: true },
                { name: 'showProcurement', label: 'Đấu thầu & Mua sắm', type: 'checkbox', defaultValue: true },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'showDocuments', label: 'Văn bản pháp quy', type: 'checkbox', defaultValue: true },
                { name: 'showRecruitment', label: 'Tuyển dụng nhân sự', type: 'checkbox', defaultValue: true },
                { name: 'showSchedules', label: 'Lịch trực & Khám bệnh', type: 'checkbox', defaultValue: true },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'showVaccines', label: 'Tiêm chủng dịch vụ', type: 'checkbox', defaultValue: true },
                { name: 'showFeedback', label: 'Phản ánh & CSKH', type: 'checkbox', defaultValue: true },
                { name: 'showSurveys', label: 'Khảo sát chất lượng', type: 'checkbox', defaultValue: true },
              ],
            },
            {
              name: 'showDynamicSections',
              label: 'Hiển thị các mục tạo thêm từ Menu (ví dụ: Chuyển đổi số,...)',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Khi bật, các mục nội dung mới tạo thêm sẽ tự động xuất hiện thành thẻ thống kê riêng.',
              },
            },
          ],
        },
        {
          type: 'collapsible',
          label: 'Ẩn / Hiện các Khối biểu đồ phân tích (Charts Hub)',
          admin: { initCollapsed: true },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'showAreaChart', label: 'Biểu đồ xu hướng xuất bản tin bài', type: 'checkbox', defaultValue: true },
                { name: 'showDepartmentBar', label: 'Biểu đồ phân bổ nhân lực khoa phòng', type: 'checkbox', defaultValue: true },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'showSatisfactionGauge', label: 'Đồng hồ chỉ số hài lòng người bệnh', type: 'checkbox', defaultValue: true },
                { name: 'showSlaStats', label: 'Bảng hiệu suất cam kết xử lý SLA', type: 'checkbox', defaultValue: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
