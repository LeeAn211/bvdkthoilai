import type { CollectionConfig } from 'payload'
import { moduleAccess, publicPublished, workflowUpdateAccess, contentDeleteAccess } from '@/access'
import { attachmentsField, slugField, workflowFields, seoFields } from '@/fields/common'
import { syncPublishedAt } from '@/hooks/contentWorkflow'

export const CustomPosts: CollectionConfig = {
  slug: 'custom-posts',
  labels: { singular: 'Bài viết theo mục Menu', plural: 'Bài viết theo mục Menu' },
  admin: {
    useAsTitle: 'title',
    group: 'Nội dung',
    defaultColumns: ['title', 'section', 'publishedAt', '_status'],
    description: 'Đăng bài cho các mục nội dung mở rộng được tạo từ Menu, ví dụ Chuyển đổi số.',
  },
  access: {
    read: publicPublished,
    create: moduleAccess('pages', 'create'),
    update: workflowUpdateAccess('pages'),
    delete: contentDeleteAccess('pages'),
  },
  trash: true,
  versions: { drafts: { autosave: true, schedulePublish: false }, maxPerDoc: 50 },
  hooks: { beforeChange: [syncPublishedAt('publishedAt')] },
  fields: [
    { name: 'section', label: 'Thuộc mục nội dung', type: 'relationship', relationTo: 'content-sections', required: true, index: true },
    { name: 'title', label: 'Tiêu đề bài viết', type: 'text', required: true },
    slugField('title', 'custom-posts'),
    { name: 'cover', label: 'Ảnh đại diện', type: 'upload', relationTo: 'media', admin: { description: 'Không bắt buộc; khi trống dùng ảnh mặc định của mục nội dung.' } },
    { name: 'excerpt', label: 'Mô tả ngắn', type: 'textarea', maxLength: 300 },
    { name: 'content', label: 'Nội dung bài viết', type: 'richText', required: true },
    attachmentsField(),
    { name: 'publishedAt', label: 'Ngày đăng', type: 'date', admin: { position: 'sidebar' } },
    { name: 'pinned', label: 'Ghim bài viết', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    ...workflowFields,
    ...seoFields,
  ],
}
