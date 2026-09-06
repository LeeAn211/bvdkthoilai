import type { CollectionConfig } from 'payload'
import { contentDeleteAccess, moduleAccess, publicPublished, workflowUpdateAccess } from '@/access'
import { attachmentsField, categoryRelationshipField, seoFields, slugField, workflowFields } from '@/fields/common'
import { detachNavigationReference } from '@/hooks/detachNavigationReference'
import { createSlugRedirect, syncPublishedAt } from '@/hooks/contentWorkflow'

export const Notices: CollectionConfig = {
  slug: 'notices',
  labels: { singular: 'Thông báo', plural: 'Thông báo' },
  admin: { useAsTitle: 'title', group: 'Nội dung', defaultColumns: ['title', 'level', 'workflowState', '_status', 'publishedAt', 'startAt', 'expireAt'] },
  access: { read: publicPublished, create: moduleAccess('notices', 'create'), update: workflowUpdateAccess('notices'), delete: contentDeleteAccess('notices') },
  trash: true,
  versions: { drafts: { autosave: true, schedulePublish: false }, maxPerDoc: 50 },
  hooks: {
    beforeChange: [syncPublishedAt('publishedAt')],
    afterChange: [createSlugRedirect('notices')],
    beforeDelete: [detachNavigationReference('notices')],
  },
  fields: [
    { name: 'title', label: 'Tiêu đề thông báo', type: 'text', required: true },
    slugField('title', 'notices'),
    { name: 'cover', label: 'Ảnh đại diện', type: 'upload', relationTo: 'media', admin: { description: 'Không bắt buộc; khi trống dùng ảnh mặc định của Thông báo.' } },
    { name: 'excerpt', label: 'Mô tả ngắn', type: 'textarea', maxLength: 300 },
    { name: 'content', label: 'Nội dung thông báo', type: 'richText', required: true },
    categoryRelationshipField('notices'),
    {
      name: 'level', label: 'Mức độ', type: 'select', defaultValue: 'normal',
      options: [
        { label: 'Thông thường', value: 'normal' },
        { label: 'Quan trọng', value: 'important' },
        { label: 'Khẩn', value: 'urgent' },
      ],
    },
    attachmentsField(),
    { name: 'publishedAt', label: 'Ngày đăng', type: 'date', admin: { position: 'sidebar' } },
    { name: 'startAt', label: 'Ngày bắt đầu hiển thị', type: 'date' },
    { name: 'expireAt', label: 'Ngày hết hiệu lực', type: 'date' },
    { name: 'pinned', label: 'Ghim thông báo', type: 'checkbox', defaultValue: false },
    { name: 'showOnHome', label: 'Hiển thị trên trang chủ', type: 'checkbox', defaultValue: true },
    ...workflowFields,
    ...seoFields,
  ],
}
