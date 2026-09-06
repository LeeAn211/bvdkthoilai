import type { Access, FieldAccess, Where } from 'payload'

export type Role =
  | 'super-admin'
  | 'system-admin'
  | 'board'
  | 'admin'
  | 'editor'
  | 'reviewer'
  | 'department'
  | 'department-manager'
  | 'hr'
  | 'finance'
  | 'procurement'
  | 'clinic-schedule'
  | 'vaccination'
  | 'quality-management'

export type PermissionAction =
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

const roleOf = (user: any): Role | undefined => user?.role

export const isActiveUser = (user: any): boolean => Boolean(user) && (user.status == null || user.status === 'active')

const isElevatedRole = (role?: Role) =>
  role === 'super-admin' || role === 'system-admin' || role === 'admin'

export const anyone: Access = () => true
export const loggedIn: Access = ({ req }) => isActiveUser(req.user)

export const ownUserOrAdmins: Access = ({ req }) => {
  const user = req.user
  if (!isActiveUser(user) || !user) return false
  if (isElevatedRole(roleOf(user))) return true
  return { id: { equals: user.id } }
}

export const publicActive: Access = ({ req }) => {
  if (isActiveUser(req.user)) return true
  return { active: { equals: true } }
}

export const publicPublished: Access = ({ req }) => {
  if (isActiveUser(req.user)) return true

  const where: Where = {
    _status: {
      equals: 'published',
    },
  }

  return where
}

export const admins: Access = ({ req }) => isActiveUser(req.user) && isElevatedRole(roleOf(req.user))

export const superAdmins: Access = ({ req }) => isActiveUser(req.user) && roleOf(req.user) === 'super-admin'

export const publishers: Access = ({ req }) =>
  isActiveUser(req.user) && ['super-admin', 'system-admin', 'admin', 'reviewer'].includes(roleOf(req.user) || '')

export const editors: Access = ({ req }) =>
  isActiveUser(req.user) && [
    'super-admin',
    'system-admin',
    'admin',
    'editor',
    'reviewer',
    'department',
    'department-manager',
  ].includes(roleOf(req.user) || '')

export const procurementTeam: Access = ({ req }) =>
  isActiveUser(req.user) && ['super-admin', 'system-admin', 'admin', 'procurement'].includes(roleOf(req.user) || '')

export const adminField: FieldAccess = ({ req }) => isActiveUser(req.user) && isElevatedRole(roleOf(req.user))

/**
 * Kiểm tra quyền bổ sung được cấu hình trực tiếp trên tài khoản.
 * Super Admin/System Admin/Admin luôn có toàn quyền. Các module sẽ được
 * chuyển dần sang helper này trong các giai đoạn tiếp theo để tránh phá
 * quyền hiện tại khi nâng cấp từ 3.2.x.
 */
