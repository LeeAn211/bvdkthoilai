import type { GlobalConfig } from 'payload'
import { admins } from '@/access'

export const VaccinationSettings: GlobalConfig = {
  slug: 'vaccination-settings',
  label: 'Trang Tiêm chủng & Vắc xin',
  admin: {
    group: '🏥 Khám bệnh & Dịch vụ Y tế',
    description: 'Tùy chỉnh tiêu đề, thông báo lưu ý, quy trình tiêm chủng, bật/tắt các nút tác vụ và bài viết hướng dẫn chuyên sâu trên trang /tiem-chung.',
  },
  access: { read: () => true, update: admins },
  fields: [
    // ── 1. BANNER HERO ĐẦU TRANG & THÔNG BÁO LƯU Ý ──
    {
      name: 'eyebrow',
      label: 'Nhãn nhỏ (Eyebrow)',
      type: 'text',
      defaultValue: 'TIÊM NGỪA AN TOÀN',
    },
    {
      name: 'title',
      label: 'Tiêu đề trang',
      type: 'text',
      defaultValue: 'Thông tin tiêm ngừa & Danh mục Vắc xin',
      required: true,
    },
    {
      name: 'description',
      label: 'Mô tả trang (Hỗ trợ Enter xuống dòng)',
      type: 'textarea',
      defaultValue: 'Theo dõi bảng giá vắc xin hiện hành, đối tượng tiêm ngừa và lịch tiêm chủng an toàn tại Bệnh viện Đa khoa Khu vực Thới Lai.',
    },
    {
      name: 'showNoticeBanner',
      label: 'Bật thông báo lưu ý tiêm chủng',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'noticeTitle',
      label: 'Tiêu đề lưu ý tiêm chủng',
      type: 'text',
      defaultValue: 'Quy trình và An toàn Tiêm chủng tại Bệnh viện',
    },
    {
      name: 'noticeContent',
      label: 'Nội dung lưu ý (Hỗ trợ Enter xuống dòng)',
      type: 'textarea',
      defaultValue: '• Người đến tiêm chủng được khám sàng lọc trước tiêm và tư vấn chỉ định vắc xin phù hợp.\n• Theo dõi sức khỏe ít nhất 30 phút sau tiêm tại phòng theo dõi của bệnh viện.\n• Vui lòng mang theo sổ tiêm chủng hoặc ứng dụng tiêm chủng điện tử khi đến tiêm.',
    },
    {
      name: 'noticeAlign',
      label: 'Canh lề bảng lưu ý',
      type: 'select',
      dbName: 'vcs_not_align',
      defaultValue: 'left',
      options: [
        { label: 'Canh trái (Mặc định)', value: 'left' },
        { label: 'Canh giữa', value: 'center' },
        { label: 'Canh đều 2 bên (Justify)', value: 'justify' },
      ],
    },

    // ── 2. CÔNG TẮC BẬT/TẮT CÁC THÀNH PHẦN GIAO DIỆN (GRANULAR TOGGLES) ──
    {
      name: 'showSearch',
      label: 'Bật thanh tìm kiếm vắc xin & lịch tiêm',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showAgeFilter',
      label: 'Bật bộ lọc đối tượng / độ tuổi (Tất cả, Trẻ sơ sinh, Trẻ em, Phụ nữ mang thai, Người lớn)',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showPrice',
      label: 'Bật hiển thị giá niêm yết trên thẻ vắc xin',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showBookButton',
      label: 'Bật nút "Đăng ký tiêm" trên thẻ vắc xin & trang chi tiết',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showWorkflowSection',
      label: 'Bật khối Quy trình 4 bước tiêm chủng an toàn',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showSupportBanner',
      label: 'Bật banner Tư vấn phác đồ & Hotline đặt hẹn cuối trang',
      type: 'checkbox',
      defaultValue: true,
    },

    // ── 3. TÙY CHỈNH NÚT ĐĂNG KÝ & THANH TRƯỢT VẮC XIN ──
    {
      name: 'itemsPerView',
      label: 'Số ô vắc xin hiển thị cùng lúc trên màn hình lớn',
      type: 'number',
      min: 1,
      max: 4,
      defaultValue: 3,
      admin: {
        description: 'Mặc định là 3 ô. Trên màn hình máy tính bảng sẽ tự chia 2 ô, điện thoại hiển thị 1 ô.',
      },
    },
    {
      name: 'autoplaySeconds',
      label: 'Thời gian tự động chuyển động qua ô khác (giây)',
      type: 'number',
      min: 0,
      max: 60,
      defaultValue: 5,
      admin: {
        description: 'Mặc định là 5 giây tự trượt xoay vòng tuần tự. Đặt là 0 nếu muốn tắt tự động chuyển động.',
      },
    },
    {
      name: 'bookButtonText',
      label: 'Chữ hiển thị trên nút Đăng ký',
      type: 'text',
      defaultValue: 'Đăng ký tiêm',
    },
    {
      name: 'detailButtonText',
      label: 'Chữ hiển thị trên nút Chi tiết',
      type: 'text',
      defaultValue: 'Chi tiết',
    },
    {
      name: 'bookButtonUrl',
      label: 'Liên kết đăng ký mặc định (nếu vắc xin chưa nhập link riêng)',
      type: 'text',
      defaultValue: 'https://medpro.vn/',
    },
    {
      name: 'consultHotline',
      label: 'Hotline tư vấn tiêm chủng',
      type: 'text',
      defaultValue: '0292 3861 234',
    },

    // ── 4. KHỐI BÀI VIẾT CHI TIẾT & HƯỚNG DẪN TIÊM CHỦNG (RICHTEXT) ──
    {
      name: 'contentBlock',
      label: 'Bài viết chi tiết & Hướng dẫn tiêm ngừa (RichText)',
      type: 'group',
      fields: [
        { name: 'enabled', label: 'Bật hiển thị khối bài viết này', type: 'checkbox', defaultValue: false },
        { name: 'title', label: 'Tiêu đề bài viết', type: 'text', defaultValue: 'Hướng dẫn tiêm chủng an toàn và phòng ngừa phản ứng sau tiêm' },
        { name: 'subtitle', label: 'Mô tả ngắn gọn / Phụ đề bài viết', type: 'textarea', defaultValue: 'Thông tin chuyên môn từ Hội đồng Chuyên môn Bệnh viện Đa khoa Khu vực Thới Lai về theo dõi sức khỏe và quy chuẩn tiêm chủng an toàn.' },
        { name: 'content', label: 'Nội dung bài viết chi tiết (RichText)', type: 'richText' },
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

    // ── 5. CÁC KHỐI NỘI DUNG TÙY BIẾN THÊM MỚI (CUSTOM BLOCKS) ──
    {
      name: 'customBlocks',
      label: 'Các khối nội dung tùy biến thêm mới (Không giới hạn)',
      type: 'array',
      dbName: 'vcs_custom_blocks',
      labels: { singular: 'Khối nội dung tùy biến', plural: 'Các khối nội dung tùy biến' },
      fields: [
        { name: 'enabled', label: 'Bật hiển thị khối này', type: 'checkbox', defaultValue: true },
        { name: 'kicker', label: 'Nhãn nhỏ phía trên (Kicker)', type: 'text', admin: { placeholder: 'VÍ DỤ: LỊCH TIÊM MỞ RỘNG HOẶC LƯU Ý ĐẶC BIỆT' } },
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
