import type { GlobalConfig } from 'payload'
import { admins } from '@/access'

export const InpatientGuideSettings: GlobalConfig = {
  slug: 'inpatient-guide-settings',
  label: 'Trang Hướng dẫn điều trị nội trú',
  admin: {
    group: '🏥 Khám bệnh & Dịch vụ Y tế',
    description: 'Tùy chỉnh tiêu đề, mô tả, thông báo, các bước nhập viện, đồ dùng cần mang, giờ thăm bệnh và chế độ dinh dưỡng trên trang /dieu-tri-noi-tru.',
  },
  access: { read: () => true, update: admins },
  fields: [
    { name: 'eyebrow', label: 'Nhãn nhỏ (Eyebrow)', type: 'text', defaultValue: 'HƯỚNG DẪN DÀNH CHO NGƯỜI BỆNH' },
    { name: 'title', label: 'Tiêu đề trang', type: 'text', defaultValue: 'Hướng dẫn Điều trị Nội trú' },
    { name: 'description', label: 'Mô tả trang', type: 'textarea', defaultValue: 'Thông tin chi tiết về thủ tục nhập viện, đồ dùng cần chuẩn bị, quy định buồng bệnh, giờ thăm bệnh và chế độ dinh dưỡng tại Bệnh viện Đa khoa Khu vực Thới Lai.' },
    { name: 'showNoticeBanner', label: 'Bật thông báo lưu ý đầu trang', type: 'checkbox', defaultValue: true },
    { name: 'noticeTitle', label: 'Tiêu đề thông báo lưu ý', type: 'text', defaultValue: 'Nội quy buồng bệnh và an toàn người bệnh' },
    { name: 'noticeContent', label: 'Nội dung thông báo (Hỗ trợ Enter xuống dòng)', type: 'textarea', defaultValue: '• Mỗi người bệnh được tối đa 01 người thân ở lại chăm sóc và phải đeo thẻ nuôi bệnh.\n• Giữ gìn trật tự chung, tuyệt đối không hút thuốc lá trong khuôn viên bệnh viện.\n• Bệnh viện phục vụ chế độ ăn bệnh lý đạt chuẩn an toàn vệ sinh thực phẩm.' },
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
      name: 'admissionSteps',
      label: 'Quy trình các bước nhập viện',
      type: 'array',
      labels: { singular: 'Bước nhập viện', plural: 'Các bước nhập viện' },
      fields: [
        { name: 'enabled', label: 'Bật bước này', type: 'checkbox', defaultValue: true },
        { name: 'step', label: 'Số thứ tự', type: 'number', required: true },
        { name: 'title', label: 'Tiêu đề bước', type: 'text', required: true },
        { name: 'location', label: 'Địa điểm / Phòng ban', type: 'text', required: true },
        { name: 'desc', label: 'Nội dung hướng dẫn chi tiết', type: 'textarea', required: true },
        { name: 'note', label: 'Lưu ý cần nhớ (nếu có)', type: 'text' },
      ],
    },
    {
      name: 'visitingHours',
      label: 'Khung giờ thăm bệnh thân nhân',
      type: 'array',
      labels: { singular: 'Khung giờ thăm', plural: 'Các khung giờ thăm' },
      fields: [
        { name: 'enabled', label: 'Bật khung giờ này', type: 'checkbox', defaultValue: true },
        { name: 'session', label: 'Buổi thăm (Sáng/Trưa/Chiều tối)', type: 'text', required: true },
        { name: 'timeRange', label: 'Khung giờ (Ví dụ: 06:00 - 07:00)', type: 'text', required: true },
        { name: 'note', label: 'Ghi chú thêm', type: 'text' },
      ],
    },
    {
      name: 'belongingsChecklist',
      label: 'Danh mục đồ dùng cần mang theo & BV cấp phát',
      type: 'array',
      labels: { singular: 'Mục đồ dùng', plural: 'Các mục đồ dùng' },
      fields: [
        { name: 'enabled', label: 'Bật mục này', type: 'checkbox', defaultValue: true },
        { name: 'icon', label: 'Biểu tượng (Icon / Emoji)', type: 'text', defaultValue: '🎒' },
        { name: 'category', label: 'Phân loại (Người bệnh mang theo / BV cung cấp)', type: 'text', required: true },
        { name: 'title', label: 'Tên vật dụng / Giấy tờ', type: 'text', required: true },
        { name: 'desc', label: 'Chi tiết hướng dẫn', type: 'textarea', required: true },
      ],
    },
    {
      name: 'contentBlock',
      label: 'Bài viết chi tiết & Hướng dẫn chuyên sâu (RichText)',
      type: 'group',
      fields: [
        { name: 'enabled', label: 'Bật hiển thị khối bài viết này', type: 'checkbox', defaultValue: true },
        { name: 'title', label: 'Tiêu đề bài viết', type: 'text', defaultValue: 'Quy chế Quản lý & Chế độ Chăm sóc Toàn diện Người bệnh Nội trú' },
        { name: 'subtitle', label: 'Mô tả ngắn gọn / Phụ đề bài viết', type: 'textarea', defaultValue: 'Các quy định chi tiết về buồng bệnh vô trùng, an toàn dùng thuốc, quyền lợi khám chữa bệnh BHYT và nghĩa vụ của người bệnh khi nằm viện tại Bệnh viện Đa khoa Khu vực Thới Lai.' },
        { name: 'content', label: 'Nội dung bài viết chi tiết (Hỗ trợ định dạng, hình ảnh, bảng biểu)', type: 'richText' },
        {
          name: 'textAlign',
          label: 'Canh lề nội dung',
          type: 'select',
          defaultValue: 'left',
          options: [
            { label: 'Canh trái (Mặc định)', value: 'left' },
            { label: 'Canh giữa', value: 'center' },
            { label: 'Canh đều 2 bên (Justify)', value: 'justify' },
          ],
        },
      ],
    },
    {
      name: 'customBlocks',
      label: 'Các khối nội dung tùy biến thêm mới (Không giới hạn)',
      type: 'array',
      dbName: 'igs_custom_blocks',
      labels: { singular: 'Khối nội dung tùy biến', plural: 'Các khối nội dung tùy biến' },
      fields: [
        { name: 'enabled', label: 'Bật hiển thị khối này', type: 'checkbox', defaultValue: true },
        { name: 'kicker', label: 'Nhãn nhỏ phía trên (Kicker)', type: 'text', admin: { placeholder: 'VÍ DỤ: LƯU Ý ĐẶC BIỆT HOẶC CHUYÊN ĐỀ' } },
        { name: 'title', label: 'Tiêu đề khối', type: 'text', required: true },
        { name: 'subtitle', label: 'Mô tả ngắn', type: 'textarea' },
        { name: 'content', label: 'Nội dung chi tiết (RichText)', type: 'richText' },
        {
          name: 'textAlign',
          label: 'Canh lề khối',
          type: 'select',
          defaultValue: 'left',
          options: [
            { label: 'Canh trái (Mặc định)', value: 'left' },
            { label: 'Canh giữa', value: 'center' },
            { label: 'Canh đều 2 bên (Justify)', value: 'justify' },
          ],
        },
      ],
    },
  ],
}
