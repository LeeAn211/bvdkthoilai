import type { CollectionConfig } from 'payload'
import { moduleAccess } from '@/access'
import { slugField } from '@/fields/common'

export const ScientificActivityGroups: CollectionConfig = {
  slug: 'scientific-activity-groups',
  labels: {
    singular: 'Nhóm hoạt động khoa học',
    plural: 'Nhóm hoạt động khoa học',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Nội dung',
    defaultColumns: ['name', 'order', 'active', 'updatedAt'],
    description: 'Thêm, sửa, sắp xếp hoặc xóa các nhóm dùng cho bài viết Hoạt động khoa học.',
  },
  access: {
    read: () => true,
    create: moduleAccess('news', 'create'),
    update: moduleAccess('news', 'edit'),
    delete: moduleAccess('news', 'delete'),
  },
  trash: true,
  fields: [
    { name: 'name', label: 'Tên nhóm', type: 'text', required: true },
    slugField('name', 'scientific-activity-groups'),
    { name: 'description', label: 'Mô tả', type: 'textarea' },
    {
      name: 'order',
      label: 'Thứ tự hiển thị',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    {
      name: 'active',
      label: 'Đang sử dụng',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
}
