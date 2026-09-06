import type { CollectionConfig } from 'payload'
import { moduleAccess } from '@/access'

export const ChatbotUnanswered: CollectionConfig = {
  slug: 'chatbotUnanswered',
  labels: { singular: 'Câu hỏi Chatbot chưa trả lời', plural: 'Câu hỏi Chatbot chưa trả lời' },
  admin: { useAsTitle: 'question', group: 'CSKH', defaultColumns: ['question', 'count', 'resolved', 'lastAskedAt'] },
  access: { read: moduleAccess('chatbot', 'view'), create: moduleAccess('chatbot', 'create'), update: moduleAccess('chatbot', 'edit'), delete: moduleAccess('chatbot', 'delete') },
  fields: [
    { name: 'question', label: 'Câu hỏi', type: 'textarea', required: true },
    { name: 'normalizedQuestion', label: 'Chuẩn hóa', type: 'text', required: true, index: true },
    { name: 'count', label: 'Số lần hỏi', type: 'number', defaultValue: 1 },
    { name: 'lastAskedAt', label: 'Lần hỏi gần nhất', type: 'date' },
    { name: 'resolved', label: 'Đã bổ sung kịch bản', type: 'checkbox', defaultValue: false },
    { name: 'intent', label: 'Kịch bản đã bổ sung', type: 'relationship', relationTo: 'chatbotIntents' },
  ],
}
