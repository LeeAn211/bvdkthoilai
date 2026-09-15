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
      { value: 'pages', label: 'Trang nội dung', actions: contentActions },
      { value: 'news', label: 'Tin tức', actions: contentActions },
      { value: 'notices', label: 'Thông báo', actions: contentActions },
      { value: 'documents', label: 'Văn bản', actions: contentActions },
      { value: 'clinical-protocols', label: 'Phác đồ điều trị', actions: contentActions },
      { value: 'procurement', label: 'Đấu thầu - mua sắm', actions: contentActions },
      { value: 'recruitment', label: 'Tuyển dụng', actions: contentActions },
    ],
  },
  {
    label: 'Tổ chức và chuyên môn',
    modules: [
      { value: 'departments', label: 'Khoa / phòng', actions: dataActions },
      { value: 'specialties', label: 'Chuyên khoa', actions: dataActions },
      { value: 'doctors', label: 'Bác sĩ', actions: dataActions },
    ],
  },
  {
    label: 'Hoạt động bệnh viện',
    modules: [
      { value: 'schedules', label: 'Lịch khám / lịch làm việc', actions: dataActions },
      { value: 'appointments', label: 'Lịch hẹn khám', actions: dataActions },
      { value: 'vaccinations', label: 'Tiêm chủng', actions: dataActions },
      { value: 'services', label: 'Dịch vụ và bảng giá', actions: dataActions },
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
      { value: 'media', label: 'Thư viện tệp', actions: dataActions },
      { value: 'categories', label: 'Danh mục', actions: dataActions },
    ],
  },
]

export const PERMISSION_MODULES = PERMISSION_MODULE_GROUPS.flatMap((group) => group.modules)

export const PERMISSION_MODULE_VALUES = new Set(PERMISSION_MODULES.map((module) => module.value))
