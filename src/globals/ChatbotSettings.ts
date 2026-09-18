import type { GlobalConfig, Field } from 'payload'
import { moduleAccess } from '@/access'

// Helper: field màu với ColorPickerField custom component
const colorField = (name: string, label: string, defaultValue?: string, opts?: Record<string, unknown>): Field => ({
  name,
  label,
  type: 'text',
  ...(defaultValue ? { defaultValue } : {}),
  admin: {
    components: {
      Field: '/src/components/admin/ColorPickerField#default',
    },
    ...(opts?.admin as Record<string, unknown> || {}),
  },
  ...(opts || {}),
} as Field)

const defaultQuickTopics = [
  { label: '🚑 Cấp cứu 115', value: 'Cấp cứu khẩn cấp' },
  { label: '📅 Lịch khám bác sĩ', value: 'Xem lịch khám bác sĩ' },
  { label: '📝 Đặt lịch khám', value: 'Tôi muốn đặt lịch khám' },
  { label: '💰 BHYT & Bảng giá', value: 'Khám BHYT và bảng giá viện phí' },
  { label: '💉 Tiêm chủng vắc xin', value: 'Thông tin tiêm chủng vắc xin' },
  { label: '⏰ Giờ làm việc', value: 'Giờ làm việc và khám bệnh' },
  { label: '🧭 Hướng dẫn đi khám', value: 'Quy trình và thủ tục khám bệnh' },
  { label: '🩺 Gợi ý khoa khám', value: 'Tư vấn gợi ý chuyên khoa theo triệu chứng' },
]

export const ChatbotSettings: GlobalConfig = {
  slug: 'chatbot-settings',
  label: 'Cấu hình Chatbot & Trợ lý ảo',
  admin: {
    group: '🤖 Trợ lý ảo & Chatbot',
    description: 'Trung tâm quản lý tập trung: Bật/tắt chatbot, trợ lý nổi, lời chào, câu hỏi nhanh, giao diện và kịch bản hỗ trợ người bệnh.',
  },
  access: { read: moduleAccess('chatbot', 'view'), update: moduleAccess('chatbot', 'edit') },
  fields: [
    { name: 'enabled', label: 'Bật Chatbot trên Website', type: 'checkbox', defaultValue: true },
    { name: 'backToTopEnabled', label: 'Hiển thị nút cuộn lên đầu trang', type: 'checkbox', defaultValue: true },
    {
      name: 'assistantLogo',
      label: 'Ảnh đại diện / Logo Chatbot',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Chọn ảnh đại diện cho chatbot. Để trống sẽ tự dùng Logo bệnh viện.' },
    },
    { name: 'assistantName', label: 'Tên Trợ lý ảo', type: 'text', defaultValue: 'Trợ lý Thới Lai' },
    { name: 'statusText', label: 'Dòng trạng thái hoạt động', type: 'text', defaultValue: 'Đang trực tuyến' },
    {
      name: 'greeting',
      label: 'Lời chào mở đầu khi bấm vào Chatbot',
      type: 'textarea',
      defaultValue: 'Xin chào! Tôi có thể giúp bạn tra cứu lịch khám, bảng giá, tiêm ngừa và thông tin bệnh viện.',
    },
    { name: 'inputPlaceholder', label: 'Gợi ý trong ô nhập tin nhắn', type: 'text', defaultValue: 'Nhập nội dung cần hỏi…' },
    {
      name: 'noticeText',
      label: 'Dòng lưu ý y tế dưới đáy khung chat',
      type: 'text',
      defaultValue: 'Thông tin chỉ mang tính tham khảo. Trường hợp cấp cứu, vui lòng gọi bệnh viện ngay.',
    },
    colorField('primaryColor', 'Màu sắc chủ đạo Chatbot', '#0878D1', {
      admin: { description: 'Nhập mã màu HEX (ví dụ: #0878D1) hoặc dùng bảng chọn màu.' },
    }),
    {
      name: 'quickTopics',
      dbName: 'cb_quick_topics',
      label: 'Các nút câu hỏi nhanh gợi ý',
      type: 'array',
      maxRows: 12,
      defaultValue: defaultQuickTopics,
      admin: { description: 'Tự do thêm, sửa, xóa hoặc kéo thả để đổi thứ tự các nút gợi ý hiển thị trong khung chat.' },
      fields: [
        { name: 'label', label: 'Tên hiển thị trên nút', type: 'text', required: true },
        { name: 'value', label: 'Câu hỏi mẫu gửi vào chat', type: 'text', required: true },
      ],
    },
    {
      name: 'fallbackResponse',
      label: 'Câu trả lời mặc định khi không tìm thấy nội dung',
      type: 'textarea',
      defaultValue: 'Tôi chưa hiểu rõ câu hỏi. Bạn hãy chọn một mục gợi ý hoặc liên hệ trực tiếp với bệnh viện để được hỗ trợ.',
    },
    { name: 'fallbackLinkLabel', label: 'Tên nút liên kết của câu trả lời mặc định', type: 'text', defaultValue: 'Liên hệ bệnh viện' },
    { name: 'fallbackLinkUrl', label: 'Đường dẫn liên kết của câu trả lời mặc định', type: 'text', defaultValue: '/lien-he' },
    { name: 'handoffEnabled', label: 'Cho phép chuyển tiếp tư vấn viên', type: 'checkbox', defaultValue: true },
    { name: 'logConversations', label: 'Lưu nhật ký hội thoại để thống kê', type: 'checkbox', defaultValue: true },
  ],
}

