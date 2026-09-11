import type { GlobalConfig, Field } from 'payload'
import { admins, loggedIn } from '@/access'

const leaderFields = (): Field[] => [
  {
    name: 'doctorRef',
    label: 'Liên kết từ Bác sĩ (Quản trị → Tổ chức → Bác sĩ)',
    type: 'relationship',
    relationTo: 'doctors',
    admin: {
      description: 'Nếu chọn bác sĩ, hệ thống sẽ tự động lấy tên, ảnh đại diện và chức danh của bác sĩ.',
    },
  },
  { name: 'name', label: 'Họ và tên', type: 'text' },
  { name: 'title', label: 'Chức danh hiển thị', type: 'text' },
  { 
    name: 'photo', 
    label: 'Ảnh chân dung', 
    type: 'upload', 
    relationTo: 'media', 
    admin: { 
      description: 'Kích thước hiển thị đẹp nhất: Tỷ lệ 3:4 hoặc 4:5 (khuyến nghị 600×800px hoặc 450×600px, dung lượng < 2MB). Có thể tải ảnh mới hoặc chọn từ Thư viện. Nếu để trống, hệ thống sẽ tự dùng ảnh đại diện từ Bác sĩ liên kết.' 
    } 
  },
  { name: 'responsibility', label: 'Lĩnh vực phụ trách / Nhiệm vụ', type: 'text' },
  { name: 'phone', label: 'Điện thoại liên hệ', type: 'text' },
  { name: 'email', label: 'Email', type: 'text' },
]

export const OrganizationChart: GlobalConfig = {
  slug: 'organization-chart',
  label: 'Sơ đồ tổ chức',
  admin: {
    group: 'Tổ chức',
    description: 'Quản lý sơ đồ bộ máy: Giám đốc, các Phó Giám đốc, Khối Phòng chức năng và Khối Khoa chuyên môn.',
  },
  access: { read: () => true, update: admins },
  versions: { max: 20 },
  fields: [
    { name: 'pageTitle', label: 'Tiêu đề trang', type: 'text', defaultValue: 'Sơ đồ tổ chức Bệnh viện Đa khoa Khu vực Thới Lai', required: true },
    { name: 'description', label: 'Mô tả ngắn', type: 'textarea', defaultValue: 'Cơ cấu tổ chức bộ máy và hệ thống các khoa, phòng trực thuộc Bệnh viện Đa khoa Khu vực Thới Lai.' },
    {
      name: 'director',
      label: 'Bậc 1 – Giám đốc Bệnh viện',
      type: 'group',
      fields: leaderFields(),
    },
    {
      name: 'deputyDirectors',
      label: 'Bậc 2 – Các Phó Giám đốc Bệnh viện',
      type: 'array',
      maxRows: 8,
      admin: { description: 'Có thể thêm các Phó Giám đốc (tối đa 8); tự động canh đều cân đối trên sơ đồ; kéo thả để đổi vị trí.' },
      fields: leaderFields(),
    },
    {
      name: 'offices',
      label: 'Bậc 3 – Khối Phòng chức năng',
      type: 'array',
      admin: { description: 'Chọn các Phòng chức năng; kéo thả để đổi thứ tự.' },
      fields: [
        { name: 'unit', label: 'Phòng chức năng', type: 'relationship', relationTo: 'departments', required: true, filterOptions: { kind: { equals: 'office' } } },
      ],
    },
    {
      name: 'departments',
      label: 'Bậc 3 – Khối Khoa chuyên môn',
      type: 'array',
      admin: { description: 'Chọn các Khoa chuyên môn; kéo thả để đổi thứ tự.' },
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
