import type { GlobalConfig } from 'payload'
import { admins, loggedIn } from '@/access'

const leaderFields = (): any[] => [
  { name: 'name', label: 'Họ và tên', type: 'text', required: true },
  { name: 'title', label: 'Chức danh hiển thị', type: 'text', required: true },
  { name: 'photo', label: 'Ảnh chân dung', type: 'upload', relationTo: 'media', admin: { description: 'Có thể tải ảnh mới hoặc chọn lại ảnh đã có trong thư viện.' } },
  { name: 'responsibility', label: 'Lĩnh vực phụ trách', type: 'text' },
]

export const OrganizationChart: GlobalConfig = {
  slug: 'organization-chart',
  label: 'Sơ đồ tổ chức',
  admin: {
    group: 'Tổ chức',
    description: 'Quản lý sơ đồ 3 tầng: Giám đốc, 3 Phó Giám đốc và 4 Phòng – 9 Khoa.',
  },
  access: { read: loggedIn, update: admins },
  versions: { max: 20 },
  fields: [
    { name: 'pageTitle', label: 'Tiêu đề trang', type: 'text', defaultValue: 'Sơ đồ tổ chức Bệnh viện Đa khoa Khu vực Thới Lai', required: true },
    { name: 'description', label: 'Mô tả ngắn', type: 'textarea', defaultValue: 'Cơ cấu tổ chức và hệ thống các khoa, phòng trực thuộc bệnh viện.' },
    {
      name: 'director',
      label: 'Bậc 1 – Giám đốc',
      type: 'group',
      fields: leaderFields(),
    },
    {
      name: 'deputyDirectors',
      label: 'Bậc 2 – Các Phó Giám đốc',
      type: 'array',
      maxRows: 3,
      admin: { description: 'Có thể nhập từ 1 đến 3 Phó Giám đốc. Trang chỉ hiển thị những người đã nhập họ tên; kéo thả để đổi vị trí.' },
      fields: leaderFields(),
    },
    {
      name: 'offices',
      label: 'Bậc 3 – Bốn Phòng chức năng',
      type: 'array',
      minRows: 4,
      maxRows: 4,
      admin: { description: 'Chọn đúng 4 Phòng; kéo thả để đổi thứ tự.' },
      fields: [
        { name: 'unit', label: 'Phòng chức năng', type: 'relationship', relationTo: 'departments', required: true, filterOptions: { kind: { equals: 'office' } } },
      ],
    },
    {
      name: 'departments',
      label: 'Bậc 3 – Chín Khoa',
      type: 'array',
      minRows: 9,
      maxRows: 9,
      admin: { description: 'Chọn đúng 9 Khoa; kéo thả để đổi thứ tự.' },
      fields: [
        { name: 'unit', label: 'Khoa', type: 'relationship', relationTo: 'departments', required: true, filterOptions: { kind: { not_equals: 'office' } } },
      ],
    },
    {
      name: 'appearance',
      label: 'Màu sắc hiển thị',
      type: 'group',
      fields: [
        { name: 'primaryColor', label: 'Màu chính', type: 'text', defaultValue: '#0878D1' },
        { name: 'directorColor', label: 'Màu thẻ Giám đốc', type: 'text', defaultValue: '#075B9E' },
        { name: 'deputyColor', label: 'Màu thẻ Phó Giám đốc', type: 'text', defaultValue: '#0B84D8' },
        { name: 'officeColor', label: 'Màu nhóm Phòng', type: 'text', defaultValue: '#188B72' },
        { name: 'departmentColor', label: 'Màu nhóm Khoa', type: 'text', defaultValue: '#6B62C8' },
      ],
    },
  ],
}
