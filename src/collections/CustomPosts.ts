import type { CollectionConfig } from 'payload'
import { moduleAccess, publicPublished, workflowUpdateAccess, contentDeleteAccess } from '@/access'
import { attachmentsField, slugField, workflowFields } from '@/fields/common'
import { syncPublishedAt } from '@/hooks/contentWorkflow'

export const CustomPosts: CollectionConfig = {
  slug: 'custom-posts',
  labels: { singular: 'Bài viết theo mục Menu', plural: 'Bài viết theo mục Menu' },
  admin: {
    useAsTitle: 'title',
    group: '🌐 Trang chủ & Giao diện Website',
    defaultColumns: ['title', 'section', 'publishedAt', '_status'],
    description: 'Đăng bài cho các mục nội dung mở rộng được tạo từ Menu, ví dụ Chuyển đổi số.',
  },
  access: {
    read: publicPublished,
    create: moduleAccess('pages', 'create'),
    update: workflowUpdateAccess('pages'),
    delete: contentDeleteAccess('pages'),
  },
  trash: true,
  versions: { drafts: { autosave: true, schedulePublish: false }, maxPerDoc: 50 },
  hooks: { beforeChange: [syncPublishedAt('publishedAt')] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: '📰 Thông tin bài viết',
          fields: [
            {
              name: 'title',
              label: 'Tiêu đề bài viết',
              type: 'text',
              required: true,
              admin: {
                placeholder: 'Nhập tiêu đề bài viết cho mục nội dung...',
              },
            },
            slugField('title', 'custom-posts'),
            {
              name: 'section',
              label: 'Thuộc mục nội dung',
              type: 'relationship',
              relationTo: 'content-sections',
              required: true,
              index: true,
              admin: {
                description: 'Chọn mục nội dung mở rộng (VD: Chuyển đổi số, Kế hoạch công tác...).',
              },
            },
            {
              name: 'excerpt',
              label: 'Mô tả ngắn',
              type: 'textarea',
              maxLength: 300,
              admin: {
                rows: 3,
                placeholder: 'Tóm tắt nội dung bài viết hiển thị trên danh sách...',
              },
            },
            {
              name: 'cover',
              label: 'Ảnh đại diện',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Không bắt buộc; khi để trống dùng ảnh mặc định của mục nội dung.',
              },
            },
          ],
        },
        {
          label: '📝 Nội dung chi tiết & Tệp đính kèm',
          fields: [
            {
              name: 'content',
              label: 'Nội dung bài viết',
              type: 'richText',
              required: true,
              admin: {
                description: 'Trình soạn thảo hỗ trợ văn bản, hình ảnh minh họa, bảng và liên kết.',
              },
            },
            attachmentsField(),
          ],
        },
        {
          label: '⚙️ Cấu hình hiển thị & Nguồn tin',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'layoutTemplate',
                  label: 'Mẫu giao diện chi tiết',
                  type: 'select',
                  defaultValue: 'default',
                  options: [
                    { label: 'Mặc định (Theo cài đặt hệ thống)', value: 'default' },
                    { label: 'Giao diện Chuẩn (3 cột: Chia sẻ + Nội dung + Sidebar)', value: 'bachmai' },
                    { label: 'Cổ điển đơn giản (Đầy đủ chiều rộng)', value: 'classic' },
                  ],
                  admin: {
                    width: '50%',
                    description: 'Chọn mẫu giao diện trang chi tiết cho bài viết này.',
                  },
                },
                {
                  name: 'source',
                  label: 'Nguồn bài viết',
                  type: 'text',
                  admin: {
                    width: '50%',
                    placeholder: 'VD: Tổ Công nghệ thông tin, Ban Biên tập...',
                  },
                },
              ],
            },
          ],
        },
        {
          label: '🔍 Tối ưu SEO & Chia sẻ',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'seoTitle',
                  label: 'Tiêu đề SEO',
                  type: 'text',
                  maxLength: 60,
                  admin: {
                    width: '50%',
                    placeholder: 'Tiêu đề hiển thị trên Google (tối đa 60 ký tự)...',
                    description: 'Để trống sẽ tự động lấy Tiêu đề bài viết.',
                  },
                },
                {
                  name: 'canonicalUrl',
                  label: 'Canonical URL',
                  type: 'text',
                  admin: {
                    width: '50%',
                    placeholder: 'https://...',
                    description: 'Để trống để dùng URL tự động.',
                  },
                },
              ],
            },
            {
              name: 'seoDescription',
              label: 'Mô tả SEO',
              type: 'textarea',
              maxLength: 160,
              admin: {
                rows: 3,
                placeholder: 'Mô tả ngắn gọn xuất hiện bên dưới kết quả tìm kiếm Google (tối đa 160 ký tự)...',
                description: 'Để trống sẽ tự động lấy từ ô Mô tả ngắn.',
              },
            },
            {
              name: 'seoImage',
              label: 'Ảnh SEO / Chia sẻ',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Ảnh khi chia sẻ link lên Zalo, Facebook. Khuyên dùng tỷ lệ 1200×630px. Để trống sẽ tự động lấy Ảnh đại diện.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'noIndex',
                  label: 'Không lập chỉ mục (noindex)',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    width: '50%',
                    description: 'Bật nếu không muốn Google lập chỉ mục bài viết này.',
                  },
                },
                {
                  name: 'excludeFromSitemap',
                  label: 'Không đưa vào sitemap',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    width: '50%',
                    description: 'Bật nếu muốn ẩn khỏi sitemap.xml.',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'pinned',
      label: 'Ghim bài viết',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Ghim bài viết lên vị trí đầu danh sách.',
      },
    },
    {
      name: 'publishedAt',
      label: 'Ngày đăng',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Ngày và giờ đăng bài viết.',
        date: {
          displayFormat: 'dd/MM/yyyy HH:mm',
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    ...workflowFields,
  ],
}
