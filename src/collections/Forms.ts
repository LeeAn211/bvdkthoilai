import type { CollectionConfig } from 'payload'
import { moduleAccess } from '@/access'
import { slugField } from '@/fields/common'

export const Forms: CollectionConfig = {
  slug: 'forms',
  labels: { singular: 'Biểu mẫu', plural: 'Biểu mẫu' },
  admin: { useAsTitle: 'title', group: 'CSKH', defaultColumns: ['title', 'slug', 'active'] },
  access: { read: moduleAccess('forms', 'view'), create: moduleAccess('forms', 'create'), update: moduleAccess('forms', 'edit'), delete: moduleAccess('forms', 'delete') },
  fields: [
    { name: 'title', label: 'Tên biểu mẫu', type: 'text', required: true },
    slugField('title', 'forms'),
    { name: 'description', label: 'Mô tả', type: 'textarea' },
    { name: 'active', label: 'Đang nhận phản hồi', type: 'checkbox', defaultValue: true },
    { name: 'successMessage', label: 'Thông báo sau khi gửi', type: 'text', defaultValue: 'Thông tin đã được tiếp nhận.' },
    { name: 'fields', label: 'Các trường', type: 'array', minRows: 1, fields: [
      { name: 'name', label: 'Mã trường', type: 'text', required: true },
      { name: 'label', label: 'Nhãn', type: 'text', required: true },
      { name: 'type', label: 'Kiểu', type: 'select', required: true, defaultValue: 'text', options: [
        { label: 'Văn bản', value: 'text' }, { label: 'Đoạn văn', value: 'textarea' }, { label: 'Email', value: 'email' },
        { label: 'Số điện thoại', value: 'phone' }, { label: 'Số', value: 'number' }, { label: 'Ngày', value: 'date' },
        { label: 'Lựa chọn', value: 'select' }, { label: 'Đồng ý', value: 'checkbox' },
      ] },
      { name: 'required', label: 'Bắt buộc', type: 'checkbox', defaultValue: false },
      { name: 'options', label: 'Các lựa chọn', type: 'textarea', admin: { description: 'Mỗi lựa chọn một dòng, chỉ dùng cho kiểu Lựa chọn.' } },
      { name: 'placeholder', label: 'Gợi ý nhập', type: 'text' },
    ] },
  ],
}
