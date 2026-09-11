import type { GlobalConfig } from 'payload'
import { moduleAccess } from '@/access'

export const ScheduleSettings: GlobalConfig = {
  slug: 'schedule-settings',
  label: 'Cấu hình lịch khám / tiêm',
  admin: { group: 'Dịch vụ người bệnh', description: 'Cấu hình hiển thị chung cho lịch khám và lịch tiêm chủng.' },
  access: { read: () => true, update: moduleAccess('schedules', 'edit') },
  fields: [
    { name: 'preferWeeklyImage', label: 'Ưu tiên ảnh lịch tuần', type: 'checkbox', defaultValue: true },
    { name: 'showDailyTab', label: 'Hiện tab Theo ngày', type: 'checkbox', defaultValue: true },
    { name: 'showWeeklyTab', label: 'Hiện tab Theo tuần', type: 'checkbox', defaultValue: true },
    { name: 'showAttachmentTab', label: 'Hiện tab Tệp đính kèm', type: 'checkbox', defaultValue: true },
    { name: 'cacheMinutes', label: 'Thời gian cache lịch (phút)', type: 'number', defaultValue: 5, min: 0, max: 1440 },
  ],
}
