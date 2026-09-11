import type { CollectionConfig } from 'payload'
import { moduleAccess, publicActive } from '@/access'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Bảng giá dịch vụ', plural: 'Bảng giá dịch vụ' },
  admin: {
    useAsTitle: 'name',
    group: 'Khám bệnh',
    description: 'Thêm từng dịch vụ hoặc dùng khung nhập Excel ngay phía trên danh sách.',
    components: { beforeList: ['/src/components/admin/ServicesExcelImport'] },
  },
  access: { read: publicActive, create: moduleAccess('services', 'create'), update: moduleAccess('services', 'edit'), delete: moduleAccess('services', 'delete') },
  fields: [
    { name: 'sequence', label: 'STT', type: 'number', admin: { position: 'sidebar' } },
    { name: 'code', label: 'Mã dịch vụ', type: 'text', required: true, unique: true, index: true },
    { name: 'name', label: 'Tên dịch vụ', type: 'text', required: true, index: true },
    { name: 'category', label: 'Nhóm / danh mục dịch vụ', type: 'text', index: true },
    { name: 'unit', label: 'Đơn vị tính', type: 'text' },
    { name: 'insurancePrice', label: 'Giá BHYT (tương thích dữ liệu cũ)', type: 'number', min: 0, admin: { description: 'Từ v3.6.0, lịch sử giá chính thức được lưu ở Lịch sử giá dịch vụ.' } },
    { name: 'price', label: 'Giá dịch vụ (tương thích dữ liệu cũ)', type: 'number', min: 0, admin: { description: 'Giữ lại để không mất dữ liệu cũ; giá có hiệu lực lấy từ Lịch sử giá dịch vụ.' } },
    { name: 'note', label: 'Ghi chú', type: 'textarea' },
    { name: 'active', label: 'Hiển thị công khai', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } }
  ]
}
