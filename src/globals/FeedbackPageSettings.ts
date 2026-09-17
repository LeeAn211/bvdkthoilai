import type { GlobalConfig } from 'payload'
import { admins } from '@/access'

export const FeedbackPageSettings: GlobalConfig = {
  slug: 'feedback-page-settings',
  label: 'Trang Góp ý – Phản ánh',
  admin: {
    group: '💬 Chăm sóc người bệnh & Khảo sát',
    description: 'Tùy chỉnh tiêu đề, mô tả, thông báo lưu ý và 3 ô thông tin hotline/tra cứu/bảo mật trên trang /gop-y và /gop-y/tra-cuu.',
  },
  access: { read: () => true, update: admins },
  fields: [
    { name: 'eyebrow', label: 'Nhãn nhỏ (Eyebrow)', type: 'text', defaultValue: 'CHĂM SÓC NGƯỜI BỆNH & TIẾP NHẬN Ý KIẾN' },
    { name: 'title', label: 'Tiêu đề trang', type: 'text', defaultValue: 'Góp ý – Phản ánh Chất lượng' },
    { name: 'description', label: 'Mô tả trang', type: 'textarea', defaultValue: 'Mọi ý kiến đóng góp, phản ánh hoặc khen ngợi của quý vị đều được Ban Giám đốc tiếp nhận trực tiếp và giải quyết minh bạch, có mã theo dõi tiến độ.' },
    { name: 'showNoticeBanner', label: 'Bật thông báo lưu ý đầu trang', type: 'checkbox', defaultValue: false },
    { name: 'noticeTitle', label: 'Tiêu đề thông báo lưu ý', type: 'text', defaultValue: 'Quy trình tiếp nhận phản ánh' },
    { name: 'noticeContent', label: 'Nội dung thông báo (Hỗ trợ Enter)', type: 'textarea', defaultValue: '• Ban Giám đốc tiếp nhận trực tiếp mọi ý kiến phản ánh của người bệnh và thân nhân.\n• Mọi phản ánh đều được cấp mã tra cứu tiến độ xử lý minh bạch.' },
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
      label: '3 Ô thông tin Hotline / Mã tra cứu / Bảo mật',
      type: 'array',
      labels: { singular: 'Ô thông tin', plural: 'Các ô thông tin' },
      fields: [
        { name: 'enabled', label: 'Bật ô này', type: 'checkbox', defaultValue: true },
        { name: 'icon', label: 'Biểu tượng (Icon / Emoji)', type: 'text', defaultValue: '📞' },
        { name: 'title', label: 'Tiêu đề ô', type: 'text', required: true },
        { name: 'desc', label: 'Nội dung chi tiết (Hỗ trợ {{HOTLINE}} và {{EMERGENCY_HOTLINE}})', type: 'textarea', required: true },
      ],
    },
  ],
}
