import type { Field, GlobalConfig } from 'payload'
import { loggedIn } from '@/access'
import { resolveHomepageLinks } from '@/lib/managedLinks'

// Helper: field màu với ColorPickerField custom component
const colorField = (name: string, label: string, opts?: Partial<Field>): Field => ({
  name,
  label,
  type: 'text',
  admin: {
    components: {
      Field: '/src/components/admin/ColorPickerField#default',
    },
    ...((opts as any)?.admin || {}),
  },
  ...(opts || {}),
} as Field)

const smartLinkFields = (): Field[] => [
  {
    name: 'linkMode',
    label: 'Cách tạo liên kết',
    type: 'select',
    defaultValue: 'internal',
    options: [
      { label: 'Tự tạo trang mới / tự dùng trang đã có cùng slug', value: 'auto-page' },
      { label: 'Chọn một Trang nội dung đã có', value: 'existing-page' },
      { label: 'Nhập đường dẫn nội bộ', value: 'internal' },
      { label: 'Liên kết website bên ngoài', value: 'external' },
    ],
    admin: { description: 'Nếu chưa có trang, chọn Tự tạo trang mới. Nếu trang đã có, chọn trực tiếp để lấy đúng liên kết.' },
  },
  {
    name: 'linkedPage',
    label: 'Chọn trang đã có',
    type: 'relationship',
    relationTo: 'pages',
    admin: { condition: (_data, siblingData) => siblingData?.linkMode === 'existing-page' },
  },
  {
    name: 'newPageTitle',
    label: 'Tên trang sẽ tự tạo',
    type: 'text',
    admin: {
      condition: (_data, siblingData) => siblingData?.linkMode === 'auto-page',
      description: 'Để trống sẽ dùng tiêu đề nội dung. Hệ thống tự sinh slug và tự dùng trang cùng slug nếu đã tồn tại.',
    },
  },
  {
    name: 'newPageSlug',
    label: 'Slug trang mới (không bắt buộc)',
    type: 'text',
    admin: { condition: (_data, siblingData) => siblingData?.linkMode === 'auto-page' },
  },
  {
    name: 'url',
    label: 'Liên kết',
    type: 'text',
    admin: {
      condition: (_data, siblingData) => !siblingData?.linkMode || siblingData?.linkMode === 'internal' || siblingData?.linkMode === 'external',
      description: 'Khi chọn Tự tạo trang hoặc Chọn trang đã có, hệ thống tự sinh trường này lúc lưu.',
    },
  },
]

const defaultHomepageSections = [
  { type: 'featured-news', eyebrow: 'HOẠT ĐỘNG NỔI BẬT TẠI BỆNH VIỆN', title: 'Điểm tin Bệnh viện Đa khoa khu vực Thới Lai', description: 'Các hoạt động chuyên môn, chăm sóc người bệnh và sự kiện tiêu biểu mới nhất.', visible: true },
  { type: 'news-portal', eyebrow: 'CỔNG THÔNG TIN BỆNH VIỆN', title: 'Trang tin tức Bệnh viện', visible: true },
  { type: 'organization', eyebrow: 'TỔ CHỨC BỆNH VIỆN', title: 'Đơn vị trực thuộc', visible: true },
  { type: 'notices', eyebrow: 'THÔNG BÁO', title: 'Thông báo mới từ bệnh viện', description: 'Cập nhật thông tin quan trọng dành cho người bệnh và cộng đồng.', visible: true },
  { type: 'procurement', eyebrow: 'CÔNG KHAI MUA SẮM', title: 'Đấu thầu – Mua sắm', description: 'Thông tin mời thầu, kế hoạch lựa chọn nhà thầu và kết quả mua sắm.', visible: true },
  { type: 'schedules', eyebrow: 'THÔNG TIN KHÁM BỆNH', title: 'Lịch khám bệnh', description: 'Tra cứu bác sĩ, chuyên khoa, thời gian và phòng khám trước khi đến bệnh viện.', visible: true, scheduleTabOrder: [{ tab: 'attachments', visible: true }, { tab: 'daily', visible: true }, { tab: 'weekly', visible: true }] },
  { type: 'vaccinations', eyebrow: 'TIÊM NGỪA AN TOÀN', title: 'Thông tin tiêm ngừa', description: 'Thông báo lịch tiêm chung, các đợt tiêm và danh mục vắc xin tại bệnh viện.', visible: true, vaccinationTabOrder: [{ tab: 'announcements', visible: true }, { tab: 'campaigns', visible: true }, { tab: 'vaccines', visible: true }] },
  { type: 'science', eyebrow: 'CHUYÊN MÔN – ĐÀO TẠO', title: 'Hoạt động khoa học', visible: true },
  { type: 'introduction', eyebrow: 'VỀ CHÚNG TÔI', title: 'Đồng hành cùng sức khỏe cộng đồng', visible: true },
  { type: 'documents', eyebrow: 'TÀI LIỆU CÔNG KHAI', title: 'Văn bản mới', description: 'Quyết định, biểu mẫu và tài liệu được cập nhật từ hệ thống quản trị.', visible: true },
]

