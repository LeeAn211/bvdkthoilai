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

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'Trang Giới thiệu chung',
  admin: {
    group: 'Giới thiệu & Lịch sử',
    description: 'Quản lý toàn bộ nội dung trang Giới thiệu chung (/gioi-thieu): thông tin tổng quan, giá trị cốt lõi, cơ sở vật chất, định hướng chất lượng.',
  },
  access: { read: () => true, update: admins },
  versions: { max: 20 },
  fields: [
    // ── HERO ────────────────────────────────────────────────────────
    {
      name: 'hero',
      label: 'Phần Banner đầu trang (Hero)',
      type: 'group',
      fields: [
        {
          name: 'bannerImage',
          label: 'Ảnh bìa đầu trang',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Tải ảnh chính thức của Bệnh viện Đa khoa Khu vực Thới Lai. Khuyến nghị ảnh ngang 1920x600 hoặc 16:9. Bỏ trống sẽ dùng ảnh banner chuẩn của bệnh viện.',
          },
        },
        {
          name: 'eyebrow',
          label: 'Nhãn nhỏ trên tiêu đề',
          type: 'text',
          defaultValue: 'TỔNG QUAN BỆNH VIỆN',
        },
        {
          name: 'tagline',
          label: 'Khẩu hiệu / Slogan',
          type: 'text',
          defaultValue: 'Điều trị bằng trái tim – Chăm sóc bằng tấm lòng',
        },
        {
          name: 'intro',
          label: 'Đoạn giới thiệu tổng quan',
          type: 'textarea',
          defaultValue: 'Bệnh viện Đa khoa Khu vực Thới Lai là cơ sở y tế đa khoa công lập trực thuộc Sở Y tế thành phố Cần Thơ, giữ vai trò khám chữa bệnh trọng điểm tại cửa ngõ phía Tây, không ngừng đổi mới chất lượng chuyên môn và phong cách phục vụ.',
        },
      ],
    },

    // ── CHỈ SỐ HOẠT ĐỘNG ──────────────────────────────────────────
    {
      name: 'stats',
      label: 'Các chỉ số quy mô & năng lực',
      type: 'array',
      labels: { singular: 'Chỉ số', plural: 'Các chỉ số' },
      defaultValue: [
        { number: 'Hạng II', label: 'Xếp hạng bệnh viện', icon: '🎖️' },
        { number: '200+', label: 'Giường bệnh kế hoạch', icon: '🛏️' },
        { number: '100+', label: 'Cán bộ, viên chức y tế', icon: '👨‍⚕️' },
        { number: '96%+', label: 'Hài lòng người bệnh', icon: '⭐' },
      ],
      fields: [
        { name: 'number', label: 'Con số / Quy mô', type: 'text', required: true },
        { name: 'label', label: 'Tên chỉ số', type: 'text', required: true },
        { name: 'icon', label: 'Icon emoji', type: 'text' },
      ],
    },

    // ── CHỨC NĂNG & NHIỆM VỤ TRỌNG TÂM ──────────────────────
    {
      name: 'corePrinciples',
      label: 'Chức năng & Nhiệm vụ trọng tâm (Tách bạch với Lịch sử phát triển)',
      type: 'group',
      fields: [
        {
          name: 'title',
          label: 'Tiêu đề khối',
          type: 'text',
          defaultValue: 'Chức năng & Nhiệm vụ trọng tâm',
        },
        {
          name: 'subtitle',
          label: 'Mô tả ngắn',
          type: 'textarea',
          defaultValue: 'Thực hiện chức năng khám chữa bệnh đa khoa, cấp cứu và chăm sóc sức khỏe nhân dân toàn diện theo quy chuẩn của Bộ Y tế và Sở Y tế TP. Cần Thơ.',
        },
        {
          name: 'items',
          label: 'Danh sách chức năng & nhiệm vụ',
          type: 'array',
          defaultValue: [
            {
              icon: '🚑',
              title: 'Cấp cứu & Khám chữa bệnh đa khoa',
              desc: 'Tổ chức tiếp nhận cấp cứu 24/7, khám bệnh ngoại trú, điều trị nội trú đa khoa và phục hồi chức năng cho người dân huyện Thới Lai và khu vực lân cận.',
            },
            {
              icon: '🔬',
              title: 'Phát triển kỹ thuật & Phẫu thuật ngoại khoa',
              desc: 'Ứng dụng phẫu thuật nội soi, chẩn đoán hình ảnh kỹ thuật số, xét nghiệm tự động và từng bước phát triển các kỹ thuật chuyên sâu tuyến khu vực.',
            },
            {
              icon: '🛡️',
              title: 'Y tế dự phòng & Hỗ trợ chỉ đạo tuyến',
              desc: 'Chủ động phối hợp phòng chống dịch bệnh, giám sát dịch tễ, truyền thông giáo dục sức khỏe và hỗ trợ chuyên môn kỹ thuật cho y tế cơ sở.',
            },
            {
              icon: '💻',
              title: 'Chuyển đổi số & Bệnh án điện tử',
              desc: 'Triển khai toàn diện hồ sơ bệnh án điện tử (EMR), lưu trữ hình ảnh PACS không in phim, thanh toán không tiền mặt và đặt lịch khám trực tuyến.',
            },
          ],
          fields: [
            { name: 'icon', label: 'Biểu tượng icon', type: 'text', required: true },
            { name: 'title', label: 'Tên nhiệm vụ', type: 'text', required: true },
            { name: 'desc', label: 'Mô tả chi tiết', type: 'textarea', required: true },
          ],
        },
      ],
    },

    // ── NĂNG LỰC & CƠ SỞ VẬT CHẤT ─────────────────────────────────
    {
      name: 'facilities',
      label: 'Cơ sở vật chất & Năng lực trang thiết bị',
      type: 'group',
      fields: [
        {
          name: 'title',
          label: 'Tiêu đề khối',
          type: 'text',
          defaultValue: 'Cơ sở hạ tầng & Trang thiết bị y tế',
        },
        {
          name: 'description',
          label: 'Mô tả tổng quan',
          type: 'textarea',
          defaultValue: 'Bệnh viện được đầu tư đồng bộ hệ thống máy móc cận lâm sàng hiện đại, phòng mổ đạt chuẩn vô khuẩn và khu điều trị nội trú khang trang.',
        },
        {
          name: 'items',
          label: 'Các trang bị nổi bật',
          type: 'array',
          defaultValue: [
            { title: 'Chẩn đoán hình ảnh kỹ thuật số', desc: 'Hệ thống chụp X-quang kỹ thuật số hiện đại, siêu âm màu Doppler 4D hỗ trợ chẩn đoán nhanh, chính xác.' },
            { title: 'Xét nghiệm tự động hoàn toàn', desc: 'Hệ thống sinh hóa, huyết học, miễn dịch tự động đạt chuẩn nội kiểm, ngoại kiểm chất lượng nghiêm ngặt.' },
            { title: 'Phòng mổ vô trùng & Gây mê hồi sức', desc: 'Khu phẫu thuật hiện đại với hệ thống khí sạch áp lực dương, đảm bảo an toàn tối đa cho các ca phẫu thuật.' },
            { title: 'Khoa Cấp cứu & Điều trị tích cực', desc: 'Trực cấp cứu 24/7 với đầy đủ máy thở, monitor theo dõi đa thông số, máy sốc điện và xe cứu thương chuyên dụng.' },
          ],
          fields: [
            { name: 'title', label: 'Tên hạng mục', type: 'text', required: true },
            { name: 'desc', label: 'Chi tiết năng lực', type: 'textarea', required: true },
          ],
        },
      ],
    },

    // ── CAM KẾT CHẤT LƯỢNG ─────────────────────────────────────────
    {
      name: 'commitment',
      label: 'Cam kết chất lượng khám chữa bệnh',
      type: 'group',
      fields: [
        {
          name: 'title',
          label: 'Tiêu đề cam kết',
          type: 'text',
          defaultValue: 'Cam kết chất lượng phục vụ nhân dân',
        },
        {
          name: 'quote',
          label: 'Thông điệp cam kết',
          type: 'textarea',
          defaultValue: 'Mỗi cán bộ y tế Bệnh viện Đa khoa Khu vực Thới Lai luôn nêu cao tinh thần trách nhiệm, không ngừng học hỏi nâng cao tay nghề, coi sức khỏe và sự hài lòng của người bệnh là thước đo cao nhất cho hiệu quả công tác.',
        },
        {
          name: 'author',
          label: 'Đại diện phát biểu',
          type: 'text',
          defaultValue: 'Ban Giám đốc Bệnh viện Đa khoa Khu vực Thới Lai',
        },
      ],
    },

    // ── GỢI Ý ĐIỀU HƯỚNG TỚI CÁC TRANG CHUYÊN ĐỀ ───────────────────
    {
      name: 'relatedLinks',
      label: 'Khối liên kết khám phá chuyên sâu',
      type: 'group',
      fields: [
        {
          name: 'title',
          label: 'Tiêu đề khối',
          type: 'text',
          defaultValue: 'Thông tin chuyên đề khác',
        },
        {
          name: 'subtitle',
          label: 'Mô tả',
          type: 'text',
          defaultValue: 'Tìm hiểu chi tiết hơn qua các trang chuyên đề của bệnh viện:',
        },
        {
          name: 'links',
          label: 'Danh sách liên kết',
          type: 'array',
          defaultValue: [
            { title: 'Lịch sử hình thành & Phát triển', url: '/gioi-thieu/lich-su-phat-trien', desc: 'Hơn hai thập kỷ trưởng thành và các mốc son tiêu biểu' },
            { title: 'Sơ đồ tổ chức 3 cấp', url: '/so-do-to-chuc', desc: 'Ban Giám đốc và các khối trực thuộc' },
            { title: 'Danh mục Khoa – Phòng', url: '/khoa-phong', desc: 'Chi tiết các khoa lâm sàng, cận lâm sàng và phòng chức năng' },
            { title: 'Đội ngũ Bác sĩ chuyên khoa', url: '/bac-si', desc: 'Danh sách các thầy thuốc, bác sĩ uy tín tại bệnh viện' },
          ],
          fields: [
            { name: 'title', label: 'Tên liên kết', type: 'text', required: true },
            { name: 'url', label: 'Đường dẫn URL', type: 'text', required: true },
            { name: 'desc', label: 'Mô tả ngắn', type: 'text' },
          ],
        },
      ],
    },

    // ── MÀU SẮC ───────────────────────────────────────────────────
    {
      name: 'appearance',
      label: 'Tùy biến màu sắc',
      type: 'group',
      fields: [
        colorField('primaryColor', 'Màu chủ đạo', '#0878D1'),
        colorField('accentColor', 'Màu điểm nhấn', '#16A36A'),
      ],
    },

    // ── SEO ───────────────────────────────────────────────────────
    {
      name: 'seo',
      label: 'SEO trang Giới thiệu',
      type: 'group',
      fields: [
        { name: 'title', label: 'Tiêu đề trang (title)', type: 'text', defaultValue: 'Giới thiệu Bệnh viện Đa khoa Khu vực Thới Lai' },
        { name: 'description', label: 'Mô tả (meta description)', type: 'textarea', defaultValue: 'Tổng quan về Bệnh viện Đa khoa Khu vực Thới Lai: quy mô, chức năng nhiệm vụ, cơ sở vật chất và cam kết chất lượng phục vụ.' },
      ],
    },
  ],
}
