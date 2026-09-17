import type { GlobalConfig } from 'payload'
import { admins } from '@/access'

export const CheckupPackagesSettings: GlobalConfig = {
  slug: 'checkup-packages-settings',
  label: 'Trang Gói khám sức khỏe',
  admin: {
    group: '🏥 Khám bệnh & Dịch vụ Y tế',
    description: 'Tùy chỉnh tiêu đề, mô tả, thông báo và danh sách các gói khám sức khỏe trên trang /goi-kham.',
  },
  access: { read: () => true, update: admins },
  fields: [
    { name: 'eyebrow', label: 'Nhãn nhỏ (Eyebrow)', type: 'text', defaultValue: 'CHỦ ĐỘNG BẢO VỆ SỨC KHỎE' },
    { name: 'title', label: 'Tiêu đề trang', type: 'text', defaultValue: 'Gói Khám Sức khỏe & Tầm soát Bệnh lý' },
    { name: 'description', label: 'Mô tả trang', type: 'textarea', defaultValue: 'Các gói khám sức khỏe tổng quát, tầm soát bệnh lý mạn tính và khám cấp giấy chứng nhận sức khỏe với chi phí minh bạch, chuẩn y tế tại Bệnh viện Đa khoa Khu vực Thới Lai.' },
    { name: 'showNoticeBanner', label: 'Bật thông báo lưu ý đầu trang', type: 'checkbox', defaultValue: true },
    { name: 'noticeTitle', label: 'Tiêu đề lưu ý trước khi khám', type: 'text', defaultValue: 'Lưu ý quan trọng trước khi đi khám sức khỏe' },
    { name: 'noticeContent', label: 'Nội dung lưu ý (Hỗ trợ Enter xuống dòng)', type: 'textarea', defaultValue: '• Nhịn ăn sáng từ 8 - 10 tiếng nếu gói khám có xét nghiệm đường huyết, mỡ máu.\n• Uống nhiều nước lọc và nhịn tiểu trước khi làm siêu âm ổ bụng.\n• Không sử dụng rượu bia, chất kích thích 24 giờ trước khi khám.' },
    {
      name: 'noticeAlign',
      label: 'Canh lề thông báo',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Canh trái (Mặc định)', value: 'left' },
        { label: 'Canh giữa', value: 'center' },
        { label: 'Canh đều 2 bên (Justify)', value: 'justify' },
      ],
    },
    {
      name: 'packages',
      label: 'Danh sách các gói khám sức khỏe',
      type: 'array',
      labels: { singular: 'Gói khám', plural: 'Các gói khám' },
      fields: [
        { name: 'enabled', label: 'Bật gói khám này', type: 'checkbox', defaultValue: true },
        { name: 'badge', label: 'Huy hiệu nổi bật (Ví dụ: Phổ biến, Tiết kiệm...)', type: 'text' },
        { name: 'title', label: 'Tên gói khám', type: 'text', required: true },
        { name: 'targetUser', label: 'Đối tượng phù hợp', type: 'text', required: true },
        { name: 'priceText', label: 'Giá niêm yết (Ví dụ: 850.000 đ hoặc Liên hệ)', type: 'text', required: true },
        { name: 'desc', label: 'Mô tả tóm tắt gói khám', type: 'textarea', required: true },
        { name: 'features', label: 'Danh mục kỹ thuật trong gói (Mỗi dòng 1 mục - Hỗ trợ Enter)', type: 'textarea', required: true },
        { name: 'buttonText', label: 'Chữ trên nút', type: 'text', defaultValue: 'Đăng ký gói khám' },
        { name: 'buttonLink', label: 'Đường dẫn nút (URL)', type: 'text', defaultValue: '/dat-lich-kham' },
      ],
    },
  ],
}