const defaultNewsTabs = [
  { label: 'Tin bệnh viện', values: [{ value: 'Hoạt động bệnh viện' }] },
  { label: 'Tin y tế', values: [{ value: 'Tin y tế' }] },
  { label: 'Kiến thức sức khỏe', values: [{ value: 'Kiến thức sức khỏe' }, { value: 'Thông tin cho người bệnh' }] },
  { label: 'Đào tạo – nghiên cứu', values: [{ value: 'Đào tạo – nghiên cứu' }, { value: 'Đào tạo – Tập huấn' }, { value: 'Hội nghị – Hội thảo' }] },
]

const defaultScienceTabs = [
  { label: 'Đào tạo – Tập huấn', values: [{ value: 'Đào tạo – Tập huấn' }, { value: 'Đào tạo – nghiên cứu' }] },
  { label: 'Hội nghị – Hội thảo', values: [{ value: 'Hội nghị – Hội thảo' }] },
  { label: 'Kiến thức y khoa', values: [{ value: 'Kiến thức sức khỏe' }] },
]

const defaultDepartmentTabs = [
  { label: 'Khối lâm sàng', values: [{ value: 'clinical' }, { value: 'department' }] },
  { label: 'Khối cận lâm sàng', values: [{ value: 'paraclinical' }] },
  { label: 'Phòng chức năng', values: [{ value: 'office' }] },
]

const defaultScheduleTabs = [
  { label: 'Lịch đính kèm', tab: 'attachments', visible: true },
  { label: 'Theo ngày', tab: 'daily', visible: true },
  { label: 'Theo tuần', tab: 'weekly', visible: true },
]

