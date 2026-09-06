import type { GlobalConfig } from 'payload'
import { moduleAccess } from '@/access'

export const ChatbotSettings: GlobalConfig = {
  slug: 'chatbot-settings',
  label: 'Chatbot',
  admin: { group: 'CSKH' },
  access: { read: moduleAccess('chatbot', 'view'), update: moduleAccess('chatbot', 'edit') },
  fields: [
    { name: 'enabled', label: 'Bật chatbot', type: 'checkbox', defaultValue: true },
    { name: 'assistantName', label: 'Tên trợ lý', type: 'text', defaultValue: 'Trợ lý Thới Lai' },
    { name: 'statusText', label: 'Trạng thái', type: 'text', defaultValue: 'Đang trực tuyến' },
    { name: 'greeting', label: 'Lời chào', type: 'textarea' },
    { name: 'inputPlaceholder', label: 'Gợi ý ô nhập', type: 'text', defaultValue: 'Nhập nội dung cần hỏi…' },
    { name: 'fallbackResponse', label: 'Câu trả lời mặc định', type: 'textarea', defaultValue: 'Tôi chưa tìm thấy câu trả lời phù hợp. Bạn có thể gửi câu hỏi cho tư vấn viên.' },
    { name: 'handoffEnabled', label: 'Cho phép chuyển tư vấn viên', type: 'checkbox', defaultValue: true },
    { name: 'logConversations', label: 'Lưu nhật ký hội thoại', type: 'checkbox', defaultValue: true },
    { name: 'quickTopics', label: 'Câu hỏi nhanh', type: 'array', fields: [
      { name: 'label', label: 'Tên nút', type: 'text', required: true }, { name: 'value', label: 'Nội dung gửi', type: 'text', required: true },
    ] },
  ],
}
