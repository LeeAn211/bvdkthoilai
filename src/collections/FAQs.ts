import type { CollectionConfig } from 'payload'
import { moduleAccess } from '@/access'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'Câu hỏi thường gặp', plural: 'Câu hỏi thường gặp' },
  admin: {
    useAsTitle: 'question', group: 'CSKH', defaultColumns: ['question', 'category', 'active', 'order'],
    description: 'Thêm từng câu hỏi hoặc dùng khung nhập Excel phía trên danh sách để cập nhật nhanh hàng loạt.',
    components: { beforeList: ['/src/components/admin/FAQExcelImport'] },
  },
  access: {
    read: ({ req }) => req.user ? moduleAccess('faqs', 'view')({ req } as any) : { active: { equals: true } },
    create: moduleAccess('faqs', 'create'), update: moduleAccess('faqs', 'edit'), delete: moduleAccess('faqs', 'delete'),
  },
  fields: [
    { name: 'question', label: 'Câu hỏi', type: 'text', required: true },
    { name: 'answer', label: 'Trả lời', type: 'richText', required: true },
    { name: 'category', label: 'Nhóm', type: 'text' },
    { name: 'keywords', label: 'Từ khóa', type: 'text', admin: { description: 'Ngăn cách bằng dấu phẩy.' } },
    { name: 'active', label: 'Hiển thị', type: 'checkbox', defaultValue: true },
    { name: 'order', label: 'Thứ tự', type: 'number', defaultValue: 0 },
  ],
}
