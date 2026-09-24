import type { CollectionConfig } from 'payload'
import { contentDeleteAccess, moduleAccess, publicPublishedFor, workflowUpdateAccess } from '@/access'
import { attachmentsField, imageDisplayFields, layoutTemplateField, postSourceField, seoFields, showSourceField, slugField, workflowFields } from '@/fields/common'
import { detachNavigationReference } from '@/hooks/detachNavigationReference'
import { createSlugRedirect, syncPublishedAt } from '@/hooks/contentWorkflow'

export const ScientificActivities: CollectionConfig = {
  slug: 'scientific-activities',
  labels: { singular: 'Bài viết Hoạt động khoa học', plural: 'Hoạt động khoa học' },
  admin: {
    useAsTitle: 'title',
    group: '🩺 Chuyên môn & Tổ chức',
    defaultColumns: ['title', 'categoryGroup', 'workflowState', '_status', 'publishedAt', 'updatedAt'],
    description: 'Thêm và quản lý bài viết cho mục Hoạt động khoa học trên trang chủ và trang danh sách riêng.',
  },
  access: {
    read: publicPublishedFor('scientific-activities'),
    create: moduleAccess('scientific-activities', 'create'),
    update: workflowUpdateAccess('scientific-activities'),
    delete: contentDeleteAccess('scientific-activities'),
  },
  trash: true,
  hooks: {
    beforeChange: [syncPublishedAt('publishedAt')],
    afterChange: [createSlugRedirect('scientific-activities')],
    beforeDelete: [detachNavigationReference('scientific-activities')],
  },
  versions: { drafts: { autosave: true, schedulePublish: false }, maxPerDoc: 50 },
  fields: [
    { name: 'title', label: 'Tiêu đề', type: 'text', required: true },
    slugField('title', 'scientific-activities'),
    { name: 'excerpt', label: 'Mô tả ngắn', type: 'textarea', maxLength: 500 },
    {
      name: 'categoryGroup',
      label: 'Nhóm hoạt động khoa học',
      type: 'relationship',
      relationTo: 'scientific-activity-groups',
      required: true,
      filterOptions: { active: { equals: true } },
      admin: {
        description: 'Chọn một nhóm đang sử dụng. Có thể thêm, sửa hoặc xóa nhóm tại mục “Nhóm hoạt động khoa học” trong Admin.',
      },
    },
    {
      name: 'category',
      label: 'Nhóm cũ (dữ liệu tương thích)',
      type: 'select',
      defaultValue: 'Đào tạo – Tập huấn',
      admin: { hidden: true },
      options: [
        { label: 'Đào tạo – Tập huấn', value: 'Đào tạo – Tập huấn' },
        { label: 'Hội nghị – Hội thảo', value: 'Hội nghị – Hội thảo' },
        { label: 'Kiến thức y khoa', value: 'Kiến thức y khoa' },
        { label: 'Thông tin cho người bệnh', value: 'Thông tin cho người bệnh' },
      ],
    },
    {
      name: 'cover',
      label: 'Ảnh đại diện',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Ảnh hiển thị tại mục Hoạt động khoa học và trang danh sách bài viết.' },
    },
    {
      name: 'content',
      label: 'Nội dung chi tiết',
      type: 'richText',
      required: true,
      admin: { description: 'Nội dung bài viết, hình ảnh, liên kết, bảng và tài liệu liên quan.' },
    },
    attachmentsField(),
    { name: 'featured', label: 'Ưu tiên hiển thị', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'publishedAt', label: 'Ngày đăng', type: 'date', admin: { position: 'sidebar' } },
    postSourceField,
    showSourceField(true),
    layoutTemplateField,
    ...imageDisplayFields,
    ...workflowFields,
    ...seoFields,
  ],
}
