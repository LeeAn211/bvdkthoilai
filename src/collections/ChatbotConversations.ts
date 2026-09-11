import type { CollectionConfig } from 'payload'
import { moduleAccess } from '@/access'

export const ChatbotConversations: CollectionConfig = {
  slug: 'chatbotConversations',
  labels: { singular: 'Hội thoại Chatbot', plural: 'Hội thoại Chatbot' },
  admin: { useAsTitle: 'sessionId', group: 'CSKH', defaultColumns: ['sessionId', 'lastMessageAt', 'handoffRequested', 'createdAt'] },
  access: { read: moduleAccess('chatbot', 'view'), create: moduleAccess('chatbot', 'create'), update: moduleAccess('chatbot', 'edit'), delete: moduleAccess('chatbot', 'delete') },
  fields: [
    { name: 'sessionId', label: 'Phiên', type: 'text', required: true, index: true },
    { name: 'messages', label: 'Tin nhắn', type: 'array', fields: [
      { name: 'from', label: 'Nguồn', type: 'select', options: [{ label: 'Người dùng', value: 'user' }, { label: 'Chatbot', value: 'bot' }, { label: 'Tư vấn viên', value: 'staff' }] },
      { name: 'text', label: 'Nội dung', type: 'textarea' },
      { name: 'at', label: 'Thời điểm', type: 'date' },
    ] },
    { name: 'lastMessageAt', label: 'Tin nhắn cuối', type: 'date' },
    { name: 'handoffRequested', label: 'Đã chuyển tư vấn viên', type: 'checkbox', defaultValue: false },
  ],
}
