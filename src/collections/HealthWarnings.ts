import type { CollectionConfig } from 'payload'
import { contentDeleteAccess, moduleAccess, publicPublishedFor, workflowUpdateAccess } from '@/access'
import { attachmentsField, categoryRelationshipField, slugField, workflowFields } from '@/fields/common'
import { detachNavigationReference } from '@/hooks/detachNavigationReference'
import { createSlugRedirect, syncPublishedAt } from '@/hooks/contentWorkflow'

export const HealthWarnings: CollectionConfig = {
  slug: 'health-warnings',
  labels: { singular: 'Cảnh báo y tế', plural: 'Cảnh báo y tế & Cộng đồng' },
  admin: {
    useAsTitle: 'title',
    group: '📰 Truyền thông & Văn bản',
    defaultColumns: ['title', 'level', 'views', 'workflowState', '_status', 'publishedAt'],
    description: 'Đăng và quản lý thông tin cảnh báo dịch bệnh, an toàn thực phẩm, phòng chống lừa đảo y tế và khuyến cáo sức khỏe khẩn cấp.',
  },
  access: {
    read: publicPublishedFor('health-warnings'),
    create: moduleAccess('health-warnings', 'create'),
    update: workflowUpdateAccess('health-warnings'),
    delete: contentDeleteAccess('health-warnings'),
  },
  trash: true,
  versions: { drafts: { autosave: true, schedulePublish: false }, maxPerDoc: 50 },
  hooks: {
    beforeChange: [syncPublishedAt('publishedAt')],
    afterChange: [createSlugRedirect('health-warnings')],
    beforeDelete: [detachNavigationReference('health-warnings')],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: '⚠️ Thông tin cảnh báo',
          fields: [
            {
              name: 'title',
              label: 'Tiêu đề cảnh báo',
              type: 'text',
              required: true,
              admin: {
                placeholder: 'Nhập tiêu đề cảnh báo y tế (VD: Cảnh báo dịch sốt xuất huyết bùng phát mùa mưa)...',
              },
            },
            slugField('title', 'health-warnings'),
            {
              type: 'row',
              fields: [
                {
                  ...categoryRelationshipField('notices'),
                  admin: {
                    width: '50%',
                    description: 'Chọn chuyên mục quản lý cảnh báo (dùng chung danh mục Thông báo & Cảnh báo).',
                  },
                } as any,
                {
                  name: 'level',
                  label: 'Mức độ cảnh báo',
                  type: 'select',
                  defaultValue: 'urgent',
                  required: true,
                  options: [
                    { label: '🚨 Khẩn cấp (Màu đỏ cảnh báo cao nhất)', value: 'urgent' },
                    { label: '⚠️ Quan trọng (Màu vàng cam)', value: 'important' },
                    { label: '🛡️ Khuyến cáo cộng đồng (Màu xanh lam)', value: 'normal' },
                  ],
                  admin: {
                    width: '50%',
                    description: 'Phân loại mức độ khẩn cấp để gắn thẻ màu và ưu tiên hiển thị.',
                  },
                },
              ],
            },
            {
              name: 'excerpt',
              label: 'Tóm tắt / Mô tả ngắn',
              type: 'textarea',
              maxLength: 300,
              admin: {
                rows: 3,
                placeholder: 'Tóm tắt nội dung cảnh báo hiển thị trên danh sách và thẻ xem trước...',
                description: 'Tối đa 300 ký tự. Hiển thị trực tiếp trên thẻ cảnh báo nhỏ gọn.',
              },
            },
            {
              name: 'cover',
              label: 'Ảnh minh họa / Banner cảnh báo',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: '💡 Khuyên dùng ảnh nằm ngang tỷ lệ 16:9 (khoảng 1200×675px hoặc 800×450px). Khi bỏ trống, website sẽ tự dùng ảnh mặc định.',
              },
            },
          ],
        },
        {
          label: '📝 Nội dung chi tiết & Tệp đính kèm',
          fields: [
            {
              name: 'content',
              label: 'Nội dung cảnh báo chi tiết',
              type: 'richText',
              required: true,
              admin: {
                description: 'Trình soạn thảo hỗ trợ định dạng tiêu đề, danh sách dấu hiệu nhận biết, khuyến cáo phòng ngừa, bảng dữ liệu và liên kết.',
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
                    description: 'Chọn mẫu giao diện trang chi tiết cho bài cảnh báo này.',
                  },
                },
                {
                  name: 'source',
                  label: 'Nguồn cảnh báo / Đơn vị ban hành',
                  type: 'text',
                  defaultValue: 'Bệnh viện Đa khoa Khu vực Thới Lai',
                  admin: {
                    width: '50%',
                    placeholder: 'VD: Ban Giám đốc, Khoa Kiểm soát nhiễm khuẩn, Bộ Y tế...',
                    description: 'Nguồn hoặc đơn vị phát hành thông tin cảnh báo.',
                  },
                },
              ],
            },
            {
              name: 'showSource',
              label: 'Hiển thị nguồn cảnh báo ở chân trang chi tiết',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Bật để hiển thị thông tin nguồn dưới chân bài cảnh báo.',
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
                    description: 'Tùy chọn cách hiển thị để ảnh không bị cắt mất chữ hoặc chi tiết quan trọng.',
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
                    description: 'Để trống sẽ tự động lấy Tiêu đề cảnh báo.',
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
                description: 'Để trống sẽ tự động lấy từ ô Tóm tắt / Mô tả ngắn.',
              },
            },
            {
              name: 'seoImage',
              label: 'Ảnh SEO / Chia sẻ',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Ảnh khi chia sẻ link lên Zalo, Facebook. Để trống sẽ tự động lấy Ảnh đại diện.',
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
                    description: 'Bật nếu không muốn Google lập chỉ mục bài cảnh báo này.',
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
      label: 'Ghim cảnh báo',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Ghim cảnh báo lên đầu danh sách.',
      },
    },
    {
      name: 'showOnHome',
      label: 'Hiển thị trên trang chủ',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Bật để hiển thị bài cảnh báo này trong khối Cảnh báo y tế trên Trang chủ.',
      },
    },
    {
      name: 'publishedAt',
      label: 'Ngày phát hành cảnh báo',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Thời gian phát hành thông tin cảnh báo.',
        date: {
          displayFormat: 'dd/MM/yyyy HH:mm',
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'views',
      label: 'Lượt xem cảnh báo',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Số lượt xem thực tế được hệ thống tự động ghi nhận khi bạn đọc mở xem.',
      },
    },
    ...workflowFields,
  ],
}
