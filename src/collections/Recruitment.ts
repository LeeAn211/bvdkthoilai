import type { CollectionConfig } from 'payload'
import { contentDeleteAccess, moduleAccess, publicPublished, workflowUpdateAccess } from '@/access'
import { attachmentsField, categoryRelationshipField, seoFields, slugField, workflowFields, layoutTemplateField, postSourceField } from '@/fields/common'
import { createSlugRedirect, syncPublishedAt } from '@/hooks/contentWorkflow'

export const Recruitment: CollectionConfig = {
  slug: 'recruitment',
  labels: { singular: 'Tin tuyển dụng', plural: 'Tuyển dụng' },
  admin: { useAsTitle: 'title', group: 'Nội dung', defaultColumns: ['title', 'department', 'quantity', 'publishedAt', 'deadlineAt', 'workflowState', '_status'] },
  access: { read: publicPublished, create: moduleAccess('recruitment', 'create'), update: workflowUpdateAccess('recruitment'), delete: contentDeleteAccess('recruitment') },
  trash: true,
  versions: { drafts: { autosave: true, schedulePublish: false }, maxPerDoc: 30 },
  hooks: { beforeChange: [syncPublishedAt('publishedAt')], afterChange: [createSlugRedirect('recruitment')] },
  fields: [
    { name: 'title', label: 'Tiêu đề tuyển dụng', type: 'text', required: true },
    slugField('title', 'recruitment'),
    { name: 'cover', label: 'Ảnh đại diện', type: 'upload', relationTo: 'media', admin: { description: 'Không bắt buộc; khi trống dùng ảnh mặc định của Tuyển dụng.' } },
    { name: 'excerpt', label: 'Mô tả ngắn', type: 'textarea', maxLength: 300 },
    categoryRelationshipField('recruitment'),
    { name: 'department', label: 'Khoa / Phòng tuyển dụng', type: 'relationship', relationTo: 'departments' },
    { name: 'quantity', label: 'Số lượng tuyển', type: 'number' },
    { name: 'content', label: 'Nội dung tuyển dụng', type: 'richText', required: true },
    { name: 'publishedAt', label: 'Ngày đăng', type: 'date', admin: { position: 'sidebar' } },
    { name: 'deadlineAt', label: 'Hạn nộp hồ sơ', type: 'date' },
    { name: 'attachment', label: 'Tệp cũ (tương thích dữ liệu)', type: 'upload', relationTo: 'media', admin: { description: 'Giữ để các tin tuyển dụng cũ không mất tệp. Bài mới dùng danh sách Tệp đính kèm bên dưới.' } },
    attachmentsField(),
    postSourceField,
    layoutTemplateField,
    ...workflowFields,
    ...seoFields,
  ],
}
