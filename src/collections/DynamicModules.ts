import type { CollectionConfig } from 'payload'
import { moduleAccess, publicPublished, workflowUpdateAccess, contentDeleteAccess } from '@/access'
import { slugField, seoFields, workflowFields } from '@/fields/common'

export const DynamicModules: CollectionConfig = {
  slug: 'dynamic-modules',
  labels: { singular: 'Module động', plural: 'Module động' },
  admin: {
    useAsTitle: 'title',
    group: 'Nội dung',
    description: 'Tạo module nội dung tái sử dụng để chèn vào Trang chủ mà không hard-code giao diện.',
  },
  access: {
    read: publicPublished,
    create: moduleAccess('pages', 'create'),
    update: workflowUpdateAccess('pages'),
    delete: contentDeleteAccess('pages'),
  },
  trash: true,
  versions: { drafts: { autosave: true, schedulePublish: false }, maxPerDoc: 30 },
  fields: [
    { name: 'title', label: 'Tên module', type: 'text', required: true },
    slugField('title', 'dynamic-modules'),
    { name: 'eyebrow', label: 'Nhãn nhỏ', type: 'text' },
    { name: 'description', label: 'Mô tả', type: 'textarea' },
    { name: 'content', label: 'Nội dung', type: 'richText' },
    { name: 'image', label: 'Hình ảnh', type: 'upload', relationTo: 'media' },
    { type: 'row', fields: [
      { name: 'buttonLabel', label: 'Tên nút', type: 'text', admin: { width: '50%' } },
      { name: 'buttonUrl', label: 'Liên kết nút', type: 'text', admin: { width: '50%' } },
    ] },
    { name: 'active', label: 'Cho phép hiển thị', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    ...workflowFields,
    ...seoFields,
  ],
}
