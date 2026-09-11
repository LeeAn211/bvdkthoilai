import type { CollectionConfig } from 'payload'
import { moduleAccess } from '@/access'

export const FeedbackCases: CollectionConfig = {
  slug: 'feedbackCases',
  labels: { singular: 'Hồ sơ phản ánh', plural: 'Hồ sơ phản ánh' },
  admin: { useAsTitle: 'code', group: 'CSKH', defaultColumns: ['code', 'subject', 'category', 'priority', 'status', 'department', 'createdAt'] },
  access: { read: moduleAccess('feedback', 'view'), create: moduleAccess('feedback', 'create'), update: moduleAccess('feedback', 'edit'), delete: moduleAccess('feedback', 'delete') },
  hooks: {
    beforeChange: [({ data, originalDoc }) => {
      if (data?.status === 'closed' && originalDoc?.status !== 'closed' && !data.closedAt) return { ...data, closedAt: new Date().toISOString() }
      return data
    }],
    afterChange: [async ({ doc, previousDoc, operation, req }) => {
      if (operation !== 'update' || !previousDoc || doc?.status === previousDoc?.status) return doc
      try {
        await req.payload.create({ collection: 'feedbackActions', data: {
          case: doc.id, action: doc.status === 'closed' ? 'closed' : 'status',
          note: `Trạng thái chuyển từ ${previousDoc.status || 'chưa xác định'} sang ${doc.status || 'chưa xác định'}.`,
          fromStatus: previousDoc.status, toStatus: doc.status, performedBy: req.user?.id, public: true,
        }, overrideAccess: true, req })
      } catch {}
      return doc
    }],
  },
  fields: [
    { name: 'code', label: 'Mã tra cứu', type: 'text', required: true, unique: true, index: true, admin: { readOnly: true } },
    { name: 'name', label: 'Họ và tên', type: 'text', required: true },
    { name: 'phone', label: 'Số điện thoại', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'category', label: 'Nhóm phản ánh', type: 'relationship', relationTo: 'feedbackCategories' },
    { name: 'subject', label: 'Tiêu đề', type: 'text', required: true },
    { name: 'message', label: 'Nội dung', type: 'textarea', required: true },
    { name: 'allowContact', label: 'Đồng ý để bệnh viện liên hệ', type: 'checkbox', defaultValue: true },
    { name: 'priority', label: 'Ưu tiên', type: 'select', defaultValue: 'normal', options: [
      { label: 'Thấp', value: 'low' }, { label: 'Bình thường', value: 'normal' }, { label: 'Cao', value: 'high' }, { label: 'Khẩn', value: 'urgent' },
    ] },
    { name: 'status', label: 'Trạng thái', type: 'select', defaultValue: 'new', required: true, options: [
      { label: 'Mới tiếp nhận', value: 'new' }, { label: 'Đã phân công', value: 'assigned' }, { label: 'Đang xử lý', value: 'processing' }, { label: 'Chờ phản hồi', value: 'waiting' }, { label: 'Đã xử lý', value: 'resolved' }, { label: 'Đã đóng', value: 'closed' },
    ] },
    { name: 'department', label: 'Khoa/Phòng xử lý', type: 'relationship', relationTo: 'departments' },
    { name: 'assignee', label: 'Người xử lý', type: 'relationship', relationTo: 'users' },
    { name: 'dueAt', label: 'Hạn xử lý', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'publicResponse', label: 'Phản hồi công khai', type: 'textarea' },
    { name: 'closedAt', label: 'Thời điểm đóng', type: 'date', admin: { readOnly: true } },
  ],
}
