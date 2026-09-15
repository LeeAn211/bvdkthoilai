import type { GlobalConfig } from 'payload'
import { moduleAccess } from '@/access'

export const ContactSettings: GlobalConfig = {
  slug: 'contact-settings',
  label: 'Liên hệ & Bản đồ',
  admin: {
    group: '🌐 Trang chủ & Giao diện Website',
    description: 'Quản lý thông tin liên hệ, hotline, cấp cứu, địa chỉ, bản đồ Google Maps và giao diện trang /lien-he.',
  },
  access: { read: () => true, update: moduleAccess('site-settings', 'edit') },
  versions: { max: 20 },
  fields: [
    // ── 1. BANNER HERO ĐẦU TRANG ──
    {
      name: 'hero',
      label: '1. Banner đầu trang Liên hệ',
      type: 'group',
      fields: [
        { name: 'eyebrow', label: 'Nhãn nhỏ (Eyebrow)', type: 'text', defaultValue: 'KẾT NỐI VỚI CHÚNG TÔI' },
        { name: 'title', label: 'Tiêu đề trang', type: 'text', defaultValue: 'Liên hệ & Tiếp nhận Thông tin', required: true },
        {
          name: 'description',
          label: 'Mô tả ngắn',
          type: 'textarea',
          defaultValue: 'Bệnh viện Đa khoa Khu vực Thới Lai luôn sẵn sàng lắng nghe, tư vấn khám chữa bệnh và tiếp nhận mọi ý kiến đóng góp từ Quý người bệnh và thân nhân.',
        },
      ],
    },

    // ── 2. BẢNG THÔNG BÁO / LƯU Ý ──
    {
      name: 'notice',
      label: '2. Bảng thông báo / Lưu ý quan trọng',
      type: 'group',
      fields: [
        { name: 'enabled', label: 'Bật thông báo lưu ý', type: 'checkbox', defaultValue: false },
        { name: 'title', label: 'Tiêu đề thông báo', type: 'text', defaultValue: 'Kênh tiếp nhận cấp cứu và phản ánh 24/7' },
        {
          name: 'content',
          label: 'Nội dung thông báo (Hỗ trợ Enter xuống dòng)',
          type: 'textarea',
          defaultValue: '• Trường hợp cấp cứu khẩn cấp, vui lòng gọi ngay đường dây nóng Cấp cứu: 0292 3861 115 phục vụ 24/24.\n• Mọi ý kiến phản ánh, đóng góp chất lượng dịch vụ sẽ được Ban Giám đốc tiếp nhận và giải quyết kịp thời.',
        },
        {
          name: 'textAlign',
          label: 'Canh lề thông báo',
          type: 'select',
          dbName: 'ct_not_align',
          defaultValue: 'left',
          options: [
            { label: 'Canh trái (Mặc định)', value: 'left' },
            { label: 'Canh giữa', value: 'center' },
            { label: 'Canh đều 2 bên (Justify)', value: 'justify' },
          ],
        },
      ],
    },

    // ── 3. THÔNG TIN LIÊN HỆ CỐT LÕI ──
    {
      name: 'coreInfo',
      label: '3. Thông tin liên hệ cơ bản',
      type: 'group',
      fields: [
        { name: 'address', label: 'Địa chỉ bệnh viện', type: 'textarea', defaultValue: 'Ấp Thới Phong, Xã Thới Lai, Thành phố Cần Thơ' },
        { name: 'hotline', label: 'Hotline tư vấn / Tổng đài', type: 'text', defaultValue: '0292 3861 234' },
        { name: 'emergencyHotline', label: 'Hotline Cấp cứu 24/24', type: 'text', defaultValue: '0292 3861 115' },
        { name: 'email', label: 'Hòm thư điện tử (Email)', type: 'email', defaultValue: 'bvdkthoilai@cantho.gov.vn' },
        { name: 'workingHours', label: 'Thời gian khám bệnh ngoại trú', type: 'text', defaultValue: 'Thứ 2 – Thứ 7: Sáng 06:30 – 11:30 | Chiều 13:00 – 17:00 (Cấp cứu trực 24/24)' },
        { name: 'googleMapsUrl', label: 'Đường dẫn mở Google Maps trực tiếp (Nút Chỉ đường)', type: 'text', defaultValue: 'https://maps.google.com' },
        { name: 'googleMapsEmbed', label: 'URL hoặc iframe nhúng Google Maps', type: 'textarea' },
      ],
    },

    // ── 4. CÔNG TẮC BẬT/TẮT TỪNG KHỐI TRÊN TRANG ──
    {
      name: 'displayToggles',
      label: '4. Bật/tắt các khối nội dung trên trang',
      type: 'group',
      fields: [
        { name: 'showContactCards', label: 'Hiển thị 4 thẻ thông tin liên hệ nhanh', type: 'checkbox', defaultValue: true },
        { name: 'showMap', label: 'Hiển thị bản đồ Google Maps', type: 'checkbox', defaultValue: true },
        { name: 'showFeedbackForm', label: 'Hiển thị form gửi ý kiến phản ánh / góp ý', type: 'checkbox', defaultValue: true },
        { name: 'showSupportHours', label: 'Hiển thị khối khung giờ hỗ trợ chuyên khoa', type: 'checkbox', defaultValue: true },
        { name: 'showSocialLinks', label: 'Hiển thị các kênh mạng xã hội kết nối', type: 'checkbox', defaultValue: true },
      ],
    },

    // Backward-compatibility fields cho các module cũ đọc trực tiếp root
    { name: 'address', label: 'Địa chỉ (cũ)', type: 'textarea', admin: { hidden: true } },
    { name: 'hotline', label: 'Hotline (cũ)', type: 'text', admin: { hidden: true } },
    { name: 'emergencyHotline', label: 'Hotline cấp cứu (cũ)', type: 'text', admin: { hidden: true } },
    { name: 'email', label: 'Email (cũ)', type: 'email', admin: { hidden: true } },
    { name: 'workingHours', label: 'Giờ làm việc (cũ)', type: 'text', admin: { hidden: true } },
    { name: 'googleMapsUrl', label: 'Liên kết Google Maps (cũ)', type: 'text', admin: { hidden: true } },
    { name: 'googleMapsEmbed', label: 'Mã nhúng Google Maps (cũ)', type: 'textarea', admin: { hidden: true } },
  ],
}
