import type { GlobalConfig, Field } from 'payload'
import { admins, loggedIn } from '@/access'

const colorField = (name: string, label: string, defaultValue?: string): Field => ({
  name,
  label,
  type: 'text',
  ...(defaultValue ? { defaultValue } : {}),
  admin: {
    components: {
      Field: '/src/components/admin/ColorPickerField#default',
    },
  },
} as Field)

export const HospitalHistory: GlobalConfig = {
  slug: 'hospital-history',
  label: 'Lịch sử phát triển',
  admin: {
    group: 'Giới thiệu & Lịch sử',
    description: 'Quản lý nội dung trang Lịch sử hình thành và phát triển Bệnh viện Đa khoa Khu vực Thới Lai.',
  },
  access: { read: () => true, update: admins },
  versions: { max: 20 },
  fields: [
    {
      name: 'bannerImage',
      label: 'Ảnh bìa đầu trang (Banner)',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Tải ảnh toàn cảnh bệnh viện hoặc chọn từ thư viện. Khuyến nghị ảnh ngang 16:9 hoặc 21:9.',
      },
    },
    {
      name: 'eyebrow',
      label: 'Nhãn nhỏ trên tiêu đề',
      type: 'text',
      defaultValue: 'HÀNH TRÌNH PHÁT TRIỂN',
    },
    {
      name: 'pageTitle',
      label: 'Tiêu đề trang',
      type: 'text',
      defaultValue: 'Lịch sử hình thành & phát triển Bệnh viện Đa khoa Khu vực Thới Lai',
      required: true,
    },
    {
      name: 'subtitle',
      label: 'Khẩu hiệu / Phụ đề',
      type: 'text',
      defaultValue: 'Hơn hai thập kỷ tận tụy vì sức khỏe nhân dân – Đổi mới, phát triển và vươn tầm chuyên nghiệp',
    },
    {
      name: 'leadSummary',
      label: 'Đoạn giới thiệu tổng quan (Dẫn nhập)',
      type: 'textarea',
      defaultValue: 'Bệnh viện Đa khoa Khu vực Thới Lai tiền thân từ Trung tâm Y tế huyện, trải qua các giai đoạn chuyển mình mạnh mẽ. Từ những ngày đầu cơ sở vật chất đơn sơ, bệnh viện ngày nay đã vươn lên thành cơ sở y tế đa khoa vững mạnh ở cửa ngõ phía Tây thành phố Cần Thơ, trang bị kỹ thuật tiên tiến và quy tụ đội ngũ thầy thuốc giàu y đức.',
    },
    {
      name: 'milestones',
      label: 'Dòng thời gian các mốc son lịch sử (Timeline)',
      type: 'array',
      labels: {
        singular: 'Mốc thời gian',
        plural: 'Các mốc thời gian',
      },
      defaultValue: [
        {
          year: '2004',
          title: 'Thành lập Trung tâm Y tế huyện Ô Môn – Thới Lai',
          tag: 'Khởi đầu',
          description: 'Đáp ứng nhu cầu khám chữa bệnh của nhân dân địa phương sau khi chia tách địa giới hành chính, đặt nền móng đầu tiên cho sự nghiệp y tế khu vực.',
          highlight: false,
        },
        {
          year: '2008',
          title: 'Thành lập Bệnh viện Đa khoa huyện Thới Lai',
          tag: 'Dấu mốc',
          description: 'Chính thức thành lập Bệnh viện Đa khoa huyện Thới Lai theo quyết định của UBND thành phố Cần Thơ, mở rộng quy mô giường bệnh ban đầu và thành lập các khoa lâm sàng cốt lõi.',
          highlight: false,
        },
        {
          year: '2015',
          title: 'Đổi mới cơ sở hạ tầng & Nâng cao năng lực khám chữa bệnh',
          tag: 'Phát triển',
          description: 'Được đầu tư xây dựng các khối nhà chuyên môn mới khang trang, đưa vào vận hành hệ thống xét nghiệm tự động, máy X-quang kỹ thuật số và phòng mổ tiêu chuẩn.',
          highlight: false,
        },
        {
          year: '2020',
          title: 'Phát triển các kỹ thuật chuyên sâu & Chuyển đổi số y tế',
          tag: 'Đột phá',
          description: 'Triển khai thành công nhiều kỹ thuật cao trong sản phụ khoa, ngoại khoa, hồi sức cấp cứu; đẩy mạnh ứng dụng bệnh án điện tử, khám chữa bệnh BHYT bằng CCCD và đặt lịch trực tuyến.',
          highlight: true,
        },
        {
          year: 'Hiện nay & Tương lai',
          title: 'Vươn tầm Bệnh viện Đa khoa Khu vực chất lượng cao',
          tag: 'Vươn tầm',
          description: 'Hướng tới trở thành trung tâm y tế tin cậy hàng đầu cho người dân huyện Thới Lai và các khu vực lân cận, phát triển kỹ thuật cao, dịch vụ tận tâm và môi trường bệnh viện xanh - sạch - đẹp.',
          highlight: true,
        },
      ],
      fields: [
        { name: 'year', label: 'Năm / Giai đoạn', type: 'text', required: true },
        { name: 'title', label: 'Tiêu đề sự kiện', type: 'text', required: true },
        { name: 'tag', label: 'Nhãn danh mục (VD: Khởi đầu, Bước ngoặt, Vươn tầm)', type: 'text' },
        { name: 'description', label: 'Nội dung chi tiết', type: 'textarea', required: true },
        { name: 'image', label: 'Ảnh tư liệu (tùy chọn)', type: 'upload', relationTo: 'media' },
        { name: 'highlight', label: 'Đánh dấu mốc quan trọng (nổi bật)', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      name: 'coreValues',
      label: 'Giá trị cốt lõi & Sứ mệnh',
      type: 'group',
      fields: [
        {
          name: 'missionTitle',
          label: 'Sứ mệnh',
          type: 'text',
          defaultValue: 'Chăm sóc sức khỏe nhân dân bằng cả trái tim và trách nhiệm cao nhất.',
        },
        {
          name: 'visionTitle',
          label: 'Tầm nhìn',
          type: 'text',
          defaultValue: 'Xây dựng Bệnh viện Đa khoa Khu vực hiện đại, chuyên sâu, thân thiện và văn minh.',
        },
        {
          name: 'valuesList',
          label: 'Các giá trị cốt lõi',
          type: 'array',
          defaultValue: [
            { title: 'Tận tâm', description: 'Xem người bệnh như người thân, đặt an toàn và sức khỏe người bệnh lên hàng đầu.' },
            { title: 'Chuyên nghiệp', description: 'Chuẩn hóa quy trình y khoa, không ngừng cập nhật tiến bộ khoa học kỹ thuật.' },
            { title: 'Y đức', description: 'Gìn giữ truyền thống Lương y như từ mẫu, ứng xử chuẩn mực và nhân ái.' },
            { title: 'Đoàn kết', description: 'Gắn kết các thế hệ thầy thuốc, chung sức vì mục tiêu phát triển bền vững.' },
          ],
          fields: [
            { name: 'title', label: 'Tiêu đề giá trị', type: 'text', required: true },
            { name: 'description', label: 'Mô tả giá trị', type: 'textarea', required: true },
          ],
        },
      ],
    },
    {
      name: 'achievements',
      label: 'Các thành tựu tiêu biểu',
      type: 'array',
      labels: {
        singular: 'Thành tựu',
        plural: 'Các thành tựu',
      },
      defaultValue: [
        { title: 'Huân chương & Bằng khen', description: 'Nhiều năm liền nhận Cờ thi đua, Bằng khen của UBND thành phố Cần Thơ và Bộ Y tế về thành tích xuất sắc trong công tác bảo vệ và chăm sóc sức khỏe nhân dân.' },
        { title: 'Năng lực chuyên môn vượt bậc', description: 'Thực hiện thành công hàng ngàn ca phẫu thuật phức tạp mỗi năm, làm chủ nhiều kỹ thuật điều trị hiện đại tuyến khu vực.' },
        { title: 'Độ hài lòng người bệnh đạt trên 95%', description: 'Không ngừng cải cách thủ tục tiếp nhận, nâng cao thái độ phục vụ và tinh thần tận tụy chăm sóc.' },
      ],
      fields: [
        { name: 'title', label: 'Tiêu đề thành tựu', type: 'text', required: true },
        { name: 'description', label: 'Chi tiết thành tựu', type: 'textarea', required: true },
        { name: 'image', label: 'Ảnh minh họa / Bằng khen', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'content',
      label: 'Bài viết chi tiết lịch sử (Rich Text)',
      type: 'richText',
      admin: {
        description: 'Soạn thảo văn bản chi tiết về quá trình xây dựng, các thời kỳ lãnh đạo hoặc bài phát biểu lịch sử.',
      },
    },
    {
      name: 'appearance',
      label: 'Tùy biến màu sắc trang',
      type: 'group',
      fields: [
        colorField('primaryColor', 'Màu chủ đạo', '#0878D1'),
        colorField('accentColor', 'Màu điểm nhấn Timeline', '#16A36A'),
      ],
    },
  ],
}
