import type { CollectionConfig } from 'payload'
import { moduleAccess, publicActive } from '@/access'

export const Schedules: CollectionConfig = {
  slug: 'schedules',
  labels: { singular: 'Lịch khám', plural: 'Lịch khám' },
  admin: {
    useAsTitle: 'title',
    group: 'Khám bệnh',
    description: 'Ưu tiên đăng ảnh lịch khám tuần chính thức. Vẫn hỗ trợ nhập theo ngày/tuần để tra cứu chi tiết.',
  },
  access: { read: publicActive, create: moduleAccess('schedules', 'create'), update: moduleAccess('schedules', 'edit'), delete: moduleAccess('schedules', 'delete') },
  fields: [
    { name: 'title', label: 'Tên lịch', type: 'text', required: true, defaultValue: 'Lịch khám bác sĩ' },
    { name: 'summary', label: 'Mô tả ngắn', type: 'textarea', maxLength: 300, admin: { description: 'Hiển thị ở thẻ danh sách trước khi người xem bấm Xem chi tiết.' } },
    { name: 'coverImage', label: 'Ảnh đại diện', type: 'upload', relationTo: 'media', admin: { description: 'Không bắt buộc. Nếu bỏ trống website dùng ảnh mặc định Lịch khám trong Admin → Ảnh mặc định nội dung.' } },
    { name: 'detailContent', label: 'Nội dung chi tiết', type: 'richText', admin: { description: 'Nội dung chỉ hiển thị trong trang chi tiết của lịch.' } },
    {
      name: 'mode', label: 'Hình thức đăng lịch', type: 'select', required: true, defaultValue: 'attachment',
      options: [
        { label: 'Nhập từng lịch theo ngày', value: 'daily' },
        { label: 'Lập lịch theo tuần', value: 'weekly' },
        { label: 'Ảnh lịch tuần / tệp đính kèm (khuyến nghị)', value: 'attachment' },
      ],
    },
    { name: 'doctor', label: 'Chọn bác sĩ', type: 'relationship', relationTo: 'doctors', admin: { condition: (_data, siblingData) => !siblingData?.mode || siblingData?.mode === 'daily' } },
    { name: 'department', label: 'Chọn Khoa / Phòng', type: 'relationship', relationTo: 'departments', admin: { condition: (_data, siblingData) => !siblingData?.mode || siblingData?.mode === 'daily' } },
    { name: 'date', label: 'Ngày khám', type: 'date', index: true, admin: { condition: (_data, siblingData) => !siblingData?.mode || siblingData?.mode === 'daily', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } } },
    { name: 'startTime', label: 'Giờ bắt đầu', type: 'text', admin: { condition: (_data, siblingData) => !siblingData?.mode || siblingData?.mode === 'daily', placeholder: '07:00' } },
    { name: 'endTime', label: 'Giờ kết thúc', type: 'text', admin: { condition: (_data, siblingData) => !siblingData?.mode || siblingData?.mode === 'daily', placeholder: '11:00' } },
    { name: 'room', label: 'Phòng khám', type: 'text', admin: { condition: (_data, siblingData) => !siblingData?.mode || siblingData?.mode === 'daily' } },
    {
      type: 'row',
      fields: [
        { name: 'weekStart', label: 'Tuần từ ngày', type: 'date', admin: { condition: (_data, siblingData) => siblingData?.mode === 'weekly', width: '50%', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } } },
        { name: 'weekEnd', label: 'Đến ngày', type: 'date', admin: { condition: (_data, siblingData) => siblingData?.mode === 'weekly', width: '50%', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } } },
      ],
    },
    {
      name: 'weeklySlots', label: 'Các buổi khám trong tuần', type: 'array',
      admin: { condition: (_data, siblingData) => siblingData?.mode === 'weekly', description: 'Bấm Thêm để chọn sẵn thứ, bác sĩ, khoa và khung giờ.' },
      fields: [
        { name: 'dayOfWeek', label: 'Thứ', type: 'select', required: true, options: [
          { label: 'Thứ Hai', value: '2' }, { label: 'Thứ Ba', value: '3' }, { label: 'Thứ Tư', value: '4' }, { label: 'Thứ Năm', value: '5' }, { label: 'Thứ Sáu', value: '6' }, { label: 'Thứ Bảy', value: '7' }, { label: 'Chủ Nhật', value: '8' },
        ] },
        { name: 'doctor', label: 'Bác sĩ', type: 'relationship', relationTo: 'doctors', required: true },
        { name: 'department', label: 'Khoa / Phòng', type: 'relationship', relationTo: 'departments', required: true },
        { type: 'row', fields: [
          { name: 'startTime', label: 'Từ giờ', type: 'text', required: true, admin: { width: '33%', placeholder: '07:00' } },
          { name: 'endTime', label: 'Đến giờ', type: 'text', required: true, admin: { width: '33%', placeholder: '11:00' } },
          { name: 'room', label: 'Phòng khám', type: 'text', admin: { width: '34%' } },
        ] },
        { name: 'note', label: 'Ghi chú buổi khám', type: 'text' },
      ],
    },
    { name: 'scheduleType', label: 'Tính chất lịch', type: 'select', defaultValue: 'official', options: [{ label: 'Lịch chính thức', value: 'official' }, { label: 'Điều chỉnh / bổ sung', value: 'adjustment' }], admin: { condition: (_data, siblingData) => siblingData?.mode === 'attachment' } },
    { name: 'scheduleImage', label: 'Ảnh lịch khám tuần (ưu tiên)', type: 'upload', relationTo: 'media', admin: { condition: (_data, siblingData) => siblingData?.mode === 'attachment', description: 'Tải ảnh JPG/PNG mới hoặc chọn lại ảnh lịch đã có trong thư viện.' } },
    { name: 'scheduleFile', label: 'Tệp lịch khám', type: 'upload', relationTo: 'media', admin: { condition: (_data, siblingData) => siblingData?.mode === 'attachment', description: 'Tải Excel/PDF/Word mới hoặc chọn lại tệp lịch đã có trong thư viện.' } },
    { name: 'attachmentFiles', label: 'Tệp đính kèm bổ sung', type: 'array', admin: { condition: (_data, siblingData) => siblingData?.mode === 'attachment' }, fields: [{ name: 'file', label: 'Tệp', type: 'upload', relationTo: 'media', required: true }, { name: 'label', label: 'Tên hiển thị', type: 'text' }] },
    { name: 'validFrom', label: 'Hiệu lực từ ngày', type: 'date', admin: { condition: (_data, siblingData) => siblingData?.mode === 'attachment', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } } },
    { name: 'validTo', label: 'Hiệu lực đến ngày', type: 'date', admin: { condition: (_data, siblingData) => siblingData?.mode === 'attachment', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } } },
    { name: 'note', label: 'Ghi chú chung', type: 'textarea' },
    { name: 'active', label: 'Đang áp dụng', type: 'checkbox', defaultValue: true }
  ]
}
