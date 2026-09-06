import type { CollectionConfig } from 'payload'
import { contentDeleteAccess, moduleAccess, publicPublished, workflowUpdateAccess } from '@/access'
import { attachmentsField, slugField, seoFields, workflowFields } from '@/fields/common'
import { detachNavigationReference } from '@/hooks/detachNavigationReference'
import { createSlugRedirect } from '@/hooks/contentWorkflow'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Trang nội dung', plural: 'Trang nội dung' },
  admin: { useAsTitle: 'title', group: 'Nội dung' },
  access: { read: publicPublished, create: moduleAccess('pages', 'create'), update: workflowUpdateAccess('pages'), delete: contentDeleteAccess('pages') },
  trash: true,
  versions: { drafts: { autosave: true, schedulePublish: false }, maxPerDoc: 30 },
  hooks: { afterChange: [createSlugRedirect('pages')], beforeDelete: [detachNavigationReference('pages')] },
  fields: [
    { name: 'title', label: 'Tên trang', type: 'text', required: true },
    slugField('title', 'pages'),
    {
      name: 'layout',
      type: 'blocks',
      blocks: [
        {
          slug: 'richText',
          labels: { singular: 'Văn bản', plural: 'Văn bản' },
          fields: [{ name: 'content', type: 'richText', required: true }]
        },
        {
          slug: 'imageText',
          labels: { singular: 'Ảnh + Văn bản', plural: 'Ảnh + Văn bản' },
          fields: [
            { name: 'image', label: 'Hình ảnh', type: 'upload', relationTo: 'media', required: true, admin: { description: 'Tải ảnh mới hoặc chọn lại ảnh đã có trong thư viện.' } },
            { name: 'content', type: 'richText', required: true },
            { name: 'imagePosition', type: 'select', defaultValue: 'left', options: ['left', 'right'] }
          ]
        },
        {
          slug: 'gallery',
          labels: { singular: 'Thư viện ảnh', plural: 'Thư viện ảnh' },
          fields: [{ name: 'images', type: 'array', fields: [{ name: 'image', label: 'Hình ảnh', type: 'upload', relationTo: 'media', required: true, admin: { description: 'Tải ảnh mới hoặc chọn lại ảnh đã có trong thư viện.' } }] }]
        },
        {
          slug: 'faq',
          labels: { singular: 'FAQ', plural: 'FAQ' },
          fields: [{ name: 'items', type: 'array', fields: [
            { name: 'question', type: 'text', required: true },
            { name: 'answer', type: 'textarea', required: true }
          ]}]
        },
        {
          slug: 'downloads',
          labels: { singular: 'Tài liệu tải xuống', plural: 'Tài liệu tải xuống' },
          fields: [{ name: 'items', type: 'array', fields: [
            { name: 'label', label: 'Tên hiển thị cũ', type: 'text', required: false, admin: { hidden: true } },
            { name: 'file', label: 'Tệp', type: 'upload', relationTo: 'media', required: true, admin: { description: 'Tải tệp mới hoặc chọn lại tệp đã có trong thư viện.' } }
          ]}]
        }
      ]
    },
    attachmentsField(),
    ...workflowFields,
    ...seoFields
  ]
}
