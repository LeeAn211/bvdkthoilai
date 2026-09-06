import type { CollectionConfig } from 'payload'
import { moduleAccess } from '@/access'

export const ImportJobs: CollectionConfig = {
  slug: 'importJobs',
  labels: { singular: 'Lần nhập dữ liệu', plural: 'Lịch sử nhập dữ liệu' },
  admin: { useAsTitle: 'fileName', group: 'Hệ thống', defaultColumns: ['module', 'fileName', 'status', 'createdCount', 'updatedCount', 'skippedCount', 'createdAt'] },
  access: {
    read: moduleAccess('services', 'view'),
    create: moduleAccess('services', 'import'),
    update: moduleAccess('services', 'import'),
    delete: moduleAccess('services', 'delete'),
  },
  fields: [
    { name: 'module', label: 'Phân hệ', type: 'select', required: true, defaultValue: 'services', options: [{ label: 'Bảng giá dịch vụ', value: 'services' }, { label: 'Vắc xin', value: 'vaccines' }] },
    { name: 'fileName', label: 'Tên file', type: 'text', required: true },
    { name: 'status', label: 'Trạng thái', type: 'select', required: true, defaultValue: 'completed', options: [
      { label: 'Đã kiểm tra', value: 'previewed' }, { label: 'Hoàn tất', value: 'completed' }, { label: 'Có lỗi', value: 'failed' }, { label: 'Đã hoàn tác', value: 'rolled-back' },
    ] },
    { name: 'createdCount', label: 'Thêm mới', type: 'number', defaultValue: 0 },
    { name: 'updatedCount', label: 'Cập nhật', type: 'number', defaultValue: 0 },
    { name: 'skippedCount', label: 'Bỏ qua', type: 'number', defaultValue: 0 },
    { name: 'errorCount', label: 'Số lỗi', type: 'number', defaultValue: 0 },
    { name: 'errors', label: 'Chi tiết lỗi', type: 'json' },
    { name: 'importedBy', label: 'Người thực hiện', type: 'relationship', relationTo: 'users' },
  ],
  timestamps: true,
}
