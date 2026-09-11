import type { CollectionConfig } from 'payload'
import { moduleAccess, publicActive } from '@/access'
import { slugField } from '@/fields/common'

export const Vaccines: CollectionConfig = {
  slug: 'vaccines',
  labels: { singular: 'Vắc xin', plural: 'Danh mục vắc xin' },
  admin: { useAsTitle: 'name', group: 'Khám bệnh', defaultColumns: ['name', 'manufacturer', 'origin', 'availability', 'active'] },
  access: {
    read: publicActive,
    create: moduleAccess('vaccinations', 'create'),
    update: moduleAccess('vaccinations', 'edit'),
    delete: moduleAccess('vaccinations', 'delete'),
  },
  fields: [
    { name: 'code', label: 'Mã vắc xin', type: 'text', unique: true, index: true },
    { name: 'name', label: 'Tên vắc xin', type: 'text', required: true, index: true },
    slugField('name', 'vaccines'),
    { name: 'summary', label: 'Mô tả ngắn', type: 'textarea', maxLength: 500 },
    { name: 'manufacturer', label: 'Nhà sản xuất', type: 'text' },
    { name: 'origin', label: 'Nước sản xuất', type: 'text' },
    { name: 'prevents', label: 'Phòng bệnh', type: 'textarea' },
    { name: 'ageGroup', label: 'Độ tuổi / đối tượng', type: 'text' },
    { name: 'image', label: 'Ảnh vắc xin', type: 'upload', relationTo: 'media', admin: { description: 'Không bắt buộc. Nếu bỏ trống website dùng ảnh mặc định Lịch tiêm chủng / Tiêm ngừa.' } },
    { name: 'detailContent', label: 'Nội dung chi tiết', type: 'richText' },
    { name: 'availability', label: 'Tình trạng', type: 'select', defaultValue: 'available', options: [
      { label: 'Đang có vắc xin', value: 'available' },
      { label: 'Sắp có', value: 'coming' },
      { label: 'Tạm hết', value: 'unavailable' },
    ] },
    { name: 'registrationUrl', label: 'Liên kết đăng ký', type: 'text' },
    { name: 'note', label: 'Ghi chú', type: 'textarea' },
    { name: 'active', label: 'Hiển thị trên website', type: 'checkbox', defaultValue: true, index: true },
  ],
  versions: { drafts: true, maxPerDoc: 30 },
  trash: true,
}
