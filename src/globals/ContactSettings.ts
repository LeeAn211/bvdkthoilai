import type { GlobalConfig } from 'payload'
import { loggedIn } from '@/access'

export const ContactSettings: GlobalConfig = {
  slug: 'contact-settings', label: 'Liên hệ & Bản đồ', admin: { group: 'Trang chủ & Giao diện' },
  access: { read: loggedIn, update: loggedIn }, versions: { max: 20 },
  fields: [
    { name: 'address', label: 'Địa chỉ', type: 'textarea' },
    { name: 'hotline', label: 'Hotline', type: 'text' },
    { name: 'emergencyHotline', label: 'Hotline cấp cứu', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'workingHours', label: 'Giờ làm việc', type: 'text', admin: { description: 'Hiển thị trực tiếp trên thanh thông tin đầu website, ví dụ: Thứ 2 – Thứ 6: 07:00 – 17:00.' } },
    { name: 'googleMapsUrl', label: 'Liên kết Google Maps / Chỉ đường', type: 'text' },
    { name: 'googleMapsEmbed', label: 'URL hoặc iframe nhúng Google Maps', type: 'textarea' },
  ],
}
