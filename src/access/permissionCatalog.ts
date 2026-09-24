export type PermissionActionValue =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'submit'
  | 'approve'
  | 'publish'
  | 'hide'
  | 'import'
  | 'export'
  | 'restore'

export type PermissionModuleDefinition = {
  actions: PermissionActionValue[]
  description?: string
  label: string
  value: string
}

export type PermissionModuleGroup = {
  label: string
  modules: PermissionModuleDefinition[]
}

export const PERMISSION_ACTION_LABELS: Record<PermissionActionValue, string> = {
  view: 'Truy cập / xem',
  create: 'Tạo mới',
  edit: 'Chỉnh sửa',
  delete: 'Xóa',
  submit: 'Gửi duyệt',
  approve: 'Duyệt',
  publish: 'Xuất bản',
  hide: 'Ẩn nội dung',
  import: 'Nhập dữ liệu',
  export: 'Xuất dữ liệu',
  restore: 'Khôi phục',
}

const contentActions: PermissionActionValue[] = [
  'view',
  'create',
  'edit',
  'delete',
  'submit',
  'approve',
  'publish',
  'hide',
  'import',
  'export',
  'restore',
]

const dataActions: PermissionActionValue[] = [
  'view',
  'create',
  'edit',
  'delete',
  'import',
  'export',
  'restore',
]

const settingsActions: PermissionActionValue[] = ['view', 'edit']

export const PERMISSION_MODULE_GROUPS: PermissionModuleGroup[] = [
  {
    label: 'Giao diện và cấu hình website',
    modules: [
      {
        value: 'homepage',
        label: 'Trang chủ',
        description: 'Nội dung và các khối hiển thị trên trang chủ.',
        actions: settingsActions,
      },
      {
        value: 'site-settings',
        label: 'Cấu hình website',
        description: 'Thông tin chung, chân trang, liên hệ và giao diện.',
        actions: settingsActions,
      },
      {
        value: 'navigation',
        label: 'Menu điều hướng',
        description: 'Quản lý cấu trúc menu của website.',
        actions: settingsActions,
      },
    ],
  },
  {
    label: 'Nội dung và truyền thông',
    modules: [
      { value: 'pages', label: 'Trang tĩnh / Giới thiệu', description: 'Các trang bài viết tĩnh độc lập.', actions: contentActions },
      { value: 'news', label: 'Tin tức & Sự kiện', description: 'Tin tức y tế, hoạt động chung của bệnh viện.', actions: contentActions },
      { value: 'notices', label: 'Thông báo', description: 'Thông báo nội bộ, thông báo người bệnh.', actions: contentActions },
      { value: 'health-warnings', label: 'Cảnh báo y tế khẩn cấp', description: 'Cảnh báo dịch bệnh, an toàn thực phẩm, khuyến cáo cộng đồng.', actions: contentActions },
      { value: 'custom-posts', label: 'Bài viết theo mục Menu', description: 'Bài viết cho các mục chuyên đề mở rộng (Chuyển đổi số, Kế hoạch...).', actions: contentActions },
      { value: 'documents', label: 'Văn bản & Biểu mẫu', description: 'Văn bản quy phạm, quyết định, biểu mẫu công văn.', actions: contentActions },
      { value: 'clinical-protocols', label: 'Phác đồ điều trị', description: 'Hướng dẫn chẩn đoán và phác đồ điều trị chuyên khoa.', actions: contentActions },
      { value: 'procurement', label: 'Đấu thầu - mua sắm', description: 'Thông tin mời thầu, kế hoạch mua sắm trang thiết bị.', actions: contentActions },
      { value: 'recruitment', label: 'Tuyển dụng', description: 'Thông tin tuyển dụng nhân sự.', actions: contentActions },
    ],
  },
  {
    label: 'Tổ chức và chuyên môn',
    modules: [
      { value: 'departments', label: 'Khoa / phòng', description: 'Cơ cấu khoa, phòng ban trong bệnh viện.', actions: dataActions },
      { value: 'specialties', label: 'Chuyên khoa', description: 'Danh mục các chuyên khoa khám chữa bệnh.', actions: dataActions },
      { value: 'doctors', label: 'Bác sĩ & Nhân sự', description: 'Hồ sơ bác sĩ, cán bộ y tế.', actions: dataActions },
      { value: 'advanced-techniques', label: 'Kỹ thuật chuyên sâu', description: 'Kỹ thuật cao, công nghệ y tế hiện đại.', actions: contentActions },
      { value: 'scientific-activities', label: 'Hoạt động khoa học', description: 'Nghiên cứu khoa học, đào tạo, sinh hoạt chuyên môn.', actions: contentActions },
    ],
  },
  {
    label: 'Hoạt động bệnh viện & Lịch',
    modules: [
      { value: 'work-schedules', label: 'Lịch làm việc cơ quan (Lịch tuần BGĐ)', description: 'Lịch công tác tuần của Ban Giám đốc và Cơ quan.', actions: dataActions },
      { value: 'schedules', label: 'Lịch khám bệnh / Lịch trực', description: 'Lịch khám bệnh ngoại trú, lịch trực chuyên môn.', actions: dataActions },
      { value: 'appointments', label: 'Lịch hẹn khám', description: 'Quản lý phiếu đặt lịch khám bệnh trực tuyến.', actions: dataActions },
      { value: 'vaccinations', label: 'Tiêm chủng & Vắc xin', description: 'Lịch tiêm, gói tiêm chủng và bảng giá vắc xin.', actions: dataActions },
      { value: 'services', label: 'Dịch vụ và bảng giá', description: 'Danh mục dịch vụ y tế, bảng giá viện phí.', actions: dataActions },
    ],
  },
  {
    label: 'Tiếp nhận và tương tác',
    modules: [
      { value: 'feedback', label: 'Phản ánh / kiến nghị', actions: dataActions },
      { value: 'consultations', label: 'Tư vấn', actions: dataActions },
      { value: 'faqs', label: 'Câu hỏi thường gặp', actions: contentActions },
      { value: 'forms', label: 'Biểu mẫu trực tuyến', actions: dataActions },
      { value: 'chatbot', label: 'Chatbot', actions: dataActions },
      { value: 'surveys', label: 'Khảo sát', actions: dataActions },
    ],
  },
  {
    label: 'Tài nguyên dùng chung',
    modules: [
      { value: 'media', label: 'Thư viện tệp (Ảnh, PDF)', actions: dataActions },
      { value: 'categories', label: 'Danh mục tin & văn bản', actions: dataActions },
    ],
  },
]

export const PERMISSION_MODULES = PERMISSION_MODULE_GROUPS.flatMap((group) => group.modules)

export const PERMISSION_MODULE_VALUES = new Set(PERMISSION_MODULES.map((module) => module.value))
