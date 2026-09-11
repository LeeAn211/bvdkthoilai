import type { CollectionConfig } from 'payload'
import { moduleAccess } from '@/access'

export const FeedbackActions: CollectionConfig = {
  slug: 'feedbackActions',
  labels: { singular: 'Nhật ký xử lý phản ánh', plural: 'Nhật ký xử lý phản ánh' },
  admin: { useAsTitle: 'action', group: 'CSKH', defaultColumns: ['case', 'action', 'performedBy', 'createdAt'] },
  access: { read: moduleAccess('feedback', 'view'), create: moduleAccess('feedback', 'edit'), update: () => false, delete: () => false },
  fields: [
    { name: 'case', label: 'Hồ sơ', type: 'relationship', relationTo: 'feedbackCases', required: true, index: true },
    { name: 'action', label: 'Hành động', type: 'select', required: true, options: [
      { label: 'Tiếp nhận', value: 'received' }, { label: 'Phân công', value: 'assigned' }, { label: 'Cập nhật trạng thái', value: 'status' }, { label: 'Ghi chú', value: 'note' }, { label: 'Trả lời', value: 'response' }, { label: 'Đóng hồ sơ', value: 'closed' },
    ] },
    { name: 'note', label: 'Nội dung', type: 'textarea' },
    { name: 'fromStatus', label: 'Trạng thái trước', type: 'text' },
    { name: 'toStatus', label: 'Trạng thái sau', type: 'text' },
    { name: 'performedBy', label: 'Người thực hiện', type: 'relationship', relationTo: 'users' },
    { name: 'public', label: 'Hiển thị khi tra cứu', type: 'checkbox', defaultValue: false },
  ],
}
