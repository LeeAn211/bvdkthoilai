import type { GlobalConfig } from 'payload'
import { loggedIn, moduleAccess } from '@/access'
export const MedproSettings: GlobalConfig = {
  slug: 'medpro-settings', label: 'Điều hướng Đặt lịch khám', admin: { group: '🏥 Khám bệnh & Dịch vụ Y tế', description: 'Chọn dùng Medpro hoặc chuyển toàn bộ nút đặt lịch chính sang form đăng ký tại cơ sở.' }, access: { read: loggedIn, update: moduleAccess('appointments', 'edit') }, versions: { max: 20 },
  fields: [
    { name: 'enabled', label: 'Hiển thị các nút Đặt lịch khám', type: 'checkbox', defaultValue: true },
    { name: 'useFacilityBooking', label: 'Chuyển sang Đặt lịch khám tại cơ sở', type: 'checkbox', defaultValue: false, admin: { description: 'Bật khi bệnh viện muốn nhận phiếu đăng ký trực tiếp trên website. Tắt để tiếp tục điều hướng sang Medpro.' } },
    { name: 'url', label: 'Liên kết đặt khám Medpro', type: 'text' },
    { name: 'facilityUrl', label: 'Đường dẫn đặt lịch tại cơ sở', type: 'text', defaultValue: '/dat-lich-kham', admin: { condition: (data) => data?.useFacilityBooking === true } },
    { name: 'label', label: 'Tên nút', type: 'text', defaultValue: 'Đặt lịch khám' },
    { name: 'openNewTab', label: 'Mở tab mới', type: 'checkbox', defaultValue: true },
  ],
}