const defaultVaccinationTabs = [
  { label: 'Thông báo lịch tiêm', tab: 'announcements', visible: true },
  { label: 'Tiêm ngừa theo đợt', tab: 'campaigns', visible: true },
  { label: 'Các loại vắc xin', tab: 'vaccines', visible: true },
]

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Giao diện & bố cục trang chủ',
  admin: {
    group: 'Trang chủ & Giao diện',
    description: 'Quản lý banner, nội dung, thứ tự, màu sắc và cỡ chữ của các mục trên trang chủ.',
  },
  access: { read: () => true, update: loggedIn },
  versions: { drafts: true, max: 20 },
  hooks: {
    beforeChange: [async ({ data, req }) => resolveHomepageLinks(req, data)],
  },
  // Không dùng afterRead để tự bổ sung section đã bị xóa.
  // defaultValue bên dưới chỉ seed cấu hình lần đầu; sau đó Admin có toàn quyền
  // thêm/xóa/ẩn/hiện/sắp xếp mà frontend phải tôn trọng đúng dữ liệu đã lưu.
  fields: [
    {
      name: 'hero',
      label: 'Banner mặc định (dự phòng)',
      type: 'group',
      fields: [
        { name: 'eyebrow', label: 'Nhãn nhỏ', type: 'text', defaultValue: 'BỆNH VIỆN ĐA KHOA KHU VỰC THỚI LAI' },
        { name: 'title', label: 'Tiêu đề', type: 'text', defaultValue: 'Chăm sóc sức khỏe tận tâm, thuận tiện và an toàn' },
        { name: 'description', label: 'Mô tả', type: 'textarea' },
        { name: 'desktopImage', label: 'Ảnh Desktop', type: 'upload', relationTo: 'media', admin: { description: 'Tải ảnh mới hoặc chọn lại từ Thư viện Tệp & Hình ảnh.' } },
        { name: 'mobileImage', label: 'Ảnh Mobile', type: 'upload', relationTo: 'media', admin: { description: 'Tải ảnh mới hoặc chọn lại từ Thư viện Tệp & Hình ảnh.' } },
      ],
    },
    {
      name: 'banners',
      label: 'Banner trang chủ',
      type: 'array',
      maxRows: 10,
      admin: { description: 'Thêm nhiều banner và kéo thả để đổi thứ tự. Website tự chuyển lần lượt theo số giây cấu hình bên dưới. Ảnh có thể tải mới hoặc chọn lại từ Thư viện Tệp & Hình ảnh.' },
      defaultValue: [
        { eyebrow: 'BỆNH VIỆN ĐA KHOA KHU VỰC THỚI LAI', title: 'Chăm sóc sức khỏe tận tâm, thuận tiện và an toàn', description: 'Tra cứu lịch khám, dịch vụ y tế và thông tin bệnh viện nhanh chóng.', buttonLabel: 'Xem lịch khám', buttonUrl: '/lich-kham' },
        { eyebrow: 'TIÊM CHỦNG AN TOÀN', title: 'Theo dõi lịch tiêm chủng và đăng ký thuận tiện', description: 'Cập nhật lịch tiêm và các hướng dẫn cần thiết cho người dân.', buttonLabel: 'Xem lịch tiêm', buttonUrl: '/tiem-chung' },
        { eyebrow: 'DỊCH VỤ Y TẾ', title: 'Chủ động đặt lịch khám trực tuyến', description: 'Lựa chọn thời gian phù hợp và chuẩn bị thông tin trước khi đến khám.', buttonLabel: 'Đặt lịch khám', buttonUrl: 'https://medpro.vn/' },
      ],
      fields: [
        { name: 'eyebrow', label: 'Nhãn nhỏ', type: 'text', required: true },
        { name: 'title', label: 'Tiêu đề banner', type: 'text', required: true },
        { name: 'description', label: 'Mô tả', type: 'textarea' },
        { name: 'desktopImage', label: 'Ảnh banner Desktop', type: 'upload', relationTo: 'media', admin: { description: 'Tải banner mới hoặc chọn lại banner đã có trong thư viện.' } },
        { name: 'mobileImage', label: 'Ảnh banner Mobile', type: 'upload', relationTo: 'media', admin: { description: 'Không bắt buộc. Tải mới hoặc chọn lại ảnh mobile đã có trong thư viện.' } },
        { name: 'buttonLabel', label: 'Nhãn nút', type: 'text' },
        { name: 'buttonUrl', label: 'Liên kết nút', type: 'text' },
        { name: 'visible', label: 'Hiển thị', type: 'checkbox', defaultValue: true },
      ],
    },
    {
      name: 'showHeroBanners',
      label: 'Hiển thị banner lớn dưới menu',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Bỏ dấu chọn để ẩn toàn bộ banner dưới menu. Các banner đã nhập vẫn được giữ nguyên để bật lại sau.' },
    },
    {
      name: 'bannerAutoplaySeconds',
      label: 'Thời gian tự chuyển banner (giây)',
      type: 'number',
      min: 2,
      max: 30,
      defaultValue: 6,
      admin: { description: 'Khuyên dùng 5–7 giây. Chỉ áp dụng khi có từ 2 banner đang hiển thị.' },
    },
    {
      name: 'quickLinks',
      label: 'Dịch vụ nhanh trên trang chủ',
      admin: { description: 'Quản lý toàn bộ các ô dịch vụ nhanh. Có thể thêm/xóa, bật/tắt, kéo thả đổi thứ tự và chọn icon có sẵn hoặc hình riêng từ Media cho từng mục.' },
      type: 'array',
      maxRows: 12,
      fields: [
        { name: 'visible', label: 'Hiển thị mục này', type: 'checkbox', defaultValue: true },
        { name: 'title', label: 'Tên dịch vụ', type: 'text', required: true },
        { name: 'description', label: 'Mô tả ngắn', type: 'text' },
        { name: 'url', label: 'Liên kết khi bấm', type: 'text', required: true },
        { name: 'openNewTab', label: 'Mở liên kết ở tab mới', type: 'checkbox', defaultValue: false },
        {
          name: 'visualMode',
          label: 'Kiểu hình hiển thị',
          type: 'select',
          defaultValue: 'icon',
          options: [
            { label: 'Dùng icon có sẵn', value: 'icon' },
            { label: 'Dùng hình tải lên', value: 'image' },
          ],
        },
        {
          name: 'icon',
          label: 'Icon có sẵn',
          type: 'select',
          defaultValue: 'calendar',
          admin: { condition: (_data: unknown, siblingData: any) => siblingData?.visualMode !== 'image' },
          options: [
            { label: 'Lịch', value: 'calendar' },
            { label: 'Bác sĩ', value: 'doctor' },
            { label: 'Bảng giá', value: 'price' },
            { label: 'BHYT', value: 'insurance' },
            { label: 'Bệnh viện', value: 'hospital' },
            { label: 'Bản đồ', value: 'map' },
            { label: 'Điện thoại', value: 'phone' },
            { label: 'Tài liệu', value: 'document' },
          ],
        },
        {
          name: 'image',
          label: 'Hình / icon riêng',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (_data: unknown, siblingData: any) => siblingData?.visualMode === 'image',
            description: 'Có thể tải PNG, JPG, WebP hoặc SVG vào Thư viện Media rồi chọn lại tại đây. Khuyên dùng ảnh/icon vuông nền trong suốt.',
          },
        },
        {
          name: 'imageFit',
          label: 'Cách vừa khung hình',
          type: 'select',
          defaultValue: 'contain',
          admin: { condition: (_data: unknown, siblingData: any) => siblingData?.visualMode === 'image' },
          options: [
            { label: 'Hiện toàn bộ hình (không cắt)', value: 'contain' },
            { label: 'Phủ đầy khung (có thể cắt mép)', value: 'cover' },
          ],
        },
      ],
    },
    {
      name: 'intro',
      label: 'Giới thiệu ngắn',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'VỀ CHÚNG TÔI' },
        { name: 'title', type: 'text', defaultValue: 'Đồng hành cùng sức khỏe cộng đồng' },
        { name: 'description', type: 'textarea' },
        { name: 'image', label: 'Hình ảnh', type: 'upload', relationTo: 'media', admin: { description: 'Tải ảnh mới hoặc chọn lại từ Thư viện Tệp & Hình ảnh.' } },
      ],
    },
    {
      name: 'stats',
      label: 'Số liệu nổi bật',
      type: 'array',
      maxRows: 6,
      fields: [
        { name: 'value', label: 'Số liệu', type: 'text', required: true },
        { name: 'label', label: 'Nhãn', type: 'text', required: true },
      ],
    },
    {
      name: 'sections',
      label: 'Bố cục & giao diện các mục trang chủ',
      type: 'array',
      admin: {
        description: 'Kéo thả để sắp xếp thứ tự. Mỗi section có công tắc Hiển thị/Ẩn; khi tắt, section không xuất hiện trên website nhưng toàn bộ cấu hình vẫn được giữ lại để bật lại sau.',
        initCollapsed: true,
      },
      defaultValue: defaultHomepageSections,
      fields: [
        {
          name: 'type',
          label: 'Mục trang chủ',
          type: 'select',
          required: true,
          options: [
            { label: 'Hoạt động nổi bật tại bệnh viện', value: 'featured-news' },
            { label: 'Cổng thông tin bệnh viện', value: 'news-portal' },
            { label: 'Tổ chức bệnh viện', value: 'organization' },
            { label: 'Thông báo', value: 'notices' },
            { label: 'Lịch khám', value: 'schedules' },
            { label: 'Thông tin tiêm ngừa', value: 'vaccinations' },
            { label: 'Đấu thầu – Mua sắm', value: 'procurement' },
            { label: 'Hoạt động khoa học', value: 'science' },
            { label: 'Giới thiệu bệnh viện', value: 'introduction' },
            { label: 'Văn bản mới', value: 'documents' },
            { label: 'Mục nội dung từ Menu (ví dụ: Chuyển đổi số)', value: 'content-section' },
            { label: 'Mục nội dung tùy chỉnh (thêm mới)', value: 'custom' },
            { label: 'Module động từ thư viện', value: 'dynamic-module' },
          ],
        },
        {
          name: 'visible',
          label: 'Hiển thị section trên trang chủ',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Bỏ dấu chọn để ẩn section khỏi website. Nội dung và cấu hình của section vẫn được giữ nguyên trong Admin.' },
        },
        { name: 'eyebrow', label: 'Nhãn nhỏ phía trên', type: 'text', admin: { condition: (_data, siblingData) => siblingData?.visible !== false } },
        { name: 'title', label: 'Tiêu đề lớn', type: 'text', admin: { condition: (_data, siblingData) => siblingData?.visible !== false } },
        { name: 'description', label: 'Dòng mô tả', type: 'textarea', admin: { condition: (_data, siblingData) => siblingData?.visible !== false } },
        { name: 'carouselSeconds', label: 'Thời gian chuyển nội dung nổi bật (giây)', type: 'number', min: 2.5, max: 20, defaultValue: 4.5, admin: { condition: (_data, siblingData) => siblingData?.type === 'featured-news', description: 'Điểm tin nổi bật tự động chuyển qua Tin tức, Thông báo, Đấu thầu – Mua sắm và Lịch khám mới.' } },
        { name: 'featuredItemLimit', label: 'Tổng số nội dung tham gia chuyển động', type: 'number', min: 4, max: 40, defaultValue: 16, admin: { condition: (_data, siblingData) => siblingData?.type === 'featured-news', description: 'Khung ngoài luôn hiển thị 4 card trên desktop. Số này quy định tổng số nội dung được đưa vào vòng chuyển động, ví dụ 8, 12, 16, 20...' } },
        { name: 'organizationImage', label: 'Hình ảnh giữa khối Chuyên khoa', type: 'upload', relationTo: 'media', admin: { condition: (_data, siblingData) => siblingData?.type === 'organization', description: 'Tải ảnh mới hoặc chọn ảnh đã có trong thư viện. Ảnh hiển thị ở giữa danh sách chuyên khoa và khối Medpro.' } },
        {
          name: 'organizationMedpro',
          label: 'Khối Đặt lịch khám qua Medpro',
          type: 'group',
          admin: { condition: (_data, siblingData) => siblingData?.type === 'organization', description: 'Toàn bộ nội dung khối Medpro phía phải có thể chỉnh hoặc ẩn tại đây.' },
          fields: [
            { name: 'enabled', label: 'Hiển thị khối Medpro', type: 'checkbox', defaultValue: true },
            { name: 'eyebrow', label: 'Nhãn nhỏ', type: 'text', defaultValue: 'ĐẶT LỊCH KHÁM QUA MEDPRO' },
            { name: 'title', label: 'Tiêu đề', type: 'text', defaultValue: 'Chủ động thời gian – Giảm thời gian chờ đợi' },
            { name: 'bullet1', label: 'Dòng lợi ích 1', type: 'text', defaultValue: 'Đặt lịch nhanh chóng' },
            { name: 'bullet2', label: 'Dòng lợi ích 2', type: 'text', defaultValue: 'Chọn bác sĩ theo nhu cầu' },
            { name: 'bullet3', label: 'Dòng lợi ích 3', type: 'text', defaultValue: 'Nhận nhắc hẹn tự động' },
            { name: 'brandText', label: 'Chữ thương hiệu', type: 'text', defaultValue: 'Medpro' },
            { name: 'buttonLabel', label: 'Tên nút đặt lịch', type: 'text', defaultValue: 'ĐẶT LỊCH NGAY' },
            { name: 'buttonUrl', label: 'Liên kết nút đặt lịch', type: 'text', admin: { description: 'Để trống sẽ dùng liên kết Medpro chung trong Cấu hình website.' } },
            { name: 'openNewTab', label: 'Mở Medpro ở tab mới', type: 'checkbox', defaultValue: true },
            { name: 'guideLabel', label: 'Tên liên kết hướng dẫn', type: 'text', defaultValue: 'Hướng dẫn đặt lịch khám' },
            { name: 'guideUrl', label: 'Liên kết hướng dẫn', type: 'text', defaultValue: '/lich-kham' },
            { name: 'backgroundColor', label: 'Màu nền khối Medpro', type: 'text', admin: { placeholder: '#effbf3' } },
          ],
        },
        {
          name: 'contentTabs',
          dbName: 'content_tabs',
          label: 'Các tab nội dung',
          type: 'array',
          admin: {
            condition: (_data, siblingData) => siblingData?.type === 'news-portal' || siblingData?.type === 'science',
            description: 'Thêm, xóa hoặc kéo thả để sắp xếp tab. Tên tab, chuyên mục và nội dung thủ công đều có thể tự nhập; hàng để trống sẽ được bỏ qua khi hiển thị.',
          },
          fields: [
            { name: 'label', label: 'Tên tab', type: 'text', admin: { placeholder: 'Ví dụ: Tin y tế' } },
            {
              name: 'values',
              dbName: 'content_values',
              label: 'Chuyên mục bài viết trong tab',
              type: 'array',
              fields: [{ name: 'value', label: 'Tên chuyên mục', type: 'text' }],
            },
            {
              name: 'manualItems',
              dbName: 'news_manual',
              label: 'Nội dung thêm thủ công (không bắt buộc)',
              type: 'array',
              fields: [
                { name: 'title', label: 'Tiêu đề', type: 'text' },
                { name: 'description', label: 'Mô tả ngắn', type: 'textarea' },
                ...smartLinkFields(),
                { name: 'image', label: 'Hình ảnh', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
        {
          name: 'departmentTabs',
          dbName: 'dept_tabs',
          label: 'Các tab Đơn vị trực thuộc',
          type: 'array',
          admin: {
            condition: () => false,
            description: 'Thiết lập cũ đã ngừng dùng. Trang chủ hiện lấy trực tiếp danh sách Chuyên khoa.',
          },
          fields: [
            { name: 'label', label: 'Tên tab', type: 'text', admin: { placeholder: 'Ví dụ: Khối lâm sàng' } },
            {
              name: 'values',
              dbName: 'dept_values',
              label: 'Loại đơn vị có sẵn (không bắt buộc)',
              type: 'array',
              fields: [{ name: 'value', label: 'Tên loại / nhóm đơn vị', type: 'text' }],
            },
            {
              name: 'manualItems',
              dbName: 'dept_manual',
              label: 'Đơn vị thêm thủ công (không bắt buộc)',
              type: 'array',
              fields: [
                { name: 'title', label: 'Tên đơn vị', type: 'text' },
                { name: 'description', label: 'Mô tả ngắn', type: 'textarea' },
                ...smartLinkFields(),
              ],
            },
          ],
        },
        {
          name: 'scheduleTabOrder',
          label: 'Thứ tự các tab Lịch khám',
          type: 'array',
          admin: {
            condition: (_data, siblingData) => siblingData?.type === 'schedules',
            description: 'Kéo thả để đổi vị trí; bỏ dấu Hiển thị nếu muốn ẩn một tab.',
          },
          defaultValue: defaultScheduleTabs,
          fields: [
            { name: 'label', label: 'Tên tab', type: 'text', admin: { placeholder: 'Có thể tự nhập tên tab' } },
            { name: 'tab', label: 'Nguồn dữ liệu có sẵn (không bắt buộc)', type: 'select', options: [
              { label: 'Lịch đính kèm', value: 'attachments' },
              { label: 'Theo ngày', value: 'daily' },
              { label: 'Theo tuần', value: 'weekly' },
            ] },
            { name: 'visible', label: 'Hiển thị tab', type: 'checkbox', defaultValue: true },
            {
              name: 'manualItems',
              dbName: 'schedule_manual',
              label: 'Nội dung thêm thủ công (không bắt buộc)',
              type: 'array',
              fields: [
                { name: 'title', label: 'Tiêu đề', type: 'text' },
                { name: 'description', label: 'Mô tả', type: 'textarea' },
                ...smartLinkFields(),
                { name: 'image', label: 'Hình ảnh', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
        {
          name: 'vaccinationTabOrder',
          label: 'Thứ tự các tab Tiêm ngừa',
          type: 'array',
          admin: {
            condition: (_data, siblingData) => siblingData?.type === 'vaccinations',
            description: 'Kéo thả để đổi thứ tự; có thể tắt từng tab khi chưa cần hiển thị.',
          },
          defaultValue: defaultVaccinationTabs,
          fields: [
            { name: 'label', label: 'Tên tab', type: 'text', admin: { placeholder: 'Có thể tự nhập tên tab' } },
            { name: 'tab', label: 'Nguồn dữ liệu có sẵn (không bắt buộc)', type: 'select', options: [
              { label: 'Thông báo lịch tiêm', value: 'announcements' },
              { label: 'Tiêm ngừa theo đợt', value: 'campaigns' },
              { label: 'Các loại vắc xin', value: 'vaccines' },
            ] },
            { name: 'visible', label: 'Hiển thị tab', type: 'checkbox', defaultValue: true },
            {
              name: 'manualItems',
              dbName: 'vaccine_manual',
              label: 'Nội dung thêm thủ công (không bắt buộc)',
              type: 'array',
              fields: [
                { name: 'title', label: 'Tiêu đề', type: 'text' },
                { name: 'description', label: 'Mô tả', type: 'textarea' },
                ...smartLinkFields(),
                { name: 'image', label: 'Hình ảnh', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },

        {
          name: 'linkedContentSection',
          label: 'Mục nội dung cần hiển thị',
          type: 'relationship',
          relationTo: 'content-sections',
          admin: {
            condition: (_data, siblingData) => siblingData?.type === 'content-section',
            description: 'Chọn mục đã được tạo từ Menu, ví dụ Chuyển đổi số. Các bài thuộc mục này sẽ tự động hiển thị trên section và nút Xem tất cả sẽ trỏ đúng /chuyen-doi-so.',
          },
        },
        {
          name: 'linkedContentLimit',
          label: 'Số bài hiển thị trong section',
          type: 'number',
          min: 1,
          max: 12,
          defaultValue: 5,
          admin: {
            condition: (_data, siblingData) => siblingData?.type === 'content-section',
            description: 'Khuyến nghị 5 bài: 1 bài lớn + 4 bài nhỏ, đồng bộ Thông báo và Đấu thầu.',
          },
        },
        {
          name: 'dynamicModule',
          label: 'Module động',
          type: 'relationship',
          relationTo: 'dynamic-modules',
          admin: {
            condition: (_data, siblingData) => siblingData?.type === 'dynamic-module',
            description: 'Chọn module được quản lý trong Nội dung → Module động. Có thể tái sử dụng cùng một module ở nhiều vị trí.',
          },
        },
        {
          name: 'customContent',
          label: 'Nội dung chi tiết của mục mới',
          type: 'richText',
          admin: {
            condition: (_data, siblingData) => siblingData?.type === 'custom',
            description: 'Soạn nội dung hiển thị trực tiếp trên trang chủ.',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'customImage',
              label: 'Ảnh của mục mới',
              type: 'upload',
              relationTo: 'media',
              admin: { condition: (_data, siblingData) => siblingData?.type === 'custom', width: '50%', description: 'Tải ảnh mới hoặc chọn lại từ Thư viện Tệp & Hình ảnh.' },
            },
            {
              name: 'imagePosition',
              label: 'Vị trí ảnh',
              type: 'select',
              defaultValue: 'left',
              options: [{ label: 'Bên trái', value: 'left' }, { label: 'Bên phải', value: 'right' }, { label: 'Phía trên', value: 'top' }],
              admin: { condition: (_data, siblingData) => siblingData?.type === 'custom', width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'buttonLabel', label: 'Tên nút', type: 'text', admin: { condition: (_data, siblingData) => siblingData?.type === 'custom', width: '50%', placeholder: 'Xem chi tiết' } },
            {
              name: 'buttonLinkMode', label: 'Cách tạo liên kết nút', type: 'select', defaultValue: 'internal',
              options: [
                { label: 'Tự tạo trang mới / dùng trang cùng slug đã có', value: 'auto-page' },
                { label: 'Chọn Trang nội dung đã có', value: 'existing-page' },
                { label: 'Nhập đường dẫn nội bộ', value: 'internal' },
                { label: 'Liên kết ngoài', value: 'external' },
              ],
              admin: { condition: (_data, siblingData) => siblingData?.type === 'custom', width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'buttonPage', label: 'Chọn trang đã có', type: 'relationship', relationTo: 'pages', admin: { condition: (_data, siblingData) => siblingData?.type === 'custom' && siblingData?.buttonLinkMode === 'existing-page', width: '50%' } },
            { name: 'buttonNewPageTitle', label: 'Tên trang sẽ tự tạo', type: 'text', admin: { condition: (_data, siblingData) => siblingData?.type === 'custom' && siblingData?.buttonLinkMode === 'auto-page', width: '50%', description: 'Để trống sẽ lấy tiêu đề section.' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'buttonNewPageSlug', label: 'Slug trang mới (không bắt buộc)', type: 'text', admin: { condition: (_data, siblingData) => siblingData?.type === 'custom' && siblingData?.buttonLinkMode === 'auto-page', width: '50%' } },
            { name: 'buttonUrl', label: 'Liên kết nút', type: 'text', admin: { condition: (_data, siblingData) => siblingData?.type === 'custom' && (!siblingData?.buttonLinkMode || siblingData?.buttonLinkMode === 'internal' || siblingData?.buttonLinkMode === 'external'), width: '50%', placeholder: '/trang/duong-dan', description: 'Chế độ tự tạo/chọn trang sẽ tự điền liên kết khi lưu.' } },
          ],
        },
        {
          type: 'row',
          fields: [
            colorField('eyebrowColor', 'Màu nhãn nhỏ', { admin: { placeholder: '#0878d1', width: '25%' } }),
            colorField('titleColor', 'Màu tiêu đề', { admin: { placeholder: '#143653', width: '25%' } }),
            colorField('descriptionColor', 'Màu mô tả', { admin: { placeholder: '#647f94', width: '25%' } }),
            colorField('backgroundColor', 'Màu nền mục', { admin: { placeholder: '#ffffff', width: '25%' } }),
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'eyebrowSize', label: 'Cỡ nhãn nhỏ (px)', type: 'number', min: 8, max: 40, admin: { width: '25%' } },
            { name: 'titleSize', label: 'Cỡ tiêu đề (px)', type: 'number', min: 18, max: 72, admin: { width: '25%' } },
            { name: 'descriptionSize', label: 'Cỡ mô tả (px)', type: 'number', min: 10, max: 36, admin: { width: '25%' } },
            {
              name: 'fontFamily',
              label: 'Font chữ tiêu đề',
              type: 'select',
              admin: { width: '25%' },
              options: [
                { label: 'Mặc định hệ thống', value: '' },
                { label: 'Inter', value: 'Inter, sans-serif' },
                { label: 'Roboto', value: 'Roboto, sans-serif' },
                { label: 'Outfit', value: 'Outfit, sans-serif' },
                { label: 'Be Vietnam Pro', value: '"Be Vietnam Pro", sans-serif' },
                { label: 'Montserrat', value: 'Montserrat, sans-serif' },
                { label: 'Open Sans', value: '"Open Sans", sans-serif' },
                { label: 'Source Serif 4', value: '"Source Serif 4", serif' },
                { label: 'Merriweather', value: 'Merriweather, serif' },
              ],
            },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'paddingTop', label: 'Khoảng cách phía trên (px)', type: 'number', min: 0, max: 200, defaultValue: 42, admin: { width: '25%' } },
            { name: 'paddingBottom', label: 'Khoảng cách phía dưới (px)', type: 'number', min: 0, max: 200, defaultValue: 42, admin: { width: '25%' } },
            { name: 'contentWidth', label: 'Độ rộng nội dung (px)', type: 'number', min: 680, max: 1600, defaultValue: 1180, admin: { width: '25%' } },
            { name: 'headingGap', label: 'Cách tiêu đề với nội dung (px)', type: 'number', min: 0, max: 100, defaultValue: 18, admin: { width: '25%' } },
          ],
        },
      ],
    },
  ],
}
