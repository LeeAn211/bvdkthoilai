import type { GlobalConfig, Field } from 'payload'
import { loggedIn } from '@/access'

const colorField = (name: string, label: string, defaultValue?: string): Field => ({
  name, label, type: 'text',
  ...(defaultValue ? { defaultValue } : {}),
  admin: { components: { Field: '@/components/admin/ColorPickerField#default' } },
} as Field)

export const ThemeSettings: GlobalConfig = {
  slug: 'theme-settings', label: 'Màu sắc & Giao diện', admin: { group: 'Trang chủ & Giao diện' }, access: { read: loggedIn, update: loggedIn }, versions: { max: 20 },
  fields: [
    colorField('primaryColor', 'Màu chính', '#0878D1'),
    colorField('secondaryColor', 'Màu phụ', '#0754A8'),
    colorField('accentColor', 'Màu nhấn', '#16A36A'),
    { name: 'fontFamily', label: 'Font chữ', type: 'select', defaultValue: 'system', options:[{label:'Segoe UI / hệ thống',value:'system'},{label:'Arial',value:'arial'},{label:'Tahoma',value:'tahoma'}] },
    { name: 'baseFontSize', label: 'Cỡ chữ toàn website (px)', type: 'number', defaultValue: 16, min: 13, max: 22, admin: { description: 'Điều chỉnh đồng bộ cỡ chữ nội dung toàn website. Khuyến nghị 16–18 px; mặc định 16 px.' } },
    { name: 'fontScale', label: 'Tỷ lệ phóng chữ giao diện (%)', type: 'number', defaultValue: 115, min: 90, max: 140, admin: { description: 'Phóng riêng hệ thống chữ giao diện, không làm phóng ảnh/banner. 100% = cỡ cũ; khuyến nghị 110–120%.' } },
    { name: 'contentMaxWidth', label: 'Độ rộng nội dung tối đa (px)', type: 'number', defaultValue: 1300, min: 960, max: 1600 },
  ],
}
