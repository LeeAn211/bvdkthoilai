import type { CollectionConfig } from 'payload'
import { moduleAccess } from '@/access'

export const Feedback: CollectionConfig = {
  slug: 'feedback',
  labels: { singular: 'Phản hồi người bệnh', plural: 'Phản hồi người bệnh' },
  admin: { useAsTitle: 'name', group: 'CSKH' },
  access: {
    create: moduleAccess('feedback', 'create'),
    read: moduleAccess('feedback', 'view'),
    update: moduleAccess('feedback', 'edit'),
    delete: moduleAccess('feedback', 'delete'),
  },
  fields: [
    { name: 'name', label: 'Họ và tên', type: 'text', required: true },
    { name: 'phone', label: 'Số điện thoại', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'type', label: 'Loại phản hồi', type: 'select', required: true, options: ['Góp ý', 'Khen ngợi', 'Khiếu nại', 'Khác'] },
    { name: 'message', label: 'Nội dung phản hồi', type: 'textarea', required: true },
    { name: 'status', label: 'Trạng thái xử lý', type: 'select', defaultValue: 'new', options: [
      { label: 'Mới', value: 'new' },
      { label: 'Đang xử lý', value: 'processing' },
      { label: 'Đã xử lý', value: 'done' }
    ]}
  ]
}
