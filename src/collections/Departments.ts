import type { CollectionConfig } from 'payload'
import { anyone, moduleAccess, ownDepartmentRecordAccess } from '@/access'
import { slugField, seoFields } from '@/fields/common'
import { detachNavigationReference } from '@/hooks/detachNavigationReference'

export const Departments: CollectionConfig = {
  slug: 'departments',
  labels: { singular: 'Khoa / Phòng', plural: 'Khoa / Phòng' },
  admin: {
    useAsTitle: 'name',
    group: 'Tổ chức',
    defaultColumns: ['name', 'kind', 'leader', 'order', 'active', 'updatedAt'],
    description: 'Hồ sơ đơn vị dùng chung cho sơ đồ tổ chức, chuyên khoa, bác sĩ và trang giới thiệu khoa/phòng.',
  },
  access: {
    read: anyone,
    create: moduleAccess('departments', 'create'),
    update: ownDepartmentRecordAccess('edit'),
    delete: moduleAccess('departments', 'delete'),
  },
  hooks: { beforeDelete: [detachNavigationReference('departments')] },
  // Không cần quy trình draft/publish - khoa phòng là dữ liệu hành chính, hiển thị ngay
  versions: false,
  fields: [
    { name: 'name', label: 'Tên khoa / phòng', type: 'text', required: true },
    {
      name: 'kind', label: 'Nhóm đơn vị cũ (tương thích dữ liệu)', type: 'text', required: true, defaultValue: 'clinical',
      admin: { description: 'Giữ nguyên field của các phiên bản trước để không làm mất giá trị đang sử dụng.' },
    },
    {
      name: 'unitType', label: 'Phân loại chuẩn', type: 'select', defaultValue: 'clinical',
      options: [
        { label: 'Khoa lâm sàng', value: 'clinical' },
        { label: 'Khoa cận lâm sàng', value: 'paraclinical' },
        { label: 'Phòng chức năng', value: 'office' },
        { label: 'Đơn vị khác', value: 'other' },
      ],
      admin: { description: 'Field chuẩn từ v3.7.0. Dữ liệu cũ vẫn được đọc từ Nhóm đơn vị cũ khi chưa thiết lập.' },
    },
    slugField('name', 'departments'),
    { name: 'summary', label: 'Giới thiệu ngắn', type: 'textarea' },
    { name: 'content', label: 'Giới thiệu / chức năng nhiệm vụ', type: 'richText' },
    { name: 'functions', label: 'Chức năng – nhiệm vụ', type: 'richText' },
    { name: 'activities', label: 'Hoạt động chuyên môn', type: 'richText' },
    { name: 'achievements', label: 'Thành tích / điểm nổi bật', type: 'richText' },
    { name: 'leader', label: 'Trưởng khoa / phòng', type: 'text' },
    { name: 'deputyLeaders', label: 'Phó trưởng khoa / phòng', type: 'array', fields: [
      { name: 'name', label: 'Họ và tên', type: 'text', required: true },
      { name: 'title', label: 'Chức danh', type: 'text' },
    ] },
    { name: 'phone', label: 'Số điện thoại', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'location', label: 'Vị trí', type: 'text' },
    { name: 'cover', label: 'Ảnh đại diện', type: 'upload', relationTo: 'media', admin: { description: 'Tải ảnh mới hoặc chọn lại từ Thư viện Tệp & Hình ảnh.' } },
    { name: 'gallery', label: 'Hình ảnh đơn vị', type: 'array', fields: [
      { name: 'image', label: 'Hình ảnh', type: 'upload', relationTo: 'media', required: true },
      { name: 'caption', label: 'Chú thích', type: 'text' },
    ] },
    { name: 'order', label: 'Thứ tự hiển thị', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    { name: 'active', label: 'Hiển thị trên website', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    ...seoFields,
  ],
}
