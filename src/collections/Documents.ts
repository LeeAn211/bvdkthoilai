import type { CollectionConfig } from 'payload'
import { contentDeleteAccess, moduleAccess } from '@/access'
import { categoryRelationshipField, seoFields, slugField } from '@/fields/common'

export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: { singular: 'Văn bản / Tài liệu', plural: 'Văn bản / Tài liệu' },
  admin: { useAsTitle: 'title', group: 'Nội dung', defaultColumns: ['title', 'number', 'categoryRef', 'issuedAt', 'year', 'updatedAt'] },
  access: { read: () => true, create: moduleAccess('documents', 'create'), update: moduleAccess('documents', 'edit'), delete: contentDeleteAccess('documents') },
  trash: true,
  versions: { maxPerDoc: 30 },
  fields: [
    { name: 'title', label: 'Tên văn bản', type: 'text', required: true },
    slugField('title', 'documents'),
    { name: 'number', label: 'Số / ký hiệu', type: 'text', index: true },
    categoryRelationshipField('documents'),
    { name: 'category', label: 'Loại tài liệu cũ (tương thích dữ liệu)', type: 'text', admin: { description: 'Giữ dữ liệu cũ; tài liệu mới nên chọn Chuyên mục chuẩn.' } },
    { name: 'issuer', label: 'Cơ quan / đơn vị ban hành', type: 'text' },
    { name: 'issuedAt', label: 'Ngày ban hành', type: 'date' },
    { name: 'effectiveAt', label: 'Ngày hiệu lực', type: 'date' },
    { name: 'year', label: 'Năm ban hành', type: 'number' },
    { name: 'summary', label: 'Trích yếu', type: 'textarea' },
    { name: 'cover', label: 'Ảnh đại diện', type: 'upload', relationTo: 'media', admin: { description: 'Không bắt buộc. Nếu bỏ trống website dùng ảnh mặc định Văn bản – Tài liệu trong Admin → Ảnh mặc định nội dung.' } },
    { name: 'file', label: 'Tệp đính kèm', type: 'upload', relationTo: 'media', required: true, admin: { description: 'Tải tệp mới hoặc chọn lại tệp đã có trong Thư viện Tệp & Hình ảnh.' } },
    ...seoFields,
  ],
}
