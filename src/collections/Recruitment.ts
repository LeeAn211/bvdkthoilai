import type { CollectionConfig } from 'payload'
import { contentDeleteAccess, moduleAccess, publicPublishedFor, workflowUpdateAccess } from '@/access'
import { attachmentsField, categoryRelationshipField, slugField, workflowFields } from '@/fields/common'
import { createSlugRedirect, syncPublishedAt } from '@/hooks/contentWorkflow'

export const Recruitment: CollectionConfig = {
  slug: 'recruitment',
  labels: { singular: 'Tin tuyển dụng', plural: 'Tuyển dụng' },
  admin: { useAsTitle: 'title', group: '📰 Truyền thông & Văn bản', defaultColumns: ['title', 'department', 'quantity', 'publishedAt', 'deadlineAt', 'workflowState', '_status'] },
  access: { read: publicPublishedFor('recruitment'), create: moduleAccess('recruitment', 'create'), update: workflowUpdateAccess('recruitment'), delete: contentDeleteAccess('recruitment') },
  trash: true,
  versions: { drafts: { autosave: true, schedulePublish: false }, maxPerDoc: 30 },
  hooks: { beforeChange: [syncPublishedAt('publishedAt')], afterChange: [createSlugRedirect('recruitment')] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: '💼 Thông tin tuyển dụng',
          fields: [
            {
              name: 'title',
              label: 'Tiêu đề tuyển dụng',
              type: 'text',
              required: true,
              admin: {
                placeholder: 'VD: Tuyển dụng Bác sĩ Đa khoa, Điều dưỡng viên...',
              },
            },
            slugField('title', 'recruitment'),
            {
              type: 'row',
              fields: [
                {
                  ...categoryRelationshipField('recruitment'),
                  admin: {
                    width: '33.33%',
                    description: 'Chuyên mục tuyển dụng.',
                  },
                } as any,
                {
                  name: 'department',
                  label: 'Khoa / Phòng tuyển dụng',
                  type: 'relationship',
                  relationTo: 'departments',
                  admin: {
                    width: '33.33%',
                    description: 'Khoa/phòng có nhu cầu tiếp nhận nhân sự.',
                  },
                },
                {
                  name: 'quantity',
                  label: 'Số lượng tuyển',
                  type: 'number',
                  admin: {
                    width: '33.33%',
                    placeholder: 'VD: 2',
                  },
                },
              ],
            },
            {
              name: 'excerpt',
              label: 'Mô tả ngắn',
              type: 'textarea',
              maxLength: 300,
              admin: {
                rows: 3,
                placeholder: 'Tóm tắt vị trí tuyển dụng hiển thị trên danh sách và thẻ xem trước...',
              },
            },
            {
              name: 'cover',
              label: 'Ảnh đại diện',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: '💡 Khuyên dùng ảnh nằm ngang tỷ lệ 16:9 (khoảng 1200×675px hoặc 800×450px). Khi bỏ trống, website sẽ tự dùng ảnh mặc định của Tuyển dụng.',
              },
            },
          ],
        },
        {
          label: '📝 Nội dung chi tiết & Tệp đính kèm',
          fields: [
            {
              name: 'content',
              label: 'Nội dung tuyển dụng',
              type: 'richText',
              required: true,
              admin: {
                description: 'Mô tả công việc, tiêu chuẩn ứng viên, quyền lợi chế độ và hồ sơ yêu cầu.',
              },
            },
            attachmentsField(),
            {
              name: 'attachment',
              label: 'Tệp cũ (tương thích dữ liệu)',
              type: 'upload',
              relationTo: 'media',
              admin: {
                readOnly: true,
                description: 'Giữ để các tin tuyển dụng cũ không mất tệp. Bài mới dùng danh sách Tệp đính kèm bên trên.',
              },
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
                    description: 'Chọn mẫu giao diện trang chi tiết cho tin tuyển dụng này.',
                  },
                },
                {
                  name: 'source',
                  label: 'Nguồn thông tin',
                  type: 'text',
                  admin: {
                    width: '50%',
                    placeholder: 'VD: Phòng Tổ chức cán bộ, Ban Giám đốc...',
                  },
                },
              ],
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
                    description: 'Để trống sẽ tự động lấy Tiêu đề tuyển dụng.',
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
                    description: 'Bật nếu không muốn Google lập chỉ mục tin này.',
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
        description: 'Ngày và giờ đăng tin tuyển dụng.',
        date: {
          displayFormat: 'dd/MM/yyyy HH:mm',
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'deadlineAt',
      label: 'Hạn nộp hồ sơ',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Thời hạn cuối cùng tiếp nhận hồ sơ ứng tuyển.',
        date: {
          displayFormat: 'dd/MM/yyyy HH:mm',
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    ...workflowFields,
  ],
}
