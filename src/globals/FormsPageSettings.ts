import type { GlobalConfig } from 'payload'
import { admins } from '@/access'

export const FormsPageSettings: GlobalConfig = {
  slug: 'forms-page-settings',
  label: 'Trang Biểu mẫu điện tử',
  admin: {
    group: '💬 Chăm sóc người bệnh & Khảo sát',
    description: 'Tùy chỉnh tiêu đề, mô tả, thông báo và các ô tiện ích hướng dẫn trên trang /bieu-mau.',
  },
  access: { read: () => true, update: admins },
  fields: [
    { name: 'eyebrow', label: 'Nhãn nhỏ (Eyebrow)', type: 'text', defaultValue: 'CHĂM SÓC NGƯỜI BỆNH & THỦ TỤC ĐIỆN TỬ' },
    { name: 'title', label: 'Tiêu đề trang', type: 'text', defaultValue: 'Biểu mẫu Điện tử & Đăng ký' },
    { name: 'description', label: 'Mô tả trang', type: 'textarea', defaultValue: 'Hệ thống biểu mẫu hành chính số hóa giúp người bệnh đăng ký thủ tục nhanh chóng, tiết kiệm thời gian chờ đợi tại Bệnh viện Đa khoa Khu vực Thới Lai.' },
    { name: 'showNoticeBanner', label: 'Bật thông báo lưu ý đầu trang', type: 'checkbox', defaultValue: false },
    { name: 'noticeTitle', label: 'Tiêu đề thông báo lưu ý', type: 'text', defaultValue: 'Lưu ý khi điền biểu mẫu trực tuyến' },
    { name: 'noticeContent', label: 'Nội dung thông báo (Hỗ trợ Enter)', type: 'textarea', defaultValue: 'Vui lòng cung cấp đúng số điện thoại để nhận mã xác nhận tiếp nhận từ bệnh viện.' },
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
      name: 'infoBoxes',
      label: '3 Ô tiện ích / hướng dẫn biểu mẫu',
      type: 'array',
      labels: { singular: 'Ô tiện ích', plural: 'Các ô tiện ích' },
      admin: { description: 'Tùy chỉnh bật/tắt, biểu tượng, tiêu đề và mô tả của 3 ô thông tin trên trang /bieu-mau.' },
      fields: [
        { name: 'enabled', label: 'Bật ô này', type: 'checkbox', defaultValue: true },
        { name: 'icon', label: 'Biểu tượng (Icon / Emoji)', type: 'text', defaultValue: '⚡' },
        { name: 'title', label: 'Tiêu đề ô', type: 'text', required: true },
        { name: 'desc', label: 'Nội dung chi tiết', type: 'textarea', required: true },
      ],
    },
  ],
}