const moduleRoleDefaults: Record<string, Partial<Record<PermissionAction, Role[]>>> = {
  news: { view: ['editor', 'reviewer', 'department', 'department-manager'], create: ['editor', 'reviewer', 'department', 'department-manager'], edit: ['editor', 'reviewer', 'department', 'department-manager'], delete: ['reviewer'], submit: ['editor', 'department', 'department-manager'], approve: ['reviewer'], publish: ['reviewer'], hide: ['reviewer'], restore: ['reviewer'] },
  notices: { view: ['editor', 'reviewer', 'department', 'department-manager'], create: ['editor', 'reviewer', 'department', 'department-manager'], edit: ['editor', 'reviewer', 'department', 'department-manager'], delete: ['reviewer'], submit: ['editor', 'department', 'department-manager'], approve: ['reviewer'], publish: ['reviewer'], hide: ['reviewer'], restore: ['reviewer'] },
  documents: { view: ['editor', 'reviewer', 'department', 'department-manager'], create: ['editor', 'reviewer', 'department', 'department-manager'], edit: ['editor', 'reviewer', 'department', 'department-manager'], delete: ['reviewer'], publish: ['reviewer'], restore: ['reviewer'] },
  pages: { view: ['editor', 'reviewer'], create: ['editor', 'reviewer'], edit: ['editor', 'reviewer'], delete: ['reviewer'], submit: ['editor'], approve: ['reviewer'], publish: ['reviewer'], hide: ['reviewer'], restore: ['reviewer'] },
  procurement: { view: ['procurement'], create: ['procurement'], edit: ['procurement'], delete: ['procurement'], submit: ['procurement'], approve: ['procurement'], publish: ['procurement'], hide: ['procurement'], import: ['procurement'], export: ['procurement'], restore: ['procurement'] },
  recruitment: { view: ['hr'], create: ['hr'], edit: ['hr'], delete: ['hr'], submit: ['hr'], approve: ['hr'], publish: ['hr'], hide: ['hr'], import: ['hr'], export: ['hr'], restore: ['hr'] },
  departments: { view: ['hr', 'department', 'department-manager'], create: ['hr'], edit: ['hr', 'department', 'department-manager'], delete: ['hr'] },
  specialties: { view: ['hr', 'department', 'department-manager'], create: ['hr', 'department-manager'], edit: ['hr', 'department', 'department-manager'], delete: ['hr'], publish: ['hr', 'department-manager'] },
  doctors: { view: ['hr', 'department', 'department-manager'], create: ['hr', 'department', 'department-manager'], edit: ['hr', 'department', 'department-manager'], delete: ['hr'], import: ['hr'], export: ['hr'] },
  schedules: { view: ['clinic-schedule', 'department-manager'], create: ['clinic-schedule'], edit: ['clinic-schedule'], delete: ['clinic-schedule'], publish: ['clinic-schedule'], import: ['clinic-schedule'], export: ['clinic-schedule'] },
  vaccinations: { view: ['vaccination'], create: ['vaccination'], edit: ['vaccination'], delete: ['vaccination'], publish: ['vaccination'], import: ['vaccination'], export: ['vaccination'] },
  services: { view: ['finance'], create: ['finance'], edit: ['finance'], delete: ['finance'], publish: ['finance'], import: ['finance'], export: ['finance'] },
  feedback: { view: ['quality-management', 'department-manager'], create: ['quality-management'], edit: ['quality-management', 'department-manager'], delete: ['quality-management'], export: ['quality-management'] },
  consultations: { view: ['quality-management'], create: ['quality-management'], edit: ['quality-management'], delete: ['quality-management'] },
  faqs: { view: ['quality-management', 'editor', 'reviewer'], create: ['quality-management'], edit: ['quality-management'], delete: ['quality-management'], import: ['quality-management'] },
  forms: { view: ['quality-management'], create: ['quality-management'], edit: ['quality-management'], delete: ['quality-management'], export: ['quality-management'] },
  chatbot: { view: ['quality-management'], create: ['quality-management'], edit: ['quality-management'], delete: ['quality-management'], import: ['quality-management'], export: ['quality-management'] },
  surveys: { view: ['quality-management'], create: ['quality-management'], edit: ['quality-management'], delete: ['quality-management'], publish: ['quality-management'], export: ['quality-management'] },
  media: { view: ['editor', 'reviewer', 'department', 'department-manager', 'hr', 'finance', 'procurement', 'clinic-schedule', 'vaccination', 'quality-management'], create: ['editor', 'reviewer', 'department', 'department-manager', 'hr', 'finance', 'procurement', 'clinic-schedule', 'vaccination', 'quality-management'], edit: ['editor', 'reviewer', 'department-manager'], delete: ['reviewer'] },
  categories: { view: ['editor', 'reviewer'], create: ['reviewer'], edit: ['reviewer'], delete: ['reviewer'], restore: ['reviewer'] },
}

export const roleHasModulePermission = (user: any, module: string, action: PermissionAction): boolean => {
  if (!isActiveUser(user)) return false
  const role = roleOf(user)
  if (isElevatedRole(role)) return true
  const allowed = moduleRoleDefaults[module]?.[action] || []
  return Boolean(role && allowed.includes(role))
}

export const hasModulePermission = (
  user: any,
  module: string,
  action: PermissionAction,
): boolean => {
  if (!isActiveUser(user)) return false
  const role = roleOf(user)
  if (isElevatedRole(role)) return true
  if (roleHasModulePermission(user, module, action)) return true

  const rows = Array.isArray(user?.permissions) ? user.permissions : []
  return rows.some((row: any) => {
    if (!row || row.module !== module) return false
    const actions = Array.isArray(row.actions) ? row.actions : []
    return actions.includes(action)
  })
}

/** Tạo Access theo module/action để dùng cho collection nghiệp vụ mới. */


/** Quyền đọc Media: khách chỉ xem file public; tài khoản có quyền media/view được xem internal/restricted. */
export const mediaReadAccess: Access = ({ req }) => {
  if (isActiveUser(req.user) && hasModulePermission(req.user, 'media', 'view')) return true
  return { accessLevel: { equals: 'public' } } as Where
}

