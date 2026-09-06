import type { CollectionConfig } from 'payload'
import { moduleAccess, publicActive } from '@/access'

export const VaccinationSchedules: CollectionConfig = {
  slug: 'vaccinationSchedules',
  labels: { singular: 'Lịch tiêm chủng', plural: 'Lịch tiêm chủng' },
  admin: {
    useAsTitle: 'title',
    group: 'Khám bệnh',
    description: 'Ưu tiên đăng ảnh/tệp lịch chính thức; có thể khai báo ngày, đối tượng và địa điểm để tra cứu.',
    defaultColumns: ['title', 'date', 'endDate', 'scheduleKind', 'active'],
  },
  access: {
    read: publicActive,
    create: moduleAccess('vaccinations', 'create'),
    update: moduleAccess('vaccinations', 'edit'),
    delete: moduleAccess('vaccinations', 'delete'),
  },
  fields: [
    { name: 'title', label: 'Tiêu đề lịch tiêm', type: 'text', required: true },
    { name: 'scheduleKind', label: 'Loại lịch', type: 'select', defaultValue: 'official', options: [
      { label: 'Lịch chính thức', value: 'official' },
      { label: 'Điều chỉnh / bổ sung', value: 'adjustment' },
      { label: 'Thông báo chung', value: 'announcement' },
    ] },
    { name: 'summary', label: 'Mô tả ngắn', type: 'textarea', maxLength: 500 },
    { name: 'scheduleImage', label: 'Ảnh lịch tiêm', type: 'upload', relationTo: 'media', admin: { description: 'Không bắt buộc. Nếu bỏ trống website dùng ảnh mặc định Lịch tiêm chủng / Tiêm ngừa trong Admin → Ảnh mặc định nội dung.' } },
    { name: 'scheduleFile', label: 'Tệp lịch tiêm', type: 'upload', relationTo: 'media', admin: { description: 'Có thể đính kèm PDF/Word/Excel.' } },
    { name: 'detailContent', label: 'Nội dung chi tiết', type: 'richText' },
    { name: 'target', label: 'Đối tượng tiêm', type: 'text' },
    { name: 'date', label: 'Từ ngày', type: 'date', index: true, admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } } },
    { name: 'endDate', label: 'Đến ngày', type: 'date', admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } } },
    { name: 'startTime', label: 'Giờ bắt đầu', type: 'text' },
    { name: 'endTime', label: 'Giờ kết thúc', type: 'text' },
    { name: 'location', label: 'Địa điểm', type: 'text' },
    { name: 'registrationUrl', label: 'Liên kết đăng ký', type: 'text' },
    { name: 'note', label: 'Ghi chú', type: 'textarea' },
    { name: 'active', label: 'Đang áp dụng', type: 'checkbox', defaultValue: true, index: true },
  ],
  versions: { drafts: true, maxPerDoc: 30 },
  trash: true,
}
