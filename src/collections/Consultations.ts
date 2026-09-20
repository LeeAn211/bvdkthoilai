import type { CollectionConfig } from 'payload'
import { moduleAccess } from '@/access'

export const Consultations: CollectionConfig = {
  slug: 'consultations',
  labels: { singular: 'Tư vấn trực tuyến', plural: 'Tư vấn trực tuyến' },
  admin: {
    useAsTitle: 'question',
    group: '💬 Chăm sóc người bệnh & Khảo sát',
    defaultColumns: ['question', 'status', 'lastMessageAt', 'answeredAt'],
    description: 'Mỗi hồ sơ là một phòng chat. Mở hồ sơ, thêm tin nhắn với nguồn “Tư vấn viên”, nhập nội dung và bấm Lưu để trả lời người dùng.',
  },
  access: {
    create: moduleAccess('consultations', 'create'),
    read: moduleAccess('consultations', 'view'),
    update: moduleAccess('consultations', 'edit'),
    delete: moduleAccess('consultations', 'delete'),
  },
  hooks: {
    beforeChange: [({ data, originalDoc }) => {
      const messages = Array.isArray(data?.messages) ? data.messages : []
      const previousMessages = Array.isArray(originalDoc?.messages) ? originalDoc.messages : []
      if (messages.length > previousMessages.length) {
        const latest = messages[messages.length - 1]
        const sentAt = latest?.sentAt || new Date().toISOString()
        return {
          ...data,
          lastMessageAt: sentAt,
          ...(latest?.sender === 'staff' ? { status: data?.status === 'closed' ? 'closed' : 'processing', answeredAt: sentAt } : {}),
        }
      }
      if (data?.staffReply && data.staffReply !== originalDoc?.staffReply) {
        return { ...data, status: 'answered', answeredAt: new Date().toISOString() }
      }
      return data
    }],
  },
  fields: [
    { name: 'publicToken', type: 'text', unique: true, index: true, required: true, admin: { hidden: true } },
    { name: 'question', label: 'Câu hỏi của người dùng', type: 'textarea', required: true },
    {
      name: 'messages',
      dbName: 'consult_msgs',
      label: 'Hội thoại trực tiếp',
      type: 'array',
      admin: { description: 'Để trả lời: bấm Thêm tin nhắn, giữ nguồn “Tư vấn viên”, nhập nội dung rồi bấm Lưu hồ sơ.' },
      fields: [
        {
          name: 'sender',
          label: 'Người gửi',
          type: 'select',
          required: true,
          defaultValue: 'staff',
          options: [
            { label: 'Người dùng', value: 'user' },
            { label: 'Tư vấn viên', value: 'staff' },
            { label: 'Hệ thống', value: 'system' },
          ],
        },
        { name: 'text', label: 'Nội dung tin nhắn', type: 'textarea', required: true },
        { name: 'sentAt', label: 'Thời gian gửi', type: 'date', required: true, defaultValue: () => new Date().toISOString(), admin: { date: { pickerAppearance: 'dayAndTime' } } },
      ],
    },
    {
      name: 'status',
      label: 'Trạng thái',
      type: 'select',
      defaultValue: 'new',
      required: true,
      options: [
        { label: 'Mới tiếp nhận', value: 'new' },
        { label: 'Đang tư vấn', value: 'processing' },
        { label: 'Đã trả lời', value: 'answered' },
        { label: 'Đã đóng', value: 'closed' },
      ],
    },
    {
      name: 'staffReply',
      label: 'Nội dung trả lời cho người dùng',
      type: 'textarea',
      admin: { description: 'Nhập câu trả lời và bấm Lưu. Người dùng đang mở chatbot sẽ nhận được nội dung tự động.' },
    },
    { name: 'answeredAt', label: 'Thời điểm trả lời', type: 'date', admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'lastMessageAt', label: 'Tin nhắn gần nhất', type: 'date', admin: { readOnly: true, position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'internalNote', label: 'Ghi chú nội bộ', type: 'textarea', admin: { description: 'Không hiển thị cho người dùng.' } },
  ],
}
