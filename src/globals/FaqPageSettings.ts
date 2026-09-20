import type { GlobalConfig } from 'payload'
import { admins } from '@/access'

export const FaqPageSettings: GlobalConfig = {
  slug: 'faq-page-settings',
  label: 'Trang Hỏi đáp y tế (FAQ)',
  admin: {
    group: '🤖 Trợ lý ảo & Chatbot',
    description: 'Tùy chỉnh tiêu đề, mô tả và thông báo lưu ý trên trang /hoi-dap.',
  },
  access: { read: () => true, update: admins },
  fields: [
    { name: 'eyebrow', label: 'Nhãn nhỏ (Eyebrow)', type: 'text', defaultValue: 'CHĂM SÓC NGƯỜI BỆNH & GIẢI ĐÁP' },
    { name: 'title', label: 'Tiêu đề trang', type: 'text', defaultValue: 'Hỏi đáp Y tế & Câu hỏi thường gặp' },
    { name: 'description', label: 'Mô tả trang', type: 'textarea', defaultValue: 'Tổng hợp các giải đáp chính xác, nhanh chóng nhất về chính sách khám chữa bệnh, quyền lợi bảo hiểm và hướng dẫn thủ tục tại Bệnh viện Đa khoa Khu vực Thới Lai.' },
    { name: 'showNoticeBanner', label: 'Bật thông báo lưu ý đầu trang', type: 'checkbox', defaultValue: false },
    { name: 'noticeTitle', label: 'Tiêu đề thông báo lưu ý', type: 'text', defaultValue: 'Giải đáp thắc mắc người bệnh' },
    { name: 'noticeContent', label: 'Nội dung thông báo (Hỗ trợ Enter)', type: 'textarea', defaultValue: 'Nếu chưa tìm thấy thông tin cần biết, quý vị có thể đặt câu hỏi trực tuyến hoặc gọi hotline 02923686115.' },
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
  ],
}
