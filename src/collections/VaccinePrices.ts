import type { CollectionConfig } from 'payload'
import { moduleAccess, publicActive } from '@/access'

export const VaccinePrices: CollectionConfig = {
  slug: 'vaccinePrices',
  labels: { singular: 'Giá vắc xin', plural: 'Lịch sử giá vắc xin' },
  admin: { useAsTitle: 'decisionNo', group: 'Khám bệnh', defaultColumns: ['vaccine', 'price', 'effectiveFrom', 'effectiveTo', 'active'] },
  access: {
    read: publicActive,
    create: moduleAccess('vaccinations', 'create'),
    update: moduleAccess('vaccinations', 'edit'),
    delete: moduleAccess('vaccinations', 'delete'),
  },
  fields: [
    { name: 'vaccine', label: 'Vắc xin', type: 'relationship', relationTo: 'vaccines', required: true, index: true },
    { name: 'price', label: 'Giá tiêm', type: 'number', required: true, min: 0 },
    { name: 'decisionNo', label: 'Số / ký hiệu quyết định', type: 'text' },
    { name: 'effectiveFrom', label: 'Hiệu lực từ ngày', type: 'date', required: true, index: true, admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } } },
    { name: 'effectiveTo', label: 'Hiệu lực đến ngày', type: 'date', index: true, admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } } },
    { name: 'note', label: 'Ghi chú', type: 'textarea' },
    { name: 'active', label: 'Cho phép công khai', type: 'checkbox', defaultValue: true, index: true },
  ],
  versions: { drafts: false, maxPerDoc: 50 },
}
