import type { CollectionConfig } from 'payload'
import { contentDeleteAccess, moduleAccess, publicPublishedFor, workflowUpdateAccess } from '@/access'
import { attachmentsField, categoryRelationshipField, slugField, workflowFields } from '@/fields/common'
import { detachNavigationReference } from '@/hooks/detachNavigationReference'
import { createSlugRedirect, syncPublishedAt } from '@/hooks/contentWorkflow'

export const Notices: CollectionConfig = {
  slug: 'notices',
  labels: { singular: 'Thông báo', plural: 'Thông báo' },
  admin: { useAsTitle: 'title', group: '📰 Truyền thông & Văn bản', defaultColumns: ['title', 'level', 'workflowState', '_status', 'publishedAt', 'startAt', 'expireAt'] },
  access: { read: publicPublishedFor('notices'), create: moduleAccess('notices', 'create'), update: workflowUpdateAccess('notices'), delete: contentDeleteAccess('notices') },
  trash: true,
  versions: { drafts: { autosave: true, schedulePublish: false }, maxPerDoc: 50 },
  hooks: {
    beforeChange: [syncPublishedAt('publishedAt')],
    afterChange: [createSlugRedirect('notices')],
    beforeDelete: [detachNavigationReference('notices')],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: '📢 Thông tin chính',
          fields: [
            {
              name: 'title',
              label: 'Tiêu đề thông báo',
              type: 'text',
              required: true,
              admin: {
                placeholder: 'Nhập tiêu đề thông báo...',
              },
            },
            slugField('title', 'notices'),
            {
              type: 'row',
              fields: [
                {
                  ...categoryRelationshipField('notices'),
                  admin: {
                    width: '50%',
                    description: 'Chọn chuyên mục quản lý thông báo.',
                  },
                } as any,
                {
                  name: 'level',
                  label: 'Mức độ thông báo',
                  type: 'select',
                  defaultValue: 'normal',
                  options: [
                    { label: 'Thông thường', value: 'normal' },
                    { label: 'Quan trọng', value: 'important' },
                    { label: 'Khẩn', value: 'urgent' },
                  ],
                  admin: {
                    width: '50%',
                    description: 'Phân loại mức độ khẩn cấp để gắn thẻ màu tương ứng.',
                  },
                },
              ],
            },
            {
              name: 'excerpt',
              label: 'Mô tả ngắn / Tóm tắt',
              type: 'textarea',
              maxLength: 300,
              admin: {
                rows: 3,
                placeholder: 'Tóm tắt nội dung thông báo hiển thị trên danh sách và thẻ xem trước...',
                description: 'Tối đa 300 ký tự.',
              },
            },
            {
              name: 'cover',
              label: 'Ảnh đại diện',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: '💡 Khuyên dùng ảnh nằm ngang tỷ lệ 16:9 (khoảng 1200×675px hoặc 800×450px). Khi bỏ trống, website sẽ tự dùng ảnh mặc định của bệnh viện.',
              },
            },
          ],
        },
        {
          label: '📝 Nội dung chi tiết & Tệp đính kèm',
          fields: [
            {
              name: 'content',
              label: 'Nội dung thông báo',
              type: 'richText',
              required: true,
              admin: {
                description: 'Trình soạn thảo hỗ trợ định dạng tiêu đề, danh sách, bảng dữ liệu và liên kết.',
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
                    description: 'Chọn mẫu giao diện trang chi tiết cho thông báo này.',
                  },
                },
                {
                  name: 'source',
                  label: 'Nguồn thông báo',
                  type: 'text',
                  admin: {
                    width: '50%',
                    placeholder: 'VD: Ban Giám đốc, Phòng Tổ chức cán bộ...',
                    description: 'Nguồn hoặc đơn vị phát hành thông báo.',
                  },
                },
              ],
            },
            {
              name: 'showSource',
              label: 'Hiển thị nguồn thông báo ở chân trang chi tiết',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Bật để hiển thị thông tin nguồn dưới chân thông báo. Tắt nếu không muốn hiện nguồn cho riêng bài này.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'coverFit',
                  label: 'Cách hiển thị ảnh đại diện trên thẻ / trang chủ',
                  type: 'select',
                  defaultValue: 'cover',
                  options: [
                    { label: 'Vừa vặn khung, trọn vẹn không bị cắt (khuyên dùng - contain)', value: 'contain' },
                    { label: 'Lấp đầy khung - Canh đỉnh đầu / phần trên (cover-top)', value: 'cover-top' },
                    { label: 'Lấp đầy khung - Canh chính giữa tâm ảnh (cover-center)', value: 'cover-center' },
                    { label: 'Lấp đầy khung - Canh phần dưới (cover-bottom)', value: 'cover-bottom' },
                    { label: 'Lấp đầy khung (chuẩn mặc định - cover)', value: 'cover' },
                    { label: 'Co giãn vừa kín khung ảnh (fill)', value: 'fill' },
                  ],
                  admin: {
                    width: '50%',
                    description: 'Tùy chọn cách hiển thị để ảnh không bị cắt mất chữ hoặc chi tiết quan trọng: Chọn "Vừa vặn khung" để ảnh luôn hiển thị trọn vẹn 100% không bị cắt; hoặc chọn "Lấp đầy khung" để phủ kín toàn bộ thẻ.',
                  },
                },
                {
                  name: 'coverPosition',
                  label: 'Điểm lấy nét ảnh (Trọng tâm)',
                  type: 'select',
                  defaultValue: 'top',
                  options: [
                    { label: 'Ưu tiên phần trên (Lấy rõ đầu/mặt/tiêu đề ảnh - Mặc định)', value: 'top' },
                    { label: 'Chính giữa ảnh (Center)', value: 'center' },
                    { label: 'Ưu tiên phần dưới (Bottom)', value: 'bottom' },
                  ],
                  admin: {
                    width: '50%',
                    description: 'Chỉnh góc lấy nét khi ảnh bị xén mất phần trên hoặc tiêu đề.',
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
                    description: 'Để trống sẽ tự động lấy Tiêu đề thông báo.',
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
                    description: 'Bật nếu không muốn Google lập chỉ mục thông báo này.',
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
      label: 'Ghim thông báo',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Ghim thông báo lên đầu danh sách.',
      },
    },
    {
      name: 'showOnHome',
      label: 'Hiển thị trên trang chủ',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Bật để hiển thị trong khối Thông báo trên Trang chủ.',
      },
    },
    {
      name: 'publishedAt',
      label: 'Ngày đăng',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Ngày và giờ phát hành thông báo.',
        date: {
          displayFormat: 'dd/MM/yyyy HH:mm',
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'startAt',
      label: 'Ngày bắt đầu hiển thị',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Tùy chọn hẹn giờ bắt đầu hiển thị.',
        date: {
          displayFormat: 'dd/MM/yyyy HH:mm',
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'expireAt',
      label: 'Ngày hết hiệu lực',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Tự động gỡ hoặc đánh dấu hết hiệu lực sau thời điểm này.',
        date: {
          displayFormat: 'dd/MM/yyyy HH:mm',
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    ...workflowFields,
  ],
}
