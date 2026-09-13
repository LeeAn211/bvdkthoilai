import type { GlobalConfig, Field } from 'payload'
import { admins } from '@/access'

const colorField = (name: string, label: string, defaultValue?: string, extra?: Partial<Field>): Field => ({
  name,
  label,
  type: 'text',
  ...(defaultValue ? { defaultValue } : {}),
  admin: {
    components: {
      Field: '/src/components/admin/ColorPickerField#default',
    },
  },
  ...(extra || {}),
} as Field)

export const HospitalHistory: GlobalConfig = {
  slug: 'hospital-history',
  label: 'Lịch sử phát triển',
  admin: {
    group: 'Giới thiệu & Lịch sử',
    description: 'Quản lý toàn bộ nội dung, hình ảnh, icon, bố cục, căn lề và bật/tắt các khối trên trang Lịch sử hình thành và phát triển.',
  },
  access: { read: () => true, update: admins },
  versions: { max: 20 },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ================= TAB 1: HERO BANNER & CHỈ SỐ NHANH =================
        {
          label: '🖼️ Đầu trang & Chỉ số nhanh',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'showHero',
                  label: 'Hiển thị khối Banner đầu trang',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: { width: '30%' },
                },
                {
                  name: 'heroMinHeight',
                  label: 'Chiều cao tối thiểu Banner (px)',
                  type: 'number',
                  defaultValue: 380,
                  min: 200,
                  max: 700,
                  admin: { width: '35%' },
                },
                {
                  name: 'heroAlign',
                  label: 'Căn lề chữ Banner',
                  type: 'select',
                  enumName: 'hist_hero_align',
                  dbName: 'hero_align',
                  defaultValue: 'left',
                  options: [
                    { label: 'Căn trái', value: 'left' },
                    { label: 'Căn giữa', value: 'center' },
                    { label: 'Căn phải', value: 'right' },
                  ],
                  admin: { width: '35%' },
                },
              ],
            },
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
              type: 'row',
              fields: [
                {
                  name: 'eyebrow',
                  label: 'Nhãn nhỏ trên tiêu đề',
                  type: 'text',
                  defaultValue: 'LỊCH SỬ HÌNH THÀNH VÀ PHÁT TRIỂN',
                  admin: { width: '50%' },
                },
                {
                  name: 'pageTitle',
                  label: 'Tiêu đề trang (H1)',
                  type: 'text',
                  defaultValue: 'Lịch sử hình thành & phát triển Bệnh viện Đa khoa Khu vực Thới Lai',
                  required: true,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'subtitle',
              label: 'Khẩu hiệu / Phụ đề banner',
              type: 'text',
              defaultValue: 'Hơn hai thập kỷ tận tụy vì sức khỏe nhân dân – Đổi mới, phát triển và vươn tầm chuyên nghiệp',
            },
            {
              type: 'collapsible',
              label: '📊 Tùy chỉnh các Ô chỉ số nhanh (Quick Stats)',
              admin: { initCollapsed: false },
              fields: [
                {
                  name: 'showQuickStats',
                  label: 'Hiển thị các ô chỉ số nhanh dưới Banner',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'quickStats',
                  label: 'Danh sách các chỉ số nhanh',
                  type: 'array',
                  labels: { singular: 'Ô chỉ số', plural: 'Các ô chỉ số' },
                  defaultValue: [
                    { number: '2009', label: 'Khởi nguồn nền móng' },
                    { number: '100+', label: 'Giường bệnh thiết kế' },
                    { number: '100%', label: 'Bệnh án điện tử' },
                    { number: 'Khu vực', label: 'Mô hình Đa khoa hiện đại' },
                  ],
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'number', label: 'Số liệu / Điểm nhấn', type: 'text', required: true, admin: { width: '40%' } },
                        { name: 'label', label: 'Nhãn mô tả chỉ số', type: 'text', required: true, admin: { width: '60%' } },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ================= TAB 2: DẪN NHẬP TỔNG QUAN =================
        {
          label: '📝 Dẫn nhập tổng quan',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'showLead',
                  label: 'Hiển thị khối dẫn nhập',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: { width: '30%' },
                },
                {
                  name: 'leadAlign',
                  label: 'Căn lề chữ dẫn nhập',
                  type: 'select',
                  enumName: 'hist_lead_align',
                  dbName: 'lead_align',
                  defaultValue: 'left',
                  options: [
                    { label: 'Căn trái', value: 'left' },
                    { label: 'Căn đều 2 bên (Justify)', value: 'justify' },
                    { label: 'Căn giữa', value: 'center' },
                  ],
                  admin: { width: '35%' },
                },
                {
                  name: 'leadFontSize',
                  label: 'Cỡ chữ dẫn nhập (px)',
                  type: 'number',
                  defaultValue: 18,
                  min: 14,
                  max: 26,
                  admin: { width: '35%' },
                },
              ],
            },
            {
              name: 'leadSummary',
              label: 'Nội dung đoạn giới thiệu tổng quan',
              type: 'textarea',
              
              defaultValue: 'Bệnh viện Đa khoa khu vực Thới Lai có quá trình hình thành và phát triển gắn liền với sự phát triển của huyện Thới Lai trước đây và quá trình kiện toàn hệ thống y tế thành phố Cần Thơ. Từ những ngày đầu còn nhiều khó khăn về cơ sở vật chất, trang thiết bị và nhân lực, qua nhiều giai đoạn tổ chức và phát triển, đơn vị từng bước nâng cao năng lực chuyên môn, đầu tư cơ sở vật chất, ứng dụng công nghệ thông tin và mở rộng các dịch vụ kỹ thuật, đáp ứng ngày càng tốt hơn nhu cầu khám bệnh, chữa bệnh và chăm sóc sức khỏe của Nhân dân.',
            },
          ],
        },

        // ================= TAB 3: DÒNG THỜI GIAN (TIMELINE) =================
        {
          label: '⏳ Dòng thời gian (Timeline)',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'showTimeline',
                  label: 'Hiển thị khối Dòng thời gian',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: { width: '25%' },
                },
                {
                  name: 'timelineKicker',
                  label: 'Nhãn nhỏ trên tiêu đề khối',
                  type: 'text',
                  defaultValue: 'DÒNG THỜI GIAN',
                  admin: { width: '25%' },
                },
                {
                  name: 'timelineTitle',
                  label: 'Tiêu đề khối',
                  type: 'text',
                  defaultValue: 'Những dấu mốc phát triển tiêu biểu',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'timelineDesc',
              label: 'Đoạn mô tả ngắn dưới tiêu đề',
              type: 'textarea',
              defaultValue: 'Hành trình xây dựng và phát triển của Bệnh viện Đa khoa khu vực Thới Lai qua các thời kỳ.',
            },
            {
              name: 'milestones',
              label: 'Các mốc sự kiện lịch sử',
              type: 'array',
              labels: { singular: 'Mốc thời gian', plural: 'Các mốc thời gian' },
              defaultValue: [
                {
                  year: '2009–2010',
                  title: 'Bệnh viện Đa khoa huyện Thới Lai',
                  tag: 'Hình thành',
                  description: 'Sau khi huyện Thới Lai được thành lập và chính thức đi vào hoạt động, hệ thống y tế trên địa bàn được từng bước kiện toàn. Bệnh viện Đa khoa huyện Thới Lai được hình thành nhằm đáp ứng nhu cầu khám bệnh, chữa bệnh của người dân trên địa bàn. Các nguồn tư liệu hiện có ghi nhận đơn vị bắt đầu hoạt động về mặt đăng ký từ năm 2009; Báo Cần Thơ ghi nhận Bệnh viện Đa khoa huyện Thới Lai được thành lập vào năm 2010. Đây là nền móng quan trọng cho quá trình hình thành và phát triển của Bệnh viện Đa khoa khu vực Thới Lai ngày nay.',
                  highlight: false,
                  textAlign: 'left',
                },
                {
                  year: '2011',
                  title: 'Đưa cơ sở Bệnh viện Đa khoa huyện Thới Lai vào sử dụng',
                  tag: 'Phát triển cơ sở vật chất',
                  description: 'Đầu năm 2011, giai đoạn 1 của công trình Bệnh viện Đa khoa huyện Thới Lai được đưa vào sử dụng. Bệnh viện được đầu tư với quy mô thiết kế khoảng 100 giường bệnh, tổng kinh phí xây dựng trên 100 tỷ đồng. Việc đưa công trình vào hoạt động tạo bước chuyển quan trọng về cơ sở vật chất và điều kiện khám, chữa bệnh cho người dân Thới Lai và khu vực lân cận.',
                  highlight: false,
                  textAlign: 'left',
                },
                {
                  year: '2017',
                  title: 'Thành lập Trung tâm Y tế huyện Thới Lai',
                  tag: 'Kiện toàn hệ thống y tế',
                  description: 'Ngày 01 tháng 3 năm 2017, Sở Y tế thành phố Cần Thơ công bố quyết định thành lập Trung tâm Y tế huyện Thới Lai, trực thuộc Sở Y tế thành phố Cần Thơ. Trung tâm được thành lập trên cơ sở sáp nhập Bệnh viện Đa khoa huyện Thới Lai và Trung tâm Y tế dự phòng huyện Thới Lai. Việc tổ chức lại giúp thống nhất nguồn lực y tế tuyến huyện, kết hợp công tác khám bệnh, chữa bệnh với y tế dự phòng, phòng chống dịch bệnh và chăm sóc sức khỏe cộng đồng.',
                  highlight: false,
                  textAlign: 'left',
                },
                {
                  year: '2025',
                  title: 'Trung tâm Y tế khu vực Thới Lai',
                  tag: 'Chuyển sang mô hình y tế khu vực',
                  description: 'Từ ngày 01 tháng 7 năm 2025, thực hiện chủ trương sắp xếp hệ thống đơn vị sự nghiệp y tế của thành phố Cần Thơ, Trung tâm Y tế khu vực Thới Lai được thành lập trên cơ sở sắp xếp Trung tâm Y tế huyện Thới Lai và Trung tâm Y tế huyện Cờ Đỏ. Đây là giai đoạn đơn vị tiếp tục mở rộng phạm vi phục vụ, nâng cao năng lực chuyên môn và đẩy mạnh chuyển đổi số trong hoạt động khám bệnh, chữa bệnh. Tháng 9 năm 2025, Trung tâm chính thức ban hành quyết định sử dụng và lưu trữ hồ sơ bệnh án điện tử, lưu trữ và truyền tải hình ảnh y tế thay cho in phim và lưu trữ thông tin xét nghiệm điện tử, đánh dấu một bước tiến quan trọng trong quá trình chuyển đổi số y tế.',
                  highlight: true,
                  textAlign: 'left',
                },
                {
                  year: '2026',
                  title: 'Thành lập Bệnh viện Đa khoa khu vực Thới Lai',
                  tag: 'Dấu mốc mới',
                  description: 'Thực hiện chủ trương tổ chức lại hệ thống y tế thành phố Cần Thơ, kể từ ngày 31 tháng 8 năm 2026, Trung tâm Y tế khu vực Thới Lai được tổ chức lại thành BỆNH VIỆN ĐA KHOA KHU VỰC THỚI LAI. Việc chuyển đổi sang mô hình bệnh viện đa khoa khu vực giúp đơn vị tập trung nguồn lực cho công tác khám bệnh, chữa bệnh, cấp cứu, điều trị nội trú, phục hồi chức năng và phát triển các kỹ thuật chuyên môn. Bệnh viện tiếp tục kế thừa cơ sở vật chất, đội ngũ nhân lực, kinh nghiệm chuyên môn và truyền thống của các giai đoạn trước, đồng thời từng bước nâng cao chất lượng dịch vụ y tế, hướng đến sự hài lòng và an toàn của người bệnh.',
                  highlight: true,
                  textAlign: 'left',
                },
                {
                  year: 'Hiện nay & Tương lai',
                  title: 'Hướng đến bệnh viện đa khoa khu vực hiện đại, chất lượng',
                  tag: 'Phát triển bền vững',
                  description: 'Bệnh viện Đa khoa khu vực Thới Lai tiếp tục phát triển chuyên môn, tăng cường ứng dụng khoa học kỹ thuật và công nghệ thông tin, cải tiến chất lượng bệnh viện và xây dựng môi trường khám chữa bệnh an toàn, thân thiện. Mục tiêu của Bệnh viện là từng bước đáp ứng ngày càng tốt hơn nhu cầu chăm sóc sức khỏe của Nhân dân trên địa bàn Thới Lai và các khu vực lân cận.',
                  highlight: true,
                  textAlign: 'left',
                },
              ],
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'year', label: 'Năm / Giai đoạn', type: 'text', required: true, admin: { width: '30%' } },
                    { name: 'title', label: 'Tiêu đề sự kiện', type: 'text', required: true, admin: { width: '40%' } },
                    { name: 'tag', label: 'Nhãn danh mục (VD: Hình thành, Dấu mốc...)', type: 'text', admin: { width: '30%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'textAlign',
                      label: 'Căn lề nội dung',
                      type: 'select',
                      enumName: 'hist_milestone_align',
                      dbName: 'text_align',
                      defaultValue: 'left',
                      options: [
                        { label: 'Căn trái', value: 'left' },
                        { label: 'Căn đều (Justify)', value: 'justify' },
                        { label: 'Căn giữa', value: 'center' },
                      ],
                      admin: { width: '35%' },
                    },
                    { name: 'highlight', label: 'Đánh dấu nổi bật (màu xanh)', type: 'checkbox', defaultValue: false, admin: { width: '30%' } },
                    { name: 'image', label: 'Ảnh tư liệu (tùy chọn)', type: 'upload', relationTo: 'media', admin: { width: '35%' } },
                  ],
                },
                { name: 'description', label: 'Nội dung chi tiết', type: 'textarea', required: true },
              ],
            },
          ],
        },

        // ================= TAB 4: SỨ MỆNH - TẦM NHÌN - GIÁ TRỊ CỐT LÕI =================
        {
          label: '🎯 Sứ mệnh, Tầm nhìn & Giá trị',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'showCoreValues',
                  label: 'Hiển thị khối Sứ mệnh & Giá trị cốt lõi',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: { width: '30%' },
                },
                {
                  name: 'coreValuesKicker',
                  label: 'Nhãn nhỏ',
                  type: 'text',
                  defaultValue: 'KIM CHỈ NAM HÀNH ĐỘNG',
                  admin: { width: '35%' },
                },
                {
                  name: 'coreValuesTitle',
                  label: 'Tiêu đề khối',
                  type: 'text',
                  defaultValue: 'Sứ mệnh – Tầm nhìn – Giá trị cốt lõi',
                  admin: { width: '35%' },
                },
              ],
            },
            {
              name: 'coreValuesDesc',
              label: 'Mô tả khối',
              type: 'textarea',
              defaultValue: 'Những định hướng nền tảng để tập thể viên chức, người lao động Bệnh viện Đa khoa khu vực Thới Lai không ngừng nâng cao chất lượng phục vụ người bệnh.',
            },
            {
              name: 'coreValues',
              label: 'Chi tiết Sứ mệnh, Tầm nhìn và 4 Giá trị cốt lõi',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'missionTitle',
                      label: 'Nội dung Sứ mệnh',
                      type: 'textarea',
                      
                      defaultValue: 'Cung cấp dịch vụ khám bệnh, chữa bệnh an toàn, chất lượng và tận tâm; góp phần bảo vệ, chăm sóc và nâng cao sức khỏe Nhân dân.',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'visionTitle',
                      label: 'Nội dung Tầm nhìn',
                      type: 'textarea',
                      
                      defaultValue: 'Xây dựng Bệnh viện Đa khoa khu vực Thới Lai từng bước hiện đại, chuyên nghiệp, thân thiện; phát triển chuyên môn kỹ thuật phù hợp với nhu cầu chăm sóc sức khỏe của người dân trong khu vực.',
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  name: 'valuesList',
                  label: 'Danh sách các Giá trị cốt lõi',
                  type: 'array',
                  labels: { singular: 'Giá trị cốt lõi', plural: 'Các giá trị cốt lõi' },
                  defaultValue: [
                    { iconType: 'heart', title: 'TẬN TÂM', description: 'Lấy người bệnh làm trung tâm; luôn quan tâm đến an toàn, sức khỏe và quyền lợi của người bệnh.' },
                    { iconType: 'star', title: 'CHUYÊN NGHIỆP', description: 'Chuẩn hóa quy trình chuyên môn, nâng cao năng lực đội ngũ và không ngừng cập nhật tiến bộ khoa học kỹ thuật.' },
                    { iconType: 'caduceus', title: 'Y ĐỨC', description: 'Giữ gìn phẩm chất người thầy thuốc, thực hiện tốt quy tắc ứng xử, phục vụ người bệnh bằng tinh thần trách nhiệm và nhân ái.' },
                    { iconType: 'handshake', title: 'ĐOÀN KẾT', description: 'Phát huy tinh thần phối hợp, chia sẻ và gắn kết giữa các khoa, phòng và các thế hệ viên chức, người lao động vì sự phát triển chung của Bệnh viện.' },
                  ],
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'iconType',
                          label: 'Biểu tượng (Icon)',
                          type: 'select',
                          enumName: 'hist_icon_type',
                          dbName: 'icon_type',
                          defaultValue: 'heart',
                          options: [
                            { label: '♥ Trái tim (Tận tâm)', value: 'heart' },
                            { label: '✦ Ngôi sao (Chuyên nghiệp)', value: 'star' },
                            { label: '⚕ Cây gậy y học (Y đức)', value: 'caduceus' },
                            { label: '🤝 Bắt tay (Đoàn kết)', value: 'handshake' },
                            { label: '🛡️ Chiếc khiên (An toàn)', value: 'shield' },
                            { label: '💡 Bóng đèn (Sáng tạo / Đổi mới)', value: 'lightbulb' },
                            { label: '🖼️ Tải icon / ảnh riêng', value: 'custom' },
                          ],
                          admin: { width: '40%' },
                        },
                        {
                          name: 'customIcon',
                          label: 'Ảnh icon tự tải lên (nếu chọn icon riêng)',
                          type: 'upload',
                          relationTo: 'media',
                          admin: { width: '60%' },
                        },
                      ],
                    },
                    {
                      name: 'title',
                      label: 'Tiêu đề giá trị cốt lõi',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'description',
                      label: 'Mô tả giá trị cốt lõi',
                      type: 'textarea',
                      required: true,
                      
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ================= TAB 5: HÀNH TRÌNH TIẾP NỐI (JOURNEY) =================
        {
          label: '🔄 Hành trình tiếp nối',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'showJourney',
                  label: 'Hiển thị khối Hành trình tiếp nối',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: { width: '30%' },
                },
                {
                  name: 'journeyKicker',
                  label: 'Nhãn nhỏ',
                  type: 'text',
                  defaultValue: 'HÀNH TRÌNH TIẾP NỐI',
                  admin: { width: '35%' },
                },
                {
                  name: 'journeyTitle',
                  label: 'Tiêu đề khối',
                  type: 'text',
                  defaultValue: 'Kế thừa và Vươn tầm phát triển',
                  admin: { width: '35%' },
                },
              ],
            },
            {
              name: 'journeyDesc',
              label: 'Mô tả khối',
              type: 'textarea',
              defaultValue: 'Trải qua nhiều giai đoạn tổ chức và phát triển, mỗi giai đoạn đều đánh dấu một bước chuyển quan trọng trong quá trình xây dựng hệ thống y tế phục vụ Nhân dân.',
            },
            {
              name: 'journeySteps',
              label: 'Các bước trong sơ đồ chuyển tiếp',
              type: 'array',
              labels: { singular: 'Bước chuyển tiếp', plural: 'Các bước chuyển tiếp' },
              defaultValue: [
                { stepNumber: 'Giai đoạn 1', title: 'Bệnh viện Đa khoa huyện Thới Lai', isHighlight: false },
                { stepNumber: 'Giai đoạn 2', title: 'Trung tâm Y tế huyện Thới Lai', isHighlight: false },
                { stepNumber: 'Giai đoạn 3', title: 'Trung tâm Y tế khu vực Thới Lai', isHighlight: false },
                { stepNumber: 'Hiện tại & Tương lai', title: 'BỆNH VIỆN ĐA KHOA KHU VỰC THỚI LAI', isHighlight: true },
              ],
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'stepNumber', label: 'Tên giai đoạn (VD: Giai đoạn 1)', type: 'text', required: true, admin: { width: '35%' } },
                    { name: 'title', label: 'Tên đơn vị qua các thời kỳ', type: 'text', required: true, admin: { width: '45%' } },
                    { name: 'isHighlight', label: 'Nổi bật (xanh dương)', type: 'checkbox', defaultValue: false, admin: { width: '20%' } },
                  ],
                },
              ],
            },
            {
              name: 'journeyBottomText',
              label: 'Văn bản kết luận hành trình tiếp nối',
              type: 'textarea',
              
              defaultValue: 'Bệnh viện Đa khoa khu vực Thới Lai hôm nay tiếp tục kế thừa những giá trị đã được xây dựng qua nhiều thế hệ cán bộ, viên chức và người lao động; đồng thời không ngừng đổi mới, nâng cao chất lượng chuyên môn, ứng dụng công nghệ và cải tiến phong cách phục vụ, hướng đến mục tiêu chăm sóc sức khỏe người dân ngày càng tốt hơn.',
            },
          ],
        },

        // ================= TAB 6: THÀNH TỰU TIÊU BIỂU =================
        {
          label: '🏆 Thành quả đạt được',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'showAchievements',
                  label: 'Hiển thị khối Thành quả đạt được',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: { width: '30%' },
                },
                {
                  name: 'achievementsKicker',
                  label: 'Nhãn nhỏ',
                  type: 'text',
                  defaultValue: 'THÀNH QUẢ ĐẠT ĐƯỢC',
                  admin: { width: '35%' },
                },
                {
                  name: 'achievementsTitle',
                  label: 'Tiêu đề khối',
                  type: 'text',
                  defaultValue: 'Thành tựu tiêu biểu',
                  admin: { width: '35%' },
                },
              ],
            },
            {
              name: 'achievementsDesc',
              label: 'Mô tả khối',
              type: 'textarea',
              defaultValue: 'Ghi nhận những đóng góp bền bỉ vì sự nghiệp bảo vệ, chăm sóc và nâng cao sức khỏe cộng đồng.',
            },
            {
              name: 'achievements',
              label: 'Các thành tựu tiêu biểu',
              type: 'array',
              labels: { singular: 'Thành tựu', plural: 'Các thành tựu' },
              defaultValue: [
                { title: 'Huân chương & Bằng khen', description: 'Nhiều năm liền nhận Cờ thi đua, Bằng khen của UBND thành phố Cần Thơ và Sở Y tế về thành tích xuất sắc trong công tác chăm sóc sức khỏe nhân dân.' },
                { title: 'Năng lực chuyên môn vững vàng', description: 'Thực hiện thành công hàng ngàn ca phẫu thuật, can thiệp cấp cứu phức tạp mỗi năm, làm chủ nhiều kỹ thuật điều trị tuyến khu vực.' },
                { title: 'Chuyển đổi số & Đổi mới dịch vụ', description: 'Tích hợp hồ sơ bệnh án điện tử, lưu trữ truyền tải hình ảnh số và đặt lịch trực tuyến, giảm thiểu tối đa thời gian chờ đợi cho người dân.' },
              ],
              fields: [
                { name: 'title', label: 'Tiêu đề thành tựu', type: 'text', required: true },
                { name: 'description', label: 'Chi tiết thành tựu', type: 'textarea', required: true },
                { name: 'image', label: 'Ảnh minh họa / Bằng khen / Cúp', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },

        // ================= TAB 7: BÀI VIẾT CHI TIẾT (RICH TEXT) =================
        {
          label: '📖 Bài viết bổ sung (RichText)',
          fields: [
            {
              name: 'showContent',
              label: 'Hiển thị bài viết chi tiết bên dưới',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'content',
              label: 'Nội dung bài viết lịch sử chi tiết',
              type: 'richText',
              admin: {
                description: 'Soạn thảo văn bản chi tiết kèm ảnh, danh sách hoặc bài phát biểu lịch sử.',
              },
            },
          ],
        },

        // ================= TAB 8: HỘP HÀNH ĐỘNG (CTA BOTTOM) =================
        {
          label: '📞 Hộp hành động cuối trang (CTA)',
          fields: [
            {
              name: 'showCta',
              label: 'Hiển thị hộp hành động cuối trang',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'ctaTitle',
                  label: 'Tiêu đề hộp hành động',
                  type: 'text',
                  defaultValue: 'Tiếp tục phát triển vì sức khỏe của bạn và gia đình',
                  admin: { width: '50%' },
                },
                {
                  name: 'ctaDesc',
                  label: 'Đoạn mô tả ngắn',
                  type: 'text',
                  defaultValue: 'Bệnh viện Đa khoa Khu vực Thới Lai luôn sẵn sàng đồng hành, lắng nghe và phục vụ với sự chuyên nghiệp, tận tình nhất.',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'ctaBtnPrimaryText', label: 'Chữ nút chính', type: 'text', defaultValue: 'Xem Sơ đồ tổ chức →', admin: { width: '25%' } },
                { name: 'ctaBtnPrimaryUrl', label: 'Link nút chính', type: 'text', defaultValue: '/so-do-to-chuc', admin: { width: '25%' } },
                { name: 'ctaBtnSecondaryText', label: 'Chữ nút phụ', type: 'text', defaultValue: 'Danh sách Khoa – Phòng', admin: { width: '25%' } },
                { name: 'ctaBtnSecondaryUrl', label: 'Link nút phụ', type: 'text', defaultValue: '/khoa-phong', admin: { width: '25%' } },
              ],
            },
          ],
        },

        // ================= TAB 9: TÙY CHỈNH MÀU SẮC, FONT & KÍCH THƯỚC =================
        {
          label: '🎨 Màu sắc, Font chữ & Căn lề',
          fields: [
            {
              type: 'row',
              fields: [
                colorField('primaryColor', 'Màu chủ đạo trang', '#0878D1', { admin: { width: '50%' } }),
                colorField('accentColor', 'Màu điểm nhấn (Xanh lá)', '#16A36A', { admin: { width: '50%' } }),
              ],
            },
            {
              type: 'row',
              fields: [
                colorField('headingColor', 'Màu tiêu đề các khối', '#102a43', { admin: { width: '33%' } }),
                colorField('textColor', 'Màu chữ đoạn văn / nội dung', '#486581', { admin: { width: '33%' } }),
                colorField('cardBgColor', 'Màu nền các thẻ ô nội dung', '#ffffff', { admin: { width: '34%' } }),
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'fontFamily',
                  label: 'Font chữ trang',
                  type: 'select',
                  enumName: 'hist_font_family',
                  dbName: 'font_family',
                  defaultValue: 'inherit',
                  options: [
                    { label: 'Theo font hệ thống website', value: 'inherit' },
                    { label: 'Arial, Helvetica, sans-serif', value: 'Arial, Helvetica, sans-serif' },
                    { label: '"Segoe UI", Roboto, sans-serif', value: '"Segoe UI", Roboto, sans-serif' },
                    { label: '"Montserrat", sans-serif', value: '"Montserrat", sans-serif' },
                    { label: '"Roboto", sans-serif', value: '"Roboto", sans-serif' },
                    { label: '"Be Vietnam Pro", sans-serif', value: '"Be Vietnam Pro", sans-serif' },
                  ],
                  admin: { width: '50%' },
                },
                {
                  name: 'cardPadding',
                  label: 'Khoảng đệm các ô nội dung (px)',
                  type: 'number',
                  defaultValue: 24,
                  min: 12,
                  max: 48,
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
