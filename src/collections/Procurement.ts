import type { CollectionConfig } from 'payload'
import { contentDeleteAccess, moduleAccess, publicPublished, workflowUpdateAccess } from '@/access'
import { attachmentsField, categoryRelationshipField, seoFields, slugField, workflowFields, layoutTemplateField, postSourceField, imageDisplayFields } from '@/fields/common'
import { detachNavigationReference } from '@/hooks/detachNavigationReference'
import { createSlugRedirect, syncPublishedAt } from '@/hooks/contentWorkflow'

export const Procurement: CollectionConfig = {
  slug: 'procurement',
  labels: { singular: 'Đấu thầu – Mua sắm', plural: 'Đấu thầu – Mua sắm' },
  admin: { useAsTitle: 'title', group: 'Đấu thầu – Mua sắm', defaultColumns: ['title', 'referenceCode', 'type', 'procurementStatus', 'publishedAt', 'deadlineAt', '_status'] },
  access: { read: publicPublished, create: moduleAccess('procurement', 'create'), update: workflowUpdateAccess('procurement'), delete: contentDeleteAccess('procurement') },
  trash: true,
  versions: { drafts: { autosave: true, schedulePublish: false }, maxPerDoc: 100 },
  hooks: {
    beforeChange: [syncPublishedAt('publishedAt')],
    afterChange: [createSlugRedirect('procurement')],
    beforeDelete: [detachNavigationReference('procurement')],
  },
  fields: [
    { name: 'title', label: 'Tiêu đề', type: 'text', required: true },
    slugField('title', 'procurement'),
    { name: 'cover', label: 'Ảnh đại diện', type: 'upload', relationTo: 'media', admin: { description: 'Không bắt buộc; khi trống dùng ảnh mặc định của Đấu thầu – Mua sắm.' } },
    { name: 'excerpt', label: 'Mô tả ngắn', type: 'textarea', maxLength: 300 },
    { name: 'referenceCode', label: 'Mã tham chiếu / Mã gói', type: 'text', index: true },
    categoryRelationshipField('procurement'),
    {
      name: 'type', label: 'Loại thông tin', type: 'select', required: true,
      options: [
        { label: 'Thông báo mời thầu', value: 'Thông báo mời thầu' },
        { label: 'Kế hoạch lựa chọn nhà thầu', value: 'Kế hoạch lựa chọn nhà thầu' },
        { label: 'Yêu cầu báo giá', value: 'Yêu cầu báo giá' },
        { label: 'Mua sắm', value: 'Mua sắm' },
        { label: 'Kết quả lựa chọn nhà thầu', value: 'Kết quả lựa chọn nhà thầu' },
        { label: 'Đính chính', value: 'Đính chính' },
      ],
    },
    { name: 'content', label: 'Nội dung chi tiết', type: 'richText', required: true },
    { name: 'publishedAt', label: 'Ngày đăng', type: 'date' },
    { name: 'deadlineAt', label: 'Hạn tiếp nhận', type: 'date' },
    {
      name: 'procurementStatus', label: 'Trạng thái đấu thầu', type: 'select', defaultValue: 'open',
      options: [
        { label: 'Đang tiếp nhận', value: 'open' },
        { label: 'Sắp hết hạn', value: 'closing' },
        { label: 'Đã hết hạn', value: 'closed' },
        { label: 'Đã hủy', value: 'cancelled' },
      ],
    },
    { name: 'contactUnit', label: 'Đơn vị phụ trách', type: 'text' },
    { name: 'contactInfo', label: 'Thông tin liên hệ', type: 'textarea' },
    attachmentsField(),
    {
      name: 'changeLog', label: 'Lịch sử cập nhật', type: 'array',
      fields: [
        { name: 'date', label: 'Thời gian', type: 'date', required: true },
        { name: 'note', label: 'Nội dung thay đổi', type: 'textarea', required: true },
      ],
    },
    postSourceField,
    layoutTemplateField,
    ...imageDisplayFields,
    ...workflowFields,
    ...seoFields,
  ],
}
