import type { GlobalConfig } from 'payload'
import { admins } from '@/access'

export const SystemSettings: GlobalConfig = {
  slug: 'system-settings',
  label: 'Cấu hình hệ thống',
  admin: {
    group: 'Hệ thống',
    description: 'Thiết lập vận hành, bảo mật, audit, sao lưu và chế độ bảo trì.',
  },
  access: { read: admins, update: admins },
  fields: [
    { name: 'maintenanceMode', label: 'Chế độ bảo trì', type: 'checkbox', defaultValue: false },
    { name: 'maintenanceMessage', label: 'Thông báo bảo trì', type: 'textarea', defaultValue: 'Hệ thống đang được bảo trì. Vui lòng quay lại sau.' },
    { type: 'row', fields: [
      { name: 'auditRetentionDays', label: 'Lưu Audit Log tối thiểu (ngày)', type: 'number', defaultValue: 730, min: 90, max: 3650 },
      { name: 'backupRetentionDays', label: 'Lưu bản sao lưu (ngày)', type: 'number', defaultValue: 30, min: 7, max: 3650 },
    ] },
    { name: 'healthStorageProbe', label: 'Health check kiểm tra ghi/xóa Storage', type: 'checkbox', defaultValue: true },
    { name: 'productionChecklistNote', label: 'Ghi chú vận hành Production', type: 'textarea' },
  ],
}
