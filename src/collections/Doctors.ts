import type { CollectionConfig } from 'payload'
import { anyone, organizationDepartmentScopedAccess } from '@/access'
import { slugField, seoFields } from '@/fields/common'
import { detachNavigationReference } from '@/hooks/detachNavigationReference'

export const Doctors: CollectionConfig = {
  slug: 'doctors',
  labels: { singular: 'Bác sĩ', plural: 'Bác sĩ' },
  admin: {
    useAsTitle: 'name', group: 'Tổ chức',
    defaultColumns: ['name', 'department', 'specialtyRef', 'title', 'active', 'order'],
    description: 'Khoa/Phòng là quan hệ tổ chức chính của bác sĩ. Chuyên khoa chỉ chọn khi bác sĩ thực sự thuộc một lĩnh vực chuyên môn riêng.',
  },
  access: {
    read: anyone,
    create: organizationDepartmentScopedAccess('doctors', 'create'),
    update: organizationDepartmentScopedAccess('doctors', 'edit'),
    delete: organizationDepartmentScopedAccess('doctors', 'delete'),
  },
  versions: { drafts: true, maxPerDoc: 20 },
  hooks: {
    beforeDelete: [detachNavigationReference('doctors')],
    beforeValidate: [({ data, req }) => {
      const user: any = req.user
      if (!user || ['super-admin', 'system-admin', 'admin', 'hr'].includes(user.role)) return data
      const assigned = typeof user.department === 'object' ? user.department?.id : user.department
      if (assigned && data) (data as any).department = assigned
      return data
    }],
  },
  fields: [
    { name: 'name', label: 'Họ và tên bác sĩ', type: 'text', required: true },
    slugField('name', 'doctors'),
    { name: 'title', label: 'Chức danh', type: 'text' },
    { name: 'degree', label: 'Học vị / Học hàm', type: 'text' },
    { name: 'professionalTitle', label: 'Chức danh nghề nghiệp', type: 'text' },
    { 
      name: 'avatar', 
      label: 'Ảnh chân dung bác sĩ', 
      type: 'upload', 
      relationTo: 'media', 
      admin: { 
        description: '💡 Gợi ý kích thước chuẩn: Tỷ lệ đứng 3:4 (chuẩn nhất: 600×800px hoặc 450×600px). Chụp bán thân/chân dung nền sáng hoặc áo blouse trắng. Hệ thống tự động căn chỉnh vừa vặn khung hình 3:4 và giữ nguyên tỷ lệ, không bị méo/biến dạng ảnh.' 
      } 
    },
    { name: 'department', label: 'Khoa / Phòng', type: 'relationship', relationTo: 'departments', required: true },
    {
      name: 'specialtyRef', label: 'Chuyên khoa chuyên môn (không bắt buộc)', type: 'relationship', relationTo: 'specialties',
      filterOptions: ({ data }: any) => data?.department ? ({ department: { equals: typeof data.department === 'object' ? data.department.id : data.department } }) : true,
      admin: { description: 'Chỉ chọn khi cần phân loại chuyên môn sâu. Không bắt buộc nếu Khoa/Phòng đã đủ để mô tả đơn vị công tác.' },
    },
    { name: 'specialty', label: 'Chuyên khoa cũ (tương thích dữ liệu)', type: 'text', admin: { readOnly: true, description: 'Trường chỉ đọc để bảo toàn dữ liệu cũ. Không nhập mới vào trường này.' } },
    { name: 'licenseNumber', label: 'Số giấy phép hành nghề (nếu công khai)', type: 'text' },
    { name: 'bio', label: 'Giới thiệu', type: 'richText' },
    { name: 'expertise', label: 'Lĩnh vực chuyên môn', type: 'richText' },
    { name: 'experience', label: 'Kinh nghiệm công tác', type: 'richText' },
    { name: 'education', label: 'Quá trình đào tạo', type: 'richText' },
    { name: 'achievements', label: 'Thành tích / nghiên cứu', type: 'richText' },
    { name: 'order', label: 'Thứ tự hiển thị', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    { name: 'featured', label: 'Bác sĩ nổi bật', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'active', label: 'Hiển thị trên website', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    ...seoFields,
  ],
}
