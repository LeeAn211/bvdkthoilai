import type { CollectionConfig } from 'payload'
import { moduleAccess, publicActiveFor } from '@/access'
import { slugField } from '@/fields/common'

export const Vaccines: CollectionConfig = {
  slug: 'vaccines',
  labels: { singular: 'Vắc xin', plural: 'Danh mục vắc xin' },
  admin: { useAsTitle: 'name', group: '🏥 Khám bệnh & Dịch vụ Y tế', defaultColumns: ['name', 'manufacturer', 'origin', 'availability', 'active'] },
  access: {
    read: publicActiveFor('vaccinations'),
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
    {
      name: 'targetGroup',
      label: 'Nhóm đối tượng / Độ tuổi (Dùng để lọc nhanh trên Website & Trang chủ)',
      type: 'select',
      defaultValue: 'all',
      options: [
        { label: 'Tất cả lứa tuổi / Mọi đối tượng', value: 'all' },
        { label: 'Trẻ sơ sinh (< 1 tuổi)', value: 'infant' },
        { label: 'Trẻ em (1 - 15 tuổi)', value: 'child' },
        { label: 'Phụ nữ mang thai', value: 'pregnancy' },
        { label: 'Người lớn & Cao tuổi', value: 'adult' },
      ],
      admin: {
        description: 'Chọn nhóm độ tuổi chuẩn để bộ lọc trên trang chủ và trang /tiem-chung nhận diện chính xác 100%.',
      },
    },
    {
      name: 'ageGroup',
      label: 'Chi tiết độ tuổi / Chỉ định cụ thể (Hiển thị chi tiết)',
      type: 'text',
      admin: {
        placeholder: 'Ví dụ: Trẻ từ 2 tháng đến 24 tháng tuổi, Người lớn từ 18 tuổi...',
        description: 'Dòng chữ hiển thị chi tiết trên thẻ vắc xin và trang chi tiết vắc xin.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          label: 'Giá tiêm niêm yết (VNĐ)',
          type: 'number',
          min: 0,
          admin: {
            placeholder: 'Ví dụ: 850000 (để trống nếu Liên hệ, nhập 0 nếu Miễn phí)',
            width: '50%',
            description: 'Nhập trực tiếp giá tiêm tại đây. Có thể quản lý lịch sử giá trong Lịch sử giá vắc xin.',
          },
        },
        {
          name: 'priceNote',
          label: 'Ghi chú giá tiêm',
          type: 'text',
          admin: {
            placeholder: 'Ví dụ: Đã bao gồm công khám & tư vấn',
            width: '50%',
          },
        },
      ],
    },
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