export const moduleAccess = (module: string, action: PermissionAction): Access => ({ req }) => {
  if (!isActiveUser(req.user)) return false
  return hasModulePermission(req.user, module, action)
}

/**
 * Scope theo khoa/phòng. Helper chỉ dùng khi collection có field department
 * dạng relationship. Không ép vào collection cũ có schema khác để tránh lỗi dữ liệu.
 */
export const departmentScopedAccess = (
  module: string,
  action: PermissionAction,
  departmentField = 'department',
): Access => ({ req }) => {
  if (!isActiveUser(req.user)) return false
  if (isElevatedRole(roleOf(req.user))) return true
  if (!hasModulePermission(req.user, module, action)) return false

  const department = (req.user as any)?.department
  const departmentID = typeof department === 'object' && department ? department.id : department
  if (!departmentID) return false

  return {
    [departmentField]: {
      equals: departmentID,
    },
  } as Where
}

/**
 * Scope collection departments theo chính khoa/phòng gán trên tài khoản.
 * HR có quyền module sẽ xem/sửa toàn bộ; user khoa/phòng chỉ được tác động đơn vị của mình.
 */
export const ownDepartmentRecordAccess = (action: PermissionAction): Access => ({ req }) => {
  if (!isActiveUser(req.user)) return false
  if (isElevatedRole(roleOf(req.user))) return true
  if (!hasModulePermission(req.user, 'departments', action)) return false
  const role = roleOf(req.user)
  if (role === 'hr') return true
  const department = (req.user as any)?.department
  const departmentID = typeof department === 'object' && department ? department.id : department
  if (!departmentID) return false
  return { id: { equals: departmentID } } as Where
}

/**
 * Khoa/phòng được tạo/sửa dữ liệu organization có field department của chính mình.
 * HR được quyền toàn bộ.
 */
export const organizationDepartmentScopedAccess = (
  module: 'specialties' | 'doctors',
  action: PermissionAction,
): Access => ({ req }) => {
  if (!isActiveUser(req.user)) return false
  if (isElevatedRole(roleOf(req.user))) return true
  if (!hasModulePermission(req.user, module, action)) return false
  const role = roleOf(req.user)
  if (role === 'hr') return true
  const department = (req.user as any)?.department
  const departmentID = typeof department === 'object' && department ? department.id : department
  if (!departmentID) return false
  return { department: { equals: departmentID } } as Where
}

export const publishedOrOwnedDraft: Access = ({ req }) => {
  const user = req.user
  if (!isActiveUser(user) || !user) {
    const where: Where = {
      _status: {
        equals: 'published',
      },
    }
    return where
  }

  if (['super-admin', 'system-admin', 'admin', 'reviewer'].includes(roleOf(user) || '')) {
    return true
  }

  const where: Where = {
    or: [
      {
        _status: {
          equals: 'published',
        },
      },
      {
        createdBy: {
          equals: user.id,
        },
      },
    ],
  }

  return where
}


/**
 * Update access cho nội dung có workflow. Khi request đổi trạng thái sang
 * submitted / approved / published / hidden thì kiểm tra đúng quyền tương ứng.
 */
export const workflowUpdateAccess = (module: string): Access => ({ req, data }) => {
  if (!isActiveUser(req.user)) return false
  const next = data as any
  if (next?._status === 'published' || next?.workflowState === 'published') {
    return hasModulePermission(req.user, module, 'publish')
  }
  if (next?.workflowState === 'approved') return hasModulePermission(req.user, module, 'approve')
  if (next?.workflowState === 'submitted') return hasModulePermission(req.user, module, 'submit')
  if (next?.workflowState === 'hidden') return hasModulePermission(req.user, module, 'hide')
  return hasModulePermission(req.user, module, 'edit')
}

/**
 * Với collection bật Trash: người có quyền delete được chuyển vào Thùng rác,
 * nhưng xóa vĩnh viễn chỉ dành cho nhóm quản trị hệ thống.
 */
export const contentDeleteAccess = (module: string): Access => ({ req, data }) => {
  if (!isActiveUser(req.user)) return false
  if (!data) return isElevatedRole(roleOf(req.user))
  if ((data as any)?.deletedAt) return hasModulePermission(req.user, module, 'delete')
  return hasModulePermission(req.user, module, 'delete')
}
