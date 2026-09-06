import type { CollectionConfig } from 'payload'
import { moduleAccess, publicActive } from '@/access'

export const ServicePrices: CollectionConfig = {
  slug: 'servicePrices',
  labels: { singular: 'Mức giá dịch vụ', plural: 'Lịch sử giá dịch vụ' },
  admin: {
    useAsTitle: 'decisionNo',
    group: 'Khám bệnh',
    description: 'Lưu lịch sử giá theo thời gian hiệu lực. Không ghi đè lịch sử khi có quyết định giá mới.',
    defaultColumns: ['service', 'insurancePrice', 'servicePrice', 'effectiveFrom', 'effectiveTo', 'active'],
  },
  access: {
    read: publicActive,
    create: moduleAccess('services', 'create'),
    update: moduleAccess('services', 'edit'),
    delete: moduleAccess('services', 'delete'),
  },
  fields: [
    { name: 'service', label: 'Dịch vụ', type: 'relationship', relationTo: 'services', required: true, index: true },
    { name: 'insurancePrice', label: 'Giá BHYT', type: 'number', min: 0 },
    { name: 'servicePrice', label: 'Giá dịch vụ', type: 'number', min: 0 },
    { name: 'decisionNo', label: 'Số / ký hiệu quyết định', type: 'text', index: true },
    { name: 'effectiveFrom', label: 'Hiệu lực từ ngày', type: 'date', required: true, index: true, admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } } },
    { name: 'effectiveTo', label: 'Hiệu lực đến ngày', type: 'date', index: true, admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } } },
    { name: 'sourceFileName', label: 'Nguồn nhập / tên file', type: 'text', admin: { readOnly: true } },
    { name: 'note', label: 'Ghi chú', type: 'textarea' },
    { name: 'active', label: 'Cho phép công khai', type: 'checkbox', defaultValue: true, index: true },
  ],
  versions: { drafts: false, maxPerDoc: 50 },
}
