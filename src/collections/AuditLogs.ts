import type { CollectionConfig } from 'payload'
import { admins } from '@/access'

/**
 * Nhật ký hệ thống bất biến. Chỉ các hook server-side ghi vào collection này
 * bằng overrideAccess; Admin chỉ được đọc và xuất dữ liệu.
 */
export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  labels: { singular: 'Nhật ký hệ thống', plural: 'Nhật ký hệ thống' },
  admin: {
    group: 'Hệ thống',
    useAsTitle: 'summary',
    defaultColumns: ['createdAt', 'actorEmail', 'action', 'resource', 'documentId', 'ip'],
    description: 'Audit Log bất biến. Không cho sửa hoặc xóa từ Admin/API thông thường.',
  },
  access: {
    read: admins,
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    { name: 'summary', label: 'Tóm tắt', type: 'text', required: true, index: true },
    { name: 'action', label: 'Hành động', type: 'select', required: true, index: true, options: [
      { label: 'Tạo', value: 'create' },
      { label: 'Cập nhật', value: 'update' },
      { label: 'Xóa', value: 'delete' },
      { label: 'Cập nhật Global', value: 'global-update' },
      { label: 'Đăng nhập', value: 'login' },
      { label: 'Khác', value: 'other' },
    ] },
    { name: 'resource', label: 'Collection / Global', type: 'text', required: true, index: true },
    { name: 'documentId', label: 'ID bản ghi', type: 'text', index: true },
    { name: 'actor', label: 'Người thực hiện', type: 'relationship', relationTo: 'users', index: true },
    { name: 'actorEmail', label: 'Email người thực hiện', type: 'text', index: true },
    { name: 'actorRole', label: 'Vai trò', type: 'text', index: true },
    { name: 'ip', label: 'Địa chỉ IP', type: 'text', index: true },
    { name: 'userAgent', label: 'Trình duyệt / User-Agent', type: 'textarea' },
    { name: 'changedFields', label: 'Các trường thay đổi', type: 'json' },
    { name: 'metadata', label: 'Metadata', type: 'json' },
  ],
  timestamps: true,
}
