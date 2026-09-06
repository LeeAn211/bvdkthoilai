import type { CollectionConfig } from 'payload'
import { anyone, organizationDepartmentScopedAccess } from '@/access'
import { seoFields, slugField } from '@/fields/common'

export const Specialties: CollectionConfig = {
  slug: 'specialties',
  labels: { singular: 'Chuyên khoa', plural: 'Chuyên khoa' },
  admin: {
    useAsTitle: 'name',
    group: 'Tổ chức',
    defaultColumns: ['name', 'department', 'order', 'active', 'updatedAt'],
    description: 'Chuyên khoa là lĩnh vực chuyên môn, KHÔNG dùng để sao chép tên Khoa/Phòng. Mỗi chuyên khoa có thể liên kết với một Khoa/Phòng phụ trách.',
  },
  access: {
    read: anyone,
    create: organizationDepartmentScopedAccess('specialties', 'create'),
    update: organizationDepartmentScopedAccess('specialties', 'edit'),
    delete: organizationDepartmentScopedAccess('specialties', 'delete'),
  },
  versions: { drafts: true, maxPerDoc: 20 },
  hooks: {
    beforeValidate: [({ data, req }) => {
      const record: any = data || {}
      const user: any = req.user
      const privileged = !user || ['super-admin', 'system-admin', 'admin', 'hr'].includes(user.role)
      const assigned = typeof user?.department === 'object' ? user.department?.id : user?.department
      if (!privileged && assigned) record.department = assigned
      return record
    }],
  },
  fields: [
    {
      name: 'useDepartmentName',
      label: 'Cờ dữ liệu cũ: dùng tên Khoa/Phòng',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        hidden: true,
        description: 'Trường tương thích dữ liệu cũ. Không sử dụng cho bản ghi mới.',
      },
    },
    {
      name: 'department',
      label: 'Khoa / Phòng phụ trách',
      type: 'relationship',
      relationTo: 'departments',
      required: true,
      admin: {
        description: 'Chọn đơn vị phụ trách chuyên khoa. Không tạo Chuyên khoa chỉ để lặp lại đúng tên Khoa/Phòng.',
      },
    },
    {
      name: 'name',
      label: 'Tên chuyên khoa',
      type: 'text',
      required: true,
      admin: { description: 'Ví dụ: Tim mạch, Nội tiết, Hô hấp… Tên phải thể hiện chuyên môn, không sao chép tên đơn vị tổ chức.' },
    },
    slugField('name', 'specialties'),
    { name: 'summary', label: 'Giới thiệu ngắn', type: 'textarea' },
    { name: 'content', label: 'Giới thiệu chi tiết', type: 'richText' },
    { name: 'cover', label: 'Ảnh đại diện', type: 'upload', relationTo: 'media' },
    { name: 'services', label: 'Dịch vụ / kỹ thuật nổi bật', type: 'richText' },
    { name: 'order', label: 'Thứ tự hiển thị', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    { name: 'active', label: 'Hiển thị trên website', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    ...seoFields,
  ],
}
