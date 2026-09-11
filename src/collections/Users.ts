import type { CollectionConfig } from 'payload'
import { adminField, admins, ownUserOrAdmins } from '@/access'

const permissionActions = [
  { label: 'Xem', value: 'view' },
  { label: 'Thêm mới', value: 'create' },
  { label: 'Chỉnh sửa', value: 'edit' },
  { label: 'Xóa', value: 'delete' },
  { label: 'Gửi duyệt', value: 'submit' },
  { label: 'Duyệt', value: 'approve' },
  { label: 'Xuất bản', value: 'publish' },
  { label: 'Ẩn', value: 'hide' },
  { label: 'Nhập Excel', value: 'import' },
  { label: 'Xuất Excel', value: 'export' },
  { label: 'Khôi phục', value: 'restore' },
]

const isProduction = process.env.NODE_ENV === 'production'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Người dùng', plural: 'Người dùng & Phân quyền' },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    cookies: {
      secure: isProduction,
      sameSite: 'Lax',
    },
  },
  admin: {
    useAsTitle: 'name',
    group: 'Hệ thống',
    defaultColumns: ['name', 'email', 'role', 'department', 'status', 'updatedAt'],
    description: 'Tài khoản, vai trò, phạm vi khoa/phòng và quyền bổ sung theo module.',
  },
  access: {
    create: admins,
    read: ownUserOrAdmins,
    update: ownUserOrAdmins,
    delete: admins,
  },
  hooks: {
    beforeLogin: [
      ({ user }) => {
        if (user && (user.status === 'locked' || user.status === 'inactive')) {
          throw new Error('Tài khoản này đã bị khóa hoặc ngừng hoạt động. Vui lòng liên hệ Quản trị viên.')
        }
        return user
      },
    ],
    afterLogin: [
      async ({ req, user }) => {
        if (user?.id) {
          try {
            await req.payload.update({
              collection: 'users',
              id: user.id,
              data: { lastLoginAt: new Date().toISOString() },
              overrideAccess: true,
              req,
            })
          } catch {
            // Không làm gián đoạn luồng đăng nhập nếu update lastLoginAt gặp sự cố nhỏ
          }
        }
        return user
      },
    ],
  },
  fields: [
    { name: 'name', label: 'Họ và tên', type: 'text', required: true },
    {
      name: 'role',
      label: 'Vai trò / Quyền hạn',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      access: { create: adminField, update: adminField },
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'System Admin', value: 'system-admin' },
        { label: 'Ban Giám đốc', value: 'board' },
        { label: 'Quản trị website', value: 'admin' },
        { label: 'Biên tập viên', value: 'editor' },
        { label: 'Người duyệt bài', value: 'reviewer' },
        { label: 'Khoa / Phòng', value: 'department' },
        { label: 'Quản lý Khoa / Phòng (tương thích dữ liệu cũ)', value: 'department-manager' },
        { label: 'Tổ chức / Nhân sự', value: 'hr' },
        { label: 'Tài chính', value: 'finance' },
        { label: 'Đấu thầu / Vật tư', value: 'procurement' },
        { label: 'Lịch khám', value: 'clinic-schedule' },
        { label: 'Tiêm chủng', value: 'vaccination' },
        { label: 'Quản lý chất lượng', value: 'quality-management' },
      ],
    },
    {
      name: 'department',
      label: 'Phạm vi Khoa / Phòng',
      type: 'relationship',
      relationTo: 'departments',
      saveToJWT: true,
      access: { create: adminField, update: adminField },
      admin: { description: 'Dùng để giới hạn dữ liệu theo khoa/phòng đối với các vai trò được phân scope.' },
    },
    {
      name: 'status',
      label: 'Trạng thái tài khoản',
      type: 'select',
      required: true,
      defaultValue: 'active',
      saveToJWT: true,
      access: { create: adminField, update: adminField },
      options: [
        { label: 'Đang hoạt động', value: 'active' },
        { label: 'Đã khóa', value: 'locked' },
        { label: 'Ngừng hoạt động', value: 'inactive' },
      ],
      admin: { description: 'Đã chuẩn hóa trường trạng thái theo baseline. Tài khoản Locked/Inactive bị chặn đăng nhập ngay ở hook xác thực.' },
    },
    {
      name: 'permissions',
      label: 'Quyền bổ sung theo module',
      type: 'array',
      saveToJWT: true,
      access: { create: adminField, update: adminField },
      admin: { description: 'Chỉ dùng để cấp thêm quyền ngoài vai trò mặc định. Quyền được kiểm tra server-side qua access helper.' },
      fields: [
        { name: 'module', label: 'Module', type: 'text', required: true, admin: { description: 'Ví dụ: news, notices, procurement, schedules, services, quality.' } },
        { name: 'actions', label: 'Thao tác được phép', type: 'select', hasMany: true, required: true, options: permissionActions },
      ],
    },
    {
      name: 'lastLoginAt',
      label: 'Đăng nhập gần nhất',
      type: 'date',
      admin: { readOnly: true, position: 'sidebar', date: { displayFormat: 'dd/MM/yyyy HH:mm' } },
    },
  ],
}
