import type { CollectionConfig } from 'payload'
import { contentDeleteAccess, moduleAccess, publicPublishedFor, workflowUpdateAccess } from '@/access'
import { attachmentsField, categoryRelationshipField, slugField, workflowFields } from '@/fields/common'
import { detachNavigationReference } from '@/hooks/detachNavigationReference'
import { createSlugRedirect, syncPublishedAt } from '@/hooks/contentWorkflow'

export const Procurement: CollectionConfig = {
  slug: 'procurement',
  labels: { singular: 'Đấu thầu – Mua sắm', plural: 'Đấu thầu – Mua sắm' },
  admin: { useAsTitle: 'title', group: '📰 Truyền thông & Văn bản', defaultColumns: ['title', 'referenceCode', 'type', 'procurementStatus', 'publishedAt', 'deadlineAt', '_status'] },
  access: { read: publicPublishedFor('procurement'), create: moduleAccess('procurement', 'create'), update: workflowUpdateAccess('procurement'), delete: contentDeleteAccess('procurement') },
  trash: true,
  versions: { drafts: { autosave: true, schedulePublish: false }, maxPerDoc: 100 },
  hooks: {
    beforeChange: [syncPublishedAt('publishedAt')],
    afterChange: [createSlugRedirect('procurement')],
    beforeDelete: [detachNavigationReference('procurement')],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: '📦 Thông tin gói thầu',
          fields: [
            {
              name: 'title',
              label: 'Tiêu đề gói thầu / Mua sắm',
              type: 'text',
              required: true,
              admin: {
                placeholder: 'Nhập tên hoặc tiêu đề gói thầu, kế hoạch mua sắm...',
              },
            },
            slugField('title', 'procurement'),
            {
              type: 'row',
              fields: [
                {
                  name: 'referenceCode',
                  label: 'Mã tham chiếu / Mã gói thầu',
                  type: 'text',
                  index: true,
                  admin: {
                    width: '33.33%',
                    placeholder: 'VD: IB23000..., YCBG-01/2026...',
                  },
                },
                {
                  ...categoryRelationshipField('procurement'),
                  admin: {
                    width: '33.33%',
                    description: 'Chuyên mục phân loại mua sắm.',
                  },
                } as any,
                {
                  name: 'type',
                  label: 'Loại thông tin',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Thông báo mời thầu', value: 'Thông báo mời thầu' },
                    { label: 'Kế hoạch lựa chọn nhà thầu', value: 'Kế hoạch lựa chọn nhà thầu' },
                    { label: 'Yêu cầu báo giá', value: 'Yêu cầu báo giá' },
                    { label: 'Mua sắm', value: 'Mua sắm' },
                    { label: 'Kết quả lựa chọn nhà thầu', value: 'Kết quả lựa chọn nhà thầu' },
                    { label: 'Đính chính', value: 'Đính chính' },
                  ],
                  admin: {
                    width: '33.33%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'contactUnit',
                  label: 'Đơn vị phụ trách',
                  type: 'text',
                  admin: {
                    width: '50%',
                    placeholder: 'VD: Phòng Tài chính - Kế toán, Tổ Đấu thầu...',
                  },
                },
                {
                  name: 'procurementStatus',
                  label: 'Trạng thái đấu thầu',
                  type: 'select',
                  defaultValue: 'open',
                  options: [
                    { label: 'Đang tiếp nhận', value: 'open' },
                    { label: 'Sắp hết hạn', value: 'closing' },
                    { label: 'Đã hết hạn', value: 'closed' },
                    { label: 'Đã hủy', value: 'cancelled' },
                  ],
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'contactInfo',
              label: 'Thông tin liên hệ / Địa điểm nộp hồ sơ',
              type: 'textarea',
              admin: {
                rows: 2,
                placeholder: 'Thông tin người liên hệ, số điện thoại, địa chỉ nhận hồ sơ trực tiếp...',
              },
            },
            {
              name: 'excerpt',
              label: 'Mô tả ngắn',
              type: 'textarea',
              maxLength: 300,
              admin: {
                rows: 3,
                placeholder: 'Tóm tắt nội dung gói thầu hiển thị trên danh sách và thẻ xem trước...',
              },
            },
            {
              name: 'cover',
              label: 'Ảnh đại diện',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Không bắt buộc; khi để trống dùng ảnh mặc định của Đấu thầu – Mua sắm.',
              },
            },
          ],
        },
        {
          label: '📝 Nội dung chi tiết & Tệp đính kèm',
          fields: [
            {
              name: 'content',
              label: 'Nội dung chi tiết',
              type: 'richText',
              required: true,
              admin: {
                description: 'Hồ sơ mời thầu, yêu cầu kỹ thuật, điều kiện tham gia và các nội dung chi tiết.',
              },
            },
            attachmentsField(),
          ],
        },
        {
          label: '📋 Lịch sử cập nhật / Đính chính',
          fields: [
            {
              name: 'changeLog',
              label: 'Lịch sử cập nhật / Đính chính gói thầu',
              type: 'array',
              labels: {
                singular: 'Mục cập nhật',
                plural: 'Lịch sử cập nhật',
              },
              fields: [
                { name: 'date', label: 'Thời gian', type: 'date', required: true, admin: { width: '30%' } },
                { name: 'note', label: 'Nội dung thay đổi', type: 'textarea', required: true, admin: { width: '70%' } },
              ],
            },
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
                    description: 'Chọn mẫu giao diện trang chi tiết cho gói thầu này.',
                  },
                },
                {
                  name: 'source',
                  label: 'Nguồn thông tin',
                  type: 'text',
                  admin: {
                    width: '50%',
                    placeholder: 'VD: Hệ thống mạng đấu thầu quốc gia, BV Đa khoa Thới Lai...',
                  },
                },
              ],
            },
            {
              name: 'showSource',
              label: 'Hiển thị nguồn thông tin ở chân trang chi tiết',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Bật để hiển thị nguồn thông tin dưới chân bài viết gói thầu. Tắt nếu không muốn hiện nguồn cho riêng bài này.',
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
                    description: 'Nếu ảnh bị cắt mất chữ, chọn “Vừa vặn toàn bộ ảnh” để hiển thị đầy đủ không bị xén.',
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
                    description: 'Để trống sẽ tự động lấy Tiêu đề gói thầu.',
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
                    description: 'Bật nếu không muốn Google lập chỉ mục gói thầu này.',
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
      name: 'publishedAt',
      label: 'Ngày đăng',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Ngày và giờ phát hành thông tin.',
        date: {
          displayFormat: 'dd/MM/yyyy HH:mm',
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'deadlineAt',
      label: 'Hạn tiếp nhận hồ sơ',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Thời hạn cuối cùng nộp hồ sơ / báo giá.',
        date: {
          displayFormat: 'dd/MM/yyyy HH:mm',
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    ...workflowFields,
  ],
}
