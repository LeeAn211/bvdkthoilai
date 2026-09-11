import type { GlobalConfig } from 'payload'
import { admins } from '@/access'

export const UploadSettings: GlobalConfig = {
  slug: 'upload-settings',
  label: 'Giới hạn Upload',
  admin: {
    group: 'Hệ thống',
    description: 'Cấu hình giới hạn upload theo Baseline V1.1. Giai đoạn Foundation tạo nguồn cấu hình tập trung; middleware enforcement sẽ hoàn thiện ở System hardening.',
  },
  access: {
    read: admins,
    update: admins,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'imageMaxMB', label: 'Ảnh thường (MB)', type: 'number', required: true, defaultValue: 15, min: 1, max: 100 },
        { name: 'scheduleImageMaxMB', label: 'Ảnh lịch khám/tiêm (MB)', type: 'number', required: true, defaultValue: 20, min: 1, max: 100 },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'pdfMaxMB', label: 'PDF (MB)', type: 'number', required: true, defaultValue: 50, min: 1, max: 100 },
        { name: 'wordMaxMB', label: 'Word (MB)', type: 'number', required: true, defaultValue: 20, min: 1, max: 100 },
        { name: 'excelMaxMB', label: 'Excel (MB)', type: 'number', required: true, defaultValue: 20, min: 1, max: 100 },
        { name: 'powerPointMaxMB', label: 'PowerPoint (MB)', type: 'number', required: true, defaultValue: 50, min: 1, max: 100 },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'batchMaxMB', label: 'Tổng mỗi thao tác (MB)', type: 'number', required: true, defaultValue: 100, min: 1, max: 500 },
        { name: 'batchMaxFiles', label: 'Số file tối đa/lần', type: 'number', required: true, defaultValue: 20, min: 1, max: 100 },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'warningPercent', label: 'Cảnh báo dung lượng (%)', type: 'number', required: true, defaultValue: 80, min: 1, max: 99 },
        { name: 'blockPercent', label: 'Chặn upload thường (%)', type: 'number', required: true, defaultValue: 95, min: 1, max: 100 },
      ],
    },
  ],
}
