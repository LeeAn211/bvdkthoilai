import type { GlobalConfig } from 'payload'
import { admins } from '@/access'

export const HospitalQualitySettings: GlobalConfig = {
  slug: 'hospital-quality-settings',
  label: 'Trang Chất lượng bệnh viện',
  admin: {
    group: '💬 Chăm sóc người bệnh & Khảo sát',
    description: 'Tùy chỉnh tiêu đề, mô tả, thông báo lưu ý và cấu hình hiển thị 83 tiêu chí, điểm chất lượng trên trang /chat-luong-benh-vien.',
  },
  access: { read: () => true, update: admins },
  fields: [
    { name: 'eyebrow', label: 'Nhãn nhỏ (Eyebrow)', type: 'text', defaultValue: 'QUẢN LÝ CHẤT LƯỢNG & AN TOÀN NGƯỜI BỆNH' },
    { name: 'title', label: 'Tiêu đề trang', type: 'text', defaultValue: 'Chất lượng Bệnh viện' },
    { name: 'description', label: 'Mô tả trang', type: 'textarea', defaultValue: 'Bộ chỉ số đo lường 83 tiêu chí chất lượng, kết quả khảo sát sự hài lòng và các chương trình cải tiến liên tục tại Bệnh viện Đa khoa Khu vực Thới Lai.' },
    {
      name: 'showNoticeBanner',
      label: 'Bật thông báo lưu ý đầu trang',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'noticeTitle',
      label: 'Tiêu đề thông báo lưu ý',
      type: 'text',
      defaultValue: 'Cam kết chất lượng phục vụ của Bệnh viện Đa khoa Khu vực Thới Lai',
    },
    {
      name: 'noticeContent',
      label: 'Nội dung thông báo (Hỗ trợ Enter xuống dòng)',
      type: 'textarea',
      defaultValue: '• Lấy người bệnh làm trung tâm phục vụ, đảm bảo an toàn và quyền lợi người bệnh.\n• Đánh giá chất lượng định kỳ theo Bộ 83 Tiêu chí của Bộ Y tế.\n• Mọi ý kiến đóng góp được Ban Giám đốc tiếp nhận và cải tiến liên tục.',
    },
    {
      name: 'noticeAlign',
      label: 'Canh lề bảng lưu ý',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Canh trái (Mặc định)', value: 'left' },
        { label: 'Canh giữa', value: 'center' },
        { label: 'Canh đều 2 bên (Justify)', value: 'justify' },
      ],
    },
    {
      name: 'showQualityCards',
      label: 'Hiển thị các chỉ số chất lượng chính',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showDimensions',
      label: 'Hiển thị 5 nhóm tiêu chuẩn Bộ Y tế',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showPrograms',
      label: 'Hiển thị các chương trình cải tiến',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showFeedbackBox',
      label: 'Hiển thị khối khảo sát & tiếp nhận ý kiến',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'statCards',
      label: '4 Thẻ chỉ số chất lượng chính đầu trang',
      type: 'array',
      labels: { singular: 'Thẻ chỉ số', plural: 'Các thẻ chỉ số' },
      admin: { description: 'Tùy chỉnh số liệu, đơn vị và nhãn của 4 thẻ thống kê chất lượng.' },
      fields: [
        { name: 'enabled', label: 'Bật thẻ này', type: 'checkbox', defaultValue: true },
        { name: 'val', label: 'Giá trị số (VD: 4.22, 94.8, 83, 100)', type: 'text', required: true },
        { name: 'unit', label: 'Đơn vị (VD: / 5.0, %, tiêu chí)', type: 'text' },
        { name: 'label', label: 'Nhãn mô tả chỉ số', type: 'text', required: true },
      ],
    },
    {
      name: 'dimensions',
      label: '5 Nhóm tiêu chuẩn Bộ 83 Tiêu chí Bộ Y tế',
      type: 'array',
      labels: { singular: 'Nhóm tiêu chuẩn', plural: 'Các nhóm tiêu chuẩn' },
      admin: { description: 'Chỉnh sửa điểm số, tỷ lệ % và mô tả từng phần tiêu chuẩn (Phần A -> E).' },
      fields: [
        { name: 'enabled', label: 'Bật nhóm này', type: 'checkbox', defaultValue: true },
        { name: 'code', label: 'Mã phần (VD: PHẦN A, PHẦN B...)', type: 'text', required: true },
        { name: 'title', label: 'Tên nhóm tiêu chuẩn', type: 'text', required: true },
        { name: 'desc', label: 'Mô tả nội dung tiêu chuẩn', type: 'textarea', required: true },
        { name: 'score', label: 'Điểm đánh giá (VD: 4.25 / 5.00)', type: 'text', required: true },
        { name: 'percent', label: 'Tỷ lệ % tiến độ thanh đo (VD: 85, 83.6...)', type: 'number', required: true },
      ],
    },
    {
      name: 'programs',
      label: 'Các chương trình cải tiến chất lượng trọng điểm',
      type: 'array',
      labels: { singular: 'Chương trình cải tiến', plural: 'Các chương trình cải tiến' },
      admin: { description: 'Chỉnh sửa biểu tượng, tiêu đề, mô tả và các gạch đầu dòng điểm nổi bật.' },
      fields: [
        { name: 'enabled', label: 'Bật chương trình này', type: 'checkbox', defaultValue: true },
        {
          name: 'iconType',
          label: 'Kiểu biểu tượng / màu sắc',
          type: 'select',
          defaultValue: 'blue',
          options: [
            { label: 'Xanh dương (Chuyển đổi số)', value: 'blue' },
            { label: 'Xanh lá (An toàn & Khử khuẩn)', value: 'green' },
            { label: 'Hổ phách (Văn hóa giao tiếp)', value: 'amber' },
          ],
        },
        { name: 'title', label: 'Tên chương trình cải tiến', type: 'text', required: true },
        { name: 'desc', label: 'Mô tả chi tiết chương trình', type: 'textarea', required: true },
        { name: 'highlights', label: 'Điểm nổi bật (Mỗi dòng 1 gạch đầu dòng, nhấn Enter để xuống dòng)', type: 'textarea' },
      ],
    },
  ],
}
