import type { GlobalConfig } from 'payload'
import { loggedIn } from '@/access'
export const MedproSettings: GlobalConfig = {
  slug: 'medpro-settings', label: 'Đặt khám Medpro', admin: { group: 'Dịch vụ người bệnh' }, access: { read: loggedIn, update: loggedIn }, versions: { max: 20 },
  fields: [
    { name: 'enabled', label: 'Hiển thị đặt khám Medpro', type: 'checkbox', defaultValue: true },
    { name: 'url', label: 'Liên kết đặt khám', type: 'text' },
    { name: 'label', label: 'Tên nút', type: 'text', defaultValue: 'Đặt lịch khám' },
    { name: 'openNewTab', label: 'Mở tab mới', type: 'checkbox', defaultValue: true },
  ],
}
