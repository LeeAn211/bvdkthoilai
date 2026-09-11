import type { CollectionConfig } from 'payload'
import { moduleAccess } from '@/access'

export const FeedbackCategories: CollectionConfig = {
  slug: 'feedbackCategories',
  labels: { singular: 'Nhóm phản ánh', plural: 'Nhóm phản ánh' },
  admin: { useAsTitle: 'name', group: 'CSKH' },
  access: { read: moduleAccess('feedback', 'view'), create: moduleAccess('feedback', 'create'), update: moduleAccess('feedback', 'edit'), delete: moduleAccess('feedback', 'delete') },
  fields: [
    { name: 'name', label: 'Tên nhóm', type: 'text', required: true, unique: true },
    { name: 'department', label: 'Khoa/Phòng tiếp nhận mặc định', type: 'relationship', relationTo: 'departments' },
    { name: 'defaultPriority', label: 'Mức ưu tiên', type: 'select', defaultValue: 'normal', options: [
      { label: 'Thấp', value: 'low' }, { label: 'Bình thường', value: 'normal' }, { label: 'Cao', value: 'high' }, { label: 'Khẩn', value: 'urgent' },
    ] },
    { name: 'active', label: 'Đang sử dụng', type: 'checkbox', defaultValue: true },
  ],
}
