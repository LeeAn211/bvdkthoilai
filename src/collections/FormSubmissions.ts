import type { CollectionConfig } from 'payload'
import { moduleAccess } from '@/access'

export const FormSubmissions: CollectionConfig = {
  slug: 'formSubmissions',
  labels: { singular: 'Dữ liệu biểu mẫu', plural: 'Dữ liệu biểu mẫu' },
  admin: { useAsTitle: 'publicCode', group: 'CSKH', defaultColumns: ['publicCode', 'form', 'status', 'createdAt'] },
  access: { read: moduleAccess('forms', 'view'), create: moduleAccess('forms', 'create'), update: moduleAccess('forms', 'edit'), delete: moduleAccess('forms', 'delete') },
  fields: [
    { name: 'publicCode', label: 'Mã tiếp nhận', type: 'text', unique: true, index: true, required: true },
    { name: 'form', label: 'Biểu mẫu', type: 'relationship', relationTo: 'forms', required: true },
    { name: 'data', label: 'Dữ liệu', type: 'json', required: true },
    { name: 'status', label: 'Trạng thái', type: 'select', defaultValue: 'new', options: [
      { label: 'Mới', value: 'new' }, { label: 'Đang xử lý', value: 'processing' }, { label: 'Hoàn tất', value: 'done' }, { label: 'Đã đóng', value: 'closed' },
    ] },
    { name: 'internalNote', label: 'Ghi chú nội bộ', type: 'textarea' },
  ],
}
