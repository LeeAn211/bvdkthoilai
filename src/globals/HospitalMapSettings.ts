import type { GlobalConfig } from 'payload'
import { admins } from '@/access'

export const HospitalMapSettings: GlobalConfig = {
  slug: 'hospital-map-settings',
  label: 'Trang Sơ đồ & Chỉ dẫn khoa phòng',
  admin: {
    group: '🏥 Khám bệnh & Dịch vụ Y tế',
    description: 'Tùy chỉnh tiêu đề, mô tả, thông báo, sơ đồ phân tầng và các khu vực tiện ích công cộng trên trang /so-do-benh-vien.',
  },
  access: { read: () => true, update: admins },
  fields: [
    { name: 'eyebrow', label: 'Nhãn nhỏ (Eyebrow)', type: 'text', defaultValue: 'CHỈ DẪN TIẾP ĐÓN TIỆN ÍCH' },
    { name: 'title', label: 'Tiêu đề trang', type: 'text', defaultValue: 'Sơ đồ Chỉ dẫn Khoa / Phòng & Tiện ích' },
    { name: 'description', label: 'Mô tả trang', type: 'textarea', defaultValue: 'Bản đồ chỉ dẫn phân tầng các khoa phòng chuyên môn, phòng khám chức năng và các khu vực dịch vụ công cộng tại Bệnh viện Đa khoa Khu vực Thới Lai.' },
    { name: 'showNoticeBanner', label: 'Bật thông báo lưu ý đầu trang', type: 'checkbox', defaultValue: true },
    { name: 'noticeTitle', label: 'Tiêu đề thông báo tiếp đón', type: 'text', defaultValue: 'Bàn Hướng dẫn & Hỗ trợ người bệnh di chuyển' },
    { name: 'noticeContent', label: 'Nội dung thông báo (Hỗ trợ Enter)', type: 'textarea', defaultValue: '• Tại sảnh chính Tầng trệt có Tổ Chăm sóc khách hàng trực tiếp chỉ dẫn và xe lăn hỗ trợ người già, người khuyết tật.\n• Thang máy vận chuyển ưu tiên người bệnh nội trú và xe cáng cấp cứu.' },
    {
      name: 'noticeAlign',
      label: 'Canh lề thông báo',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Canh trái (Mặc định)', value: 'left' },
        { label: 'Canh giữa', value: 'center' },
        { label: 'Canh đều 2 bên (Justify)', value: 'justify' },
      ],
    },
    {
      name: 'floors',
      label: 'Danh sách các tầng & khoa phòng chức năng',
      type: 'array',
      labels: { singular: 'Tầng / Khu vực', plural: 'Các tầng / Khu vực' },
      fields: [
        { name: 'enabled', label: 'Bật tầng này', type: 'checkbox', defaultValue: true },
        { name: 'floorName', label: 'Tên tầng / Khu vực (Ví dụ: Tầng Trệt, Tầng 1...)', type: 'text', required: true },
        { name: 'overview', label: 'Chức năng tổng quát của tầng', type: 'text', required: true },
        { name: 'rooms', label: 'Danh sách khoa phòng (Mỗi dòng 1 phòng - Hỗ trợ Enter)', type: 'textarea', required: true },
      ],
    },
    {
      name: 'facilities',
      label: 'Các tiện ích công cộng phục vụ người bệnh',
      type: 'array',
      labels: { singular: 'Tiện ích công cộng', plural: 'Các tiện ích công cộng' },
      fields: [
        { name: 'enabled', label: 'Bật tiện ích này', type: 'checkbox', defaultValue: true },
        { name: 'icon', label: 'Biểu tượng (Icon / Emoji)', type: 'text', defaultValue: '📍' },
        { name: 'name', label: 'Tên tiện ích (Nhà thuốc, Căn tin, ATM, Bãi xe...)', type: 'text', required: true },
        { name: 'location', label: 'Vị trí cụ thể', type: 'text', required: true },
        { name: 'hours', label: 'Giờ phục vụ', type: 'text', defaultValue: '24/24 hoặc Giờ hành chính' },
        { name: 'desc', label: 'Mô tả ghi chú', type: 'textarea' },
      ],
    },
    {
      name: 'contentBlock',
      label: 'Bài viết chi tiết & Hướng dẫn di chuyển (RichText)',
      type: 'group',
      fields: [
        { name: 'enabled', label: 'Bật hiển thị khối bài viết này', type: 'checkbox', defaultValue: true },
        { name: 'title', label: 'Tiêu đề bài viết', type: 'text', defaultValue: 'Chỉ dẫn Luồng Di chuyển & Tiện ích Hỗ trợ Người bệnh' },
        { name: 'subtitle', label: 'Mô tả ngắn gọn / Phụ đề bài viết', type: 'textarea', defaultValue: 'Thông tin chi tiết về hệ thống thang máy ưu tiên, đường dốc xe lăn, quy định trật tự an ninh và hướng dẫn tiếp cận các khoa lâm sàng tại Bệnh viện Đa khoa Khu vực Thới Lai.' },
        { name: 'content', label: 'Nội dung bài viết chi tiết (RichText)', type: 'richText' },
        {
          name: 'textAlign',
          label: 'Canh lề nội dung',
          type: 'select',
          defaultValue: 'left',
          options: [
            { label: 'Canh trái (Mặc định)', value: 'left' },
            { label: 'Canh giữa', value: 'center' },
            { label: 'Canh đều 2 bên (Justify)', value: 'justify' },
          ],
        },
      ],
    },
    {
      name: 'customBlocks',
      label: 'Các khối nội dung tùy biến thêm mới (Không giới hạn)',
      type: 'array',
      dbName: 'hms_custom_blocks',
      labels: { singular: 'Khối nội dung tùy biến', plural: 'Các khối nội dung tùy biến' },
      fields: [
        { name: 'enabled', label: 'Bật hiển thị khối này', type: 'checkbox', defaultValue: true },
        { name: 'kicker', label: 'Nhãn nhỏ phía trên (Kicker)', type: 'text', admin: { placeholder: 'VÍ DỤ: CHỈ DẪN TIỆN ÍCH HOẶC ĐỖ XE' } },
        { name: 'title', label: 'Tiêu đề khối', type: 'text', required: true },
        { name: 'subtitle', label: 'Mô tả ngắn', type: 'textarea' },
        { name: 'content', label: 'Nội dung chi tiết (RichText)', type: 'richText' },
        {
          name: 'textAlign',
          label: 'Canh lề khối',
          type: 'select',
          defaultValue: 'left',
          options: [
            { label: 'Canh trái (Mặc định)', value: 'left' },
            { label: 'Canh giữa', value: 'center' },
            { label: 'Canh đều 2 bên (Justify)', value: 'justify' },
          ],
        },
      ],
    },
  ],
}
