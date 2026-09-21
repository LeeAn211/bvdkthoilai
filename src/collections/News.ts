import type { CollectionConfig } from 'payload'
import { contentDeleteAccess, moduleAccess, publicPublishedFor, workflowUpdateAccess } from '@/access'
import { attachmentsField, categoryRelationshipField, slugField, workflowFields } from '@/fields/common'
import { detachNavigationReference } from '@/hooks/detachNavigationReference'
import { createSlugRedirect, syncPublishedAt } from '@/hooks/contentWorkflow'

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'Tin tức', plural: 'Tin tức' },
  admin: {
    useAsTitle: 'title',
    group: '📰 Truyền thông & Văn bản',
    defaultColumns: ['title', 'categoryRef', 'views', 'workflowState', '_status', 'publishedAt', 'updatedAt'],
    description: 'Đăng và quản lý tin tức, hoạt động và kiến thức sức khỏe.',
  },
  access: {
    read: publicPublishedFor('news'),
    create: moduleAccess('news', 'create'),
    update: workflowUpdateAccess('news'),
    delete: contentDeleteAccess('news'),
  },
  trash: true,
  hooks: {
    beforeChange: [syncPublishedAt('publishedAt')],
    afterRead: [
      ({ doc }) => {
        // Frontend cũ đang dùng trường `category` dạng text để lọc tab trang chủ.
        // Bài mới lại chọn `categoryRef` (Chuyên mục chuẩn). Đồng bộ tên chuyên
        // mục khi đọc để bài đã xuất bản hiển thị ngay trong tab tương ứng,
        // đồng thời vẫn giữ tương thích với dữ liệu cũ chỉ có `category`.
        const ref = (doc as any)?.categoryRef
        const refName = ref && typeof ref === 'object' ? ref.name : undefined
        if (typeof refName === 'string' && refName.trim()) {
          return { ...(doc as any), category: refName.trim() }
        }
        return doc
      },
    ],
    afterChange: [createSlugRedirect('news')],
    beforeDelete: [detachNavigationReference('news')],
  },
  versions: { drafts: { autosave: true, schedulePublish: false }, maxPerDoc: 50 },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: '📰 Thông tin chính',
          fields: [
            {
              name: 'title',
              label: 'Tiêu đề bài viết',
              type: 'text',
              required: true,
              admin: {
                placeholder: 'Nhập tiêu đề tin tức, sự kiện hoặc bài viết chuyên môn...',
              },
            },
            slugField('title', 'news'),
            {
              type: 'row',
              fields: [
                {
                  ...categoryRelationshipField('news'),
                  admin: {
                    width: '50%',
                    description: 'Chọn chuyên mục quản lý tập trung theo cấu trúc tin tức bệnh viện.',
                  },
                } as any,
                {
                  name: 'category',
                  label: 'Chuyên mục cũ (tương thích dữ liệu)',
                  type: 'text',
                  admin: {
                    width: '50%',
                    readOnly: true,
                    description: 'Bảo toàn dữ liệu cũ. Bài viết mới chỉ cần chọn ô “Chuyên mục chuẩn”.',
                  },
                },
              ],
            },
            {
              name: 'excerpt',
              label: 'Tóm tắt / Mô tả ngắn',
              type: 'textarea',
              maxLength: 500,
              admin: {
                rows: 3,
                placeholder: 'Tóm tắt ngắn gọn từ 1 đến 3 câu nội dung chính của bài viết để hiển thị trên thẻ xem trước, kết quả tìm kiếm và mạng xã hội...',
                description: 'Tối đa 500 ký tự. Phần tóm tắt giúp độc giả nắm nhanh nội dung trước khi đọc chi tiết.',
              },
            },
            {
              name: 'cover',
              label: 'Ảnh đại diện bài viết',
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
              label: 'Nội dung chi tiết',
              type: 'richText',
              required: true,
              admin: {
                description: 'Trình soạn thảo hỗ trợ định dạng tiêu đề, hình ảnh minh họa, căn lề, bảng dữ liệu, danh sách và liên kết.',
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
                    placeholder: 'VD: Bác sĩ CKII Nguyễn Văn A, Phòng Kế hoạch Tổng hợp...',
                    description: 'Nguồn bài viết / Tác giả biên soạn. Để trống sẽ dùng mặc định theo mẫu trang.',
                  },
                },
              ],
            },
            {
              name: 'showSource',
              label: 'Hiển thị nguồn bài viết ở chân trang chi tiết',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Bật để hiển thị thông tin nguồn/tác giả dưới chân bài viết. Tắt nếu không muốn hiện nguồn cho riêng bài viết này.',
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
                    description: 'Chỉnh góc lấy nét khi ảnh bị xén mất phần đầu hoặc tiêu đề.',
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
                    description: 'Để trống để dùng URL tự động. Chỉ nhập khi cần trỏ về nguồn bài gốc khác.',
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
                    description: 'Bật nếu muốn ẩn bài viết khỏi sơ đồ sitemap.xml.',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'featured',
      label: 'Tin nổi bật',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Bật để ưu tiên hiển thị ở các vị trí tin tức tiêu điểm nổi bật trên trang chủ.',
      },
    },
    {
      name: 'pinned',
      label: 'Ghim bài viết',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Ghim bài viết lên vị trí đầu tiên của danh sách tin tức.',
      },
    },
    {
      name: 'views',
      label: 'Lượt xem bài viết',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Số lượt xem thực tế được hệ thống tự động đếm khi bạn đọc mở xem bài viết.',
      },
    },
    {
      name: 'publishedAt',
      label: 'Ngày xuất bản',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Thời gian đăng bài. Hệ thống tự động ghi nhận khi xuất bản hoặc có thể hẹn ngày thủ công.',
        date: {
          displayFormat: 'dd/MM/yyyy HH:mm',
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    ...workflowFields,
  ],
}
