import type { CollectionConfig } from 'payload'
import { moduleAccess } from '@/access'

export const ChatbotIntents: CollectionConfig = {
  slug: 'chatbotIntents',
  labels: { singular: 'Kịch bản Chatbot', plural: 'Kịch bản Chatbot' },
  admin: {
    useAsTitle: 'name', group: 'CSKH', defaultColumns: ['name', 'active', 'priority'],
    description: 'Thêm từng kịch bản hoặc dùng khung nhập Excel phía trên danh sách để cập nhật nhanh hàng loạt.',
    components: { beforeList: ['/src/components/admin/ChatbotIntentExcelImport'] },
  },
  access: { read: moduleAccess('chatbot', 'view'), create: moduleAccess('chatbot', 'create'), update: moduleAccess('chatbot', 'edit'), delete: moduleAccess('chatbot', 'delete') },
  fields: [
    { name: 'name', label: 'Tên kịch bản', type: 'text', required: true },
    { name: 'phrases', label: 'Câu hỏi / từ khóa', type: 'array', minRows: 1, fields: [{ name: 'text', label: 'Nội dung', type: 'text', required: true }] },
    { name: 'answer', label: 'Câu trả lời', type: 'textarea', required: true },
    { name: 'linkLabel', label: 'Tên liên kết', type: 'text' },
    { name: 'linkUrl', label: 'Liên kết', type: 'text' },
    { name: 'openNewTab', label: 'Mở tab mới', type: 'checkbox', defaultValue: false },
    { name: 'priority', label: 'Độ ưu tiên', type: 'number', defaultValue: 0 },
    { name: 'active', label: 'Đang sử dụng', type: 'checkbox', defaultValue: true },
  ],
}
