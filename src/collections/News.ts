import type { CollectionConfig } from 'payload'
import { contentDeleteAccess, moduleAccess, publicPublished, workflowUpdateAccess } from '@/access'
import { attachmentsField, categoryRelationshipField, seoFields, slugField, workflowFields, layoutTemplateField, postSourceField, imageDisplayFields } from '@/fields/common'
import { detachNavigationReference } from '@/hooks/detachNavigationReference'
import { createSlugRedirect, syncPublishedAt } from '@/hooks/contentWorkflow'

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'Tin tức', plural: 'Tin tức' },
  admin: {
    useAsTitle: 'title',
    group: 'Nội dung',
    defaultColumns: ['title', 'categoryRef', 'workflowState', '_status', 'publishedAt', 'updatedAt'],
    description: 'Đăng và quản lý tin tức, hoạt động và kiến thức sức khỏe.',
  },
  access: {
    read: publicPublished,
    create: moduleAccess('news', 'create'),
    update: workflowUpdateAccess('news'),
    delete: contentDeleteAccess('news'),
  },
  trash: true,
  hooks: {
    beforeChange: [syncPublishedAt('publishedAt')],
    afterRead: [
      ({ doc }) => {
        // Frontend cũ đang dùng trường `category` dạng text để lọc tab trang chủ.
        // Bài mới lại chọn `categoryRef` (Chuyên mục chuẩn). Đồng bộ tên chuyên
        // mục khi đọc để bài đã xuất bản hiển thị ngay trong tab tương ứng,
        // đồng thời vẫn giữ tương thích với dữ liệu cũ chỉ có `category`.
        const ref = (doc as any)?.categoryRef
        const refName = ref && typeof ref === 'object' ? ref.name : undefined
        if (typeof refName === 'string' && refName.trim()) {
          return { ...(doc as any), category: refName.trim() }
        }
        return doc
      },
    ],
    afterChange: [createSlugRedirect('news')],
    beforeDelete: [detachNavigationReference('news')],
  },
  versions: { drafts: { autosave: true, schedulePublish: false }, maxPerDoc: 50 },
  fields: [
    { name: 'title', label: 'Tiêu đề', type: 'text', required: true },
    slugField('title', 'news'),
    { name: 'excerpt', label: 'Mô tả ngắn', type: 'textarea', maxLength: 500 },
    { name: 'cover', label: 'Ảnh đại diện', type: 'upload', relationTo: 'media', admin: { description: 'Không bắt buộc. Khi bỏ trống website dùng ảnh mặc định được cấu hình trong Hệ thống → Ảnh mặc định nội dung.' } },
    {
      name: 'content', label: 'Nội dung chi tiết', type: 'richText', required: true,
      admin: { description: 'Hỗ trợ định dạng văn bản, nhiều ảnh, liên kết, bảng và tệp đính kèm.' },
    },
    categoryRelationshipField('news'),
    {
      name: 'category', label: 'Chuyên mục cũ (tương thích dữ liệu)', type: 'text',
      admin: { description: 'Giữ để không mất dữ liệu cũ. Bài mới nên chọn “Chuyên mục chuẩn”.' },
    },
    attachmentsField(),
    { name: 'featured', label: 'Tin nổi bật', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'pinned', label: 'Ghim bài viết', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'publishedAt', label: 'Ngày đăng', type: 'date', admin: { position: 'sidebar' } },
    postSourceField,
    layoutTemplateField,
    ...imageDisplayFields,
    ...workflowFields,
    ...seoFields,
  ],
}
