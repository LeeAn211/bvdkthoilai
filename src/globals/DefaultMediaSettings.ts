import type { GlobalConfig } from 'payload'
import { admins, loggedIn } from '@/access'

export const DefaultMediaSettings: GlobalConfig = {
  slug: 'default-media-settings',
  label: 'Ảnh mặc định nội dung',
  admin: {
    group: 'Trang chủ & Giao diện',
    description: 'Ảnh đại diện mặc định dùng ở trang chủ và danh sách khi nội dung không chọn ảnh riêng. Ảnh đại diện không hiển thị ở đầu trang chi tiết; ảnh chèn trong nội dung vẫn hiển thị bình thường.',
  },
  access: { read: loggedIn, update: admins },
  fields: [
    { name: 'news', label: 'Tin tức', type: 'upload', relationTo: 'media' },
    { name: 'notices', label: 'Thông báo', type: 'upload', relationTo: 'media' },
    { name: 'procurement', label: 'Đấu thầu – Mua sắm', type: 'upload', relationTo: 'media' },
    { name: 'recruitment', label: 'Tuyển dụng', type: 'upload', relationTo: 'media' },
    { name: 'documents', label: 'Văn bản – Tài liệu', type: 'upload', relationTo: 'media' },
    { name: 'schedules', label: 'Lịch khám', type: 'upload', relationTo: 'media' },
    { name: 'vaccinations', label: 'Lịch tiêm chủng / Tiêm ngừa', type: 'upload', relationTo: 'media' },
    {
      name: 'customDefaults',
      label: 'Ảnh mặc định bổ sung',
      type: 'array',
      admin: { description: 'Có thể tạo thêm ảnh mặc định cho các mục phát sinh sau này. Khóa dùng để nhận diện trong code/module, ví dụ: huong-dan, dich-vu-moi.' },
      fields: [
        { name: 'key', label: 'Khóa nhận diện', type: 'text', required: true, admin: { placeholder: 'vi-du: dich-vu-moi' } },
        { name: 'label', label: 'Tên mục', type: 'text', required: true },
        { name: 'image', label: 'Ảnh mặc định', type: 'upload', relationTo: 'media', required: true },
      ],
    },
  ],
}
