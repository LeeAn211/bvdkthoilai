import type { GlobalConfig } from 'payload'
import { moduleAccess } from '@/access'

export const ScheduleSettings: GlobalConfig = {
  slug: 'schedule-settings',
  label: 'Cấu hình lịch khám / tiêm',
  admin: { group: '🏥 Khám bệnh & Dịch vụ Y tế', description: 'Cấu hình hiển thị chung cho lịch khám và lịch tiêm chủng.' },
  access: { read: () => true, update: moduleAccess('schedules', 'edit') },
  fields: [
    // ── 1. BANNER HERO ĐẦU TRANG LỊCH KHÁM ──
    {
      name: 'hero',
      label: '1. Banner đầu trang Lịch khám',
      type: 'group',
      fields: [
        { name: 'eyebrow', label: 'Nhãn nhỏ (Eyebrow)', type: 'text', defaultValue: 'KHÁM CHỮA BỆNH & TRỰC BỆNH VIỆN' },
        { name: 'title', label: 'Tiêu đề chính', type: 'text', defaultValue: 'Lịch khám & Lịch trực bệnh viện', required: true },
        {
          name: 'titleSize',
          label: 'Cỡ chữ tiêu đề',
          type: 'select',
          defaultValue: 'default',
          options: [
            { label: 'Tiêu chuẩn (32px - 36px)', value: 'default' },
            { label: 'Gọn gàng (28px)', value: 'compact' },
            { label: 'Lớn nổi bật (40px)', value: 'large' },
          ],
        },
        {
          name: 'titleColor',
          label: 'Màu chữ tiêu đề',
          type: 'select',
          defaultValue: 'white',
          options: [
            { label: 'Trắng tinh khiết (Mặc định)', value: 'white' },
            { label: 'Vàng nắng nổi bật (Golden Yellow)', value: 'yellow' },
            { label: 'Xanh ngọc sáng (Teal Glow)', value: 'cyan' },
          ],
        },
        {
          name: 'description',
          label: 'Mô tả hướng dẫn (Hỗ trợ gõ Enter xuống dòng)',
          type: 'textarea',
          defaultValue: 'Tra cứu lịch phân công bác sĩ khám bệnh, lịch trực cấp cứu 24/24 và lịch trực tuần của Bệnh viện Đa khoa Khu vực Thới Lai.',
        },
        {
          name: 'bgType',
          label: 'Kiểu nền Banner',
          type: 'select',
          defaultValue: 'gradient',
          options: [
            { label: 'Dải màu Gradient Y tế (Mặc định)', value: 'gradient' },
            { label: 'Hình ảnh nền tùy chỉnh (Background Image)', value: 'image' },
            { label: 'Màu xanh y tế đơn sắc', value: 'solid' },
          ],
        },
        {
          name: 'bgGradient',
          label: 'Tông màu Gradient',
          type: 'select',
          defaultValue: 'blue-teal',
          options: [
            { label: 'Xanh dương y tế sang Xanh ngọc (Blue - Teal)', value: 'blue-teal' },
            { label: 'Xanh đại dương sâu thẳm (Ocean Navy)', value: 'ocean-navy' },
            { label: 'Xanh ngọc bích sang Xanh lá dịu (Teal - Emerald)', value: 'teal-emerald' },
            { label: 'Xanh hoàng gia trang trọng (Royal Blue)', value: 'royal-blue' },
          ],
        },
        {
          name: 'bgImage',
          label: 'Hình ảnh nền Banner (nếu chọn Hình ảnh)',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'overlayOpacity',
          label: 'Độ tối lớp phủ nền hình ảnh',
          type: 'select',
          defaultValue: 'medium',
          options: [
            { label: 'Vừa phải (55% tối)', value: 'medium' },
            { label: 'Đậm nét (75% tối)', value: 'dark' },
            { label: 'Nhẹ nhàng (35% tối)', value: 'light' },
          ],
        },
      ],
    },

    // ── 2. KHỐI THÔNG BÁO / LƯU Ý TRỰC CẤP CỨU & KHÁM BỆNH ──
    {
      name: 'quickNotice',
      label: '2. Khối thông báo nhanh / Banner cấp cứu trên trang',
      type: 'group',
      fields: [
        { name: 'enabled', label: 'Bật hiển thị thông báo nhanh', type: 'checkbox', defaultValue: true },
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
        { name: 'title', label: 'Tiêu đề thông báo', type: 'text', defaultValue: 'Khoa Cấp cứu tiếp nhận bệnh nhân 24/24 tất cả các ngày trong tuần' },
        {
          name: 'titleColor',
          label: 'Màu chữ tiêu đề',
          type: 'select',
          defaultValue: 'red',
          options: [
            { label: 'Đỏ khẩn cấp (Emergency Red)', value: 'red' },
            { label: 'Xanh dương đậm (Navy)', value: 'navy' },
            { label: 'Xanh lá (Green)', value: 'green' },
          ],
        },
        {
          name: 'content',
          label: 'Nội dung chi tiết (Tự do xuống dòng)',
          type: 'textarea',
          defaultValue: 'Lịch trực cấp cứu và danh sách bác sĩ thường trực 24/7 được cập nhật thường xuyên. Trường hợp khẩn cấp, vui lòng liên hệ ngay đường dây nóng cấp cứu để được hỗ trợ kịp thời.',
        },
        {
          name: 'hotline',
          label: 'Số điện thoại gọi khẩn cấp',
          type: 'text',
          defaultValue: '0292 3686 115',
        },
      ],
    },

    // ── 3. CÁC THẺ LƯU Ý DÀNH CHO NGƯỜI BỆNH ──
    {
      name: 'notesSection',
      label: '3. Khối Lưu ý dành cho người bệnh khi đi khám',
      type: 'group',
      fields: [
        { name: 'enabled', label: 'Hiển thị khối Lưu ý', type: 'checkbox', defaultValue: true },
        { name: 'title', label: 'Tiêu đề khối Lưu ý', type: 'text', defaultValue: 'LƯU Ý QUAN TRỌNG KHI ĐẾN KHÁM BỆNH' },
        {
          name: 'items',
          label: 'Danh sách các dòng lưu ý',
          type: 'array',
          dbName: 'sch_notes',
          labels: { singular: 'Dòng lưu ý', plural: 'Các dòng lưu ý' },
          defaultValue: [
            {
              enabled: true,
              boldPrefix: 'Giờ bắt đầu tiếp nhận:',
              content: 'Bệnh viện bắt đầu phát số và tiếp nhận bệnh nhân từ 06:00 sáng. Bác sĩ bắt đầu khám từ 06:30 tại các khoa chủ lực.',
              textAlign: 'left',
              textColor: 'default',
            },
            {
              enabled: true,
              boldPrefix: 'Giấy tờ cần chuẩn bị:',
              content: 'Mang theo CCCD gắn chip (hoặc ứng dụng VNeID mức 2 tích hợp BHYT), thẻ BHYT giấy, sổ khám bệnh và các đơn thuốc/kết quả xét nghiệm cũ (nếu có).',
              textAlign: 'left',
              textColor: 'default',
            },
            {
              enabled: true,
              boldPrefix: 'Xét nghiệm máu & Nội soi:',
              content: 'Người bệnh cần làm xét nghiệm máu hoặc nội soi tiêu hóa nên nhịn ăn sáng (có thể uống ít nước lọc) để đảm bảo độ chính xác của kết quả.',
              textAlign: 'left',
              textColor: 'default',
            },
          ],
          fields: [
            { name: 'enabled', label: 'Bật hiển thị dòng lưu ý này', type: 'checkbox', defaultValue: true },
            { name: 'boldPrefix', label: 'Tiêu đề in đậm đầu dòng', type: 'text' },
            { name: 'content', label: 'Nội dung chi tiết (Tự do xuống dòng)', type: 'textarea', required: true },
            {
              name: 'textAlign',
              label: 'Canh lề dòng lưu ý',
              type: 'select',
              dbName: 'sch_n_align',
              defaultValue: 'left',
              options: [
                { label: 'Canh trái (Mặc định)', value: 'left' },
                { label: 'Canh đều 2 bên (Justify)', value: 'justify' },
              ],
            },
            {
              name: 'textColor',
              label: 'Màu chữ',
              type: 'select',
              dbName: 'sch_n_tcolor',
              defaultValue: 'default',
              options: [
                { label: 'Mặc định (Xám đậm chuẩn)', value: 'default' },
                { label: 'Đen đậm rõ nét', value: 'black' },
                { label: 'Xanh dương đậm (Navy)', value: 'navy' },
                { label: 'Đỏ lưu ý đặc biệt', value: 'red' },
              ],
            },
            {
              name: 'textSize',
              label: 'Cỡ chữ',
              type: 'select',
              dbName: 'sch_n_tsize',
              defaultValue: 'normal',
              options: [
                { label: 'Tiêu chuẩn (14px)', value: 'normal' },
                { label: 'Lớn dễ đọc (16px)', value: 'large' },
              ],
            },
          ],
        },
      ],
    },

    // ── 4. CẤU HÌNH HIỂN THỊ CHUNG CỦA LỊCH ──
    { name: 'preferWeeklyImage', label: 'Ưu tiên ảnh lịch tuần', type: 'checkbox', defaultValue: true },
    { name: 'showDailyTab', label: 'Hiện tab Theo ngày', type: 'checkbox', defaultValue: true },
    { name: 'showWeeklyTab', label: 'Hiện tab Theo tuần', type: 'checkbox', defaultValue: true },
    { name: 'showAttachmentTab', label: 'Hiện tab Tệp đính kèm', type: 'checkbox', defaultValue: true },
    { name: 'cacheMinutes', label: 'Thời gian cache lịch (phút)', type: 'number', defaultValue: 5, min: 0, max: 1440 },
  ],
}
