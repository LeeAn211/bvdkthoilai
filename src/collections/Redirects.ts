import type { CollectionConfig } from 'payload'
import { admins } from '@/access'

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  labels: { singular: 'Chuyển hướng 301', plural: 'Chuyển hướng 301' },
  admin: {
    useAsTitle: 'fromPath',
    group: 'Hệ thống',
    defaultColumns: ['fromPath', 'toPath', 'sourceCollection', 'active', 'updatedAt'],
    description: 'Được tạo tự động khi đổi slug của nội dung đã xuất bản. Có thể thêm thủ công khi cần.',
  },
  access: { read: () => true, create: admins, update: admins, delete: admins },
  trash: true,
  fields: [
    { name: 'fromPath', label: 'Đường dẫn cũ', type: 'text', required: true, unique: true, index: true },
    { name: 'toPath', label: 'Đường dẫn mới', type: 'text', required: true },
    { name: 'sourceCollection', label: 'Nguồn', type: 'text', admin: { readOnly: true, position: 'sidebar' } },
    { name: 'sourceId', label: 'ID nội dung', type: 'text', admin: { readOnly: true, position: 'sidebar' } },
    { name: 'active', label: 'Đang áp dụng', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
  ],
}
