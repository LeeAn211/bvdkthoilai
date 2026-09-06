import type { CollectionConfig } from 'payload'
import { moduleAccess, publicPublished, workflowUpdateAccess, contentDeleteAccess } from '@/access'
import { slugField, workflowFields, seoFields } from '@/fields/common'

export const ContentSections: CollectionConfig = {
  slug: 'content-sections',
  labels: { singular: 'Mục nội dung từ Menu', plural: 'Mục nội dung từ Menu' },
  admin: {
    useAsTitle: 'title',
    group: 'Nội dung',
    defaultColumns: ['title', 'slug', 'active', '_status'],
    description: 'Các mục này được tạo tự động khi Menu chọn “Tự tạo MỤC NỘI DUNG mới”. Ví dụ tạo Menu Chuyển đổi số thì Admin sẽ có mục Chuyển đổi số để quản lý bài viết.',
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
    { name: 'title', label: 'Tên mục nội dung', type: 'text', required: true },
    slugField('title', 'content-sections'),
    { name: 'description', label: 'Mô tả ngắn', type: 'textarea', maxLength: 300 },
    { name: 'defaultImage', label: 'Ảnh mặc định của mục', type: 'upload', relationTo: 'media', admin: { description: 'Dùng khi bài viết trong mục này không chọn ảnh đại diện.' } },
    { name: 'active', label: 'Cho phép hiển thị', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    ...workflowFields,
    ...seoFields,
  ],
}
