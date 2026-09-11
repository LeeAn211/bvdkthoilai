import type { GlobalConfig } from 'payload'
import { loggedIn } from '@/access'

const colorField = (name: string, label: string, defaultValue?: string) => ({
  name,
  label,
  type: 'text' as const,
  defaultValue,
  admin: { placeholder: '#FFFFFF hoặc linear-gradient(...)' },
})

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header & Nhận diện',
  admin: { group: 'Trang chủ & Giao diện' },
  access: { read: loggedIn, update: loggedIn },
  versions: { max: 30 },
  fields: [
    { name: 'enabled', label: 'Hiển thị Header', type: 'checkbox', defaultValue: true },
    { name: 'logo', label: 'Logo', type: 'upload', relationTo: 'media' },
    { name: 'hospitalName', label: 'Tên bệnh viện', type: 'text', defaultValue: 'BỆNH VIỆN ĐA KHOA KHU VỰC THỚI LAI' },
    { name: 'slogan', label: 'Slogan', type: 'text', defaultValue: 'Tận tâm - Chất lượng - An toàn' },
    { name: 'showSlogan', label: 'Hiển thị slogan', type: 'checkbox', defaultValue: true },
    { name: 'showUtilityBar', label: 'Hiển thị thanh phía trên', type: 'checkbox', defaultValue: true },
    { name: 'showSearch', label: 'Hiển thị tìm kiếm', type: 'checkbox', defaultValue: true },
    { name: 'showHotline', label: 'Hiển thị khối liên hệ nhanh', type: 'checkbox', defaultValue: true },
    { name: 'stickyMenu', label: 'Menu bám đầu trang', type: 'checkbox', defaultValue: true },

    {
      name: 'utilityAppearance',
      label: 'Thanh thời gian phía trên',
      type: 'group',
      fields: [
        { name: 'timePrefix', label: 'Chữ trước thời gian', type: 'text', defaultValue: '' },
        { name: 'showCalendarIcon', label: 'Hiển thị icon lịch/đồng hồ', type: 'checkbox', defaultValue: true },
        colorField('background', 'Nền thanh trên', 'linear-gradient(90deg,#064a83,#0878d1)'),
        colorField('timeBackground', 'Nền ô thời gian', 'rgba(255,255,255,.14)'),
        colorField('timeColor', 'Màu chữ thời gian', '#ffffff'),
        { name: 'timeFontSize', label: 'Cỡ chữ thời gian (px)', type: 'number', min: 10, max: 22, defaultValue: 13 },
        { name: 'timeFontWeight', label: 'Độ đậm thời gian', type: 'select', defaultValue: '800', options: [
          { label: 'Vừa (600)', value: '600' },
          { label: 'Đậm (700)', value: '700' },
          { label: 'Rất đậm (800)', value: '800' },
          { label: 'Nổi bật (900)', value: '900' },
        ] },
      ],
    },

    {
      name: 'contactCards',
      label: 'Các ô liên hệ nhanh',
      type: 'array',
      minRows: 0,
      maxRows: 4,
      labels: { singular: 'Ô liên hệ', plural: 'Các ô liên hệ' },
      admin: {
        description: 'Nếu chưa tạo ô nào, hệ thống vẫn dùng 2 ô Cấp cứu và Tổng đài hiện tại để không làm mất giao diện cũ.',
      },
      fields: [
        { name: 'visible', label: 'Hiển thị', type: 'checkbox', defaultValue: true },
        { name: 'title', label: 'Tiêu đề', type: 'text', required: true, defaultValue: 'TỔNG ĐÀI HỖ TRỢ' },
        { name: 'text', label: 'Nội dung / Số điện thoại', type: 'text', required: true },
        { name: 'href', label: 'Liên kết khi bấm', type: 'text', admin: { placeholder: 'tel:02923689115 hoặc https://...' } },
        { name: 'extraText', label: 'Dòng chữ bổ sung', type: 'text', admin: { placeholder: 'Ví dụ: Hỗ trợ 24/7' } },
        { name: 'iconType', label: 'Icon', type: 'select', defaultValue: 'phone', options: [
          { label: 'Điện thoại', value: 'phone' },
          { label: 'Cấp cứu / Y tế', value: 'emergency' },
          { label: 'Tai nghe hỗ trợ', value: 'headset' },
          { label: 'Lịch', value: 'calendar' },
          { label: 'Trái tim y tế', value: 'heart' },
          { label: 'Thông tin', value: 'info' },
          { label: 'Icon ảnh tùy chỉnh', value: 'custom' },
        ] },
        { name: 'customIcon', label: 'Ảnh icon tùy chỉnh', type: 'upload', relationTo: 'media', admin: { condition: (_data, siblingData) => siblingData?.iconType === 'custom' } },
        colorField('background', 'Màu / nền ô', '#ffffff'),
        colorField('borderColor', 'Màu viền', '#e1e7ec'),
        colorField('titleColor', 'Màu tiêu đề', '#273b4c'),
        colorField('textColor', 'Màu nội dung / số điện thoại', '#0756b4'),
        colorField('extraTextColor', 'Màu dòng bổ sung', '#557082'),
        colorField('iconColor', 'Màu icon', '#075ec2'),
        colorField('iconBackground', 'Nền icon', '#eaf5ff'),
        { name: 'titleFontSize', label: 'Cỡ tiêu đề (px)', type: 'number', min: 8, max: 24, defaultValue: 10 },
        { name: 'textFontSize', label: 'Cỡ nội dung / SĐT (px)', type: 'number', min: 10, max: 34, defaultValue: 17 },
        { name: 'fontWeight', label: 'Độ đậm nội dung', type: 'select', defaultValue: '800', options: [
          { label: 'Vừa (600)', value: '600' }, { label: 'Đậm (700)', value: '700' },
          { label: 'Rất đậm (800)', value: '800' }, { label: 'Nổi bật (900)', value: '900' },
        ] },
      ],
    },
  ],
}
