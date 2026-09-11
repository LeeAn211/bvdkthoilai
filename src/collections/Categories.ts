import type { CollectionConfig } from 'payload'
import { moduleAccess } from '@/access'
import { slugField } from '@/fields/common'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Chuyên mục', plural: 'Chuyên mục nội dung' },
  admin: {
    useAsTitle: 'name',
    group: 'Nội dung',
    defaultColumns: ['name', 'scope', 'order', 'active', 'updatedAt'],
    description: 'Danh mục dùng chung cho Tin tức, Thông báo, Đấu thầu, Tuyển dụng và Văn bản.',
  },
  access: {
    read: () => true,
    create: moduleAccess('categories', 'create'),
    update: moduleAccess('categories', 'edit'),
    delete: moduleAccess('categories', 'delete'),
  },
  trash: true,
  fields: [
    { name: 'name', label: 'Tên chuyên mục', type: 'text', required: true },
    slugField('name', 'categories'),
    {
      name: 'scope',
      label: 'Áp dụng cho',
      type: 'select',
      required: true,
      defaultValue: 'news',
      options: [
        { label: 'Tin tức', value: 'news' },
        { label: 'Thông báo', value: 'notices' },
        { label: 'Đấu thầu – Mua sắm', value: 'procurement' },
        { label: 'Tuyển dụng', value: 'recruitment' },
        { label: 'Văn bản – Tài liệu', value: 'documents' },
      ],
    },
    { name: 'description', label: 'Mô tả', type: 'textarea' },
    { name: 'order', label: 'Thứ tự', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    { name: 'active', label: 'Đang sử dụng', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
  ],
}
