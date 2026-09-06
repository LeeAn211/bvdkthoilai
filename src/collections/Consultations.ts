import type { CollectionConfig } from 'payload'
import { moduleAccess } from '@/access'

export const Consultations: CollectionConfig = {
  slug: 'consultations',
  labels: { singular: 'Tư vấn trực tuyến', plural: 'Tư vấn trực tuyến' },
  admin: {
    useAsTitle: 'question',
    group: 'CSKH',
    defaultColumns: ['question', 'status', 'createdAt', 'answeredAt'],
  },
  access: {
    create: moduleAccess('consultations', 'create'),
    read: moduleAccess('consultations', 'view'),
    update: moduleAccess('consultations', 'edit'),
    delete: moduleAccess('consultations', 'delete'),
  },
  hooks: {
    beforeChange: [({ data, originalDoc }) => {
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
    { name: 'internalNote', label: 'Ghi chú nội bộ', type: 'textarea', admin: { description: 'Không hiển thị cho người dùng.' } },
  ],
}
