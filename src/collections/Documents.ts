import type { CollectionConfig } from 'payload'
import { contentDeleteAccess, moduleAccess } from '@/access'
import { categoryRelationshipField, slugField } from '@/fields/common'

export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: { singular: 'Văn bản / Tài liệu', plural: 'Văn bản / Tài liệu' },
  admin: { useAsTitle: 'title', group: '📰 Truyền thông & Văn bản', defaultColumns: ['title', 'number', 'categoryRef', 'issuedAt', 'year', 'updatedAt'] },
  access: { read: () => true, create: moduleAccess('documents', 'create'), update: moduleAccess('documents', 'edit'), delete: contentDeleteAccess('documents') },
  trash: true,
  versions: { maxPerDoc: 30 },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: '📄 Thông tin văn bản',
          fields: [
            {
              name: 'title',
              label: 'Tên văn bản / Tài liệu',
              type: 'text',
              required: true,
              admin: {
                placeholder: 'Nhập tên hoặc trích yếu ngắn gọn của văn bản...',
              },
            },
            slugField('title', 'documents'),
            {
              type: 'row',
              fields: [
                {
                  name: 'number',
                  label: 'Số / Ký hiệu',
                  type: 'text',
                  index: true,
                  admin: {
                    width: '33.33%',
                    placeholder: 'VD: 123/QĐ-SYT, 45/KH-BVTL...',
                  },
                },
                {
                  ...categoryRelationshipField('documents'),
                  admin: {
                    width: '33.33%',
                    description: 'Chọn chuyên mục quản lý văn bản chuẩn.',
                  },
                } as any,
                {
                  name: 'year',
                  label: 'Năm ban hành',
                  type: 'number',
                  admin: {
                    width: '33.33%',
                    placeholder: 'VD: 2026',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'issuer',
                  label: 'Cơ quan / Đơn vị ban hành',
                  type: 'text',
                  admin: {
                    width: '33.33%',
                    placeholder: 'VD: Sở Y tế Cần Thơ, BV Đa khoa Thới Lai...',
                  },
                },
                {
                  name: 'signer',
                  label: 'Người ký duyệt',
                  type: 'text',
                  admin: {
                    width: '33.33%',
                    placeholder: 'VD: Giám đốc BSCKII..., Trưởng phòng...',
                  },
                },
                {
                  name: 'documentType',
                  label: 'Hình thức văn bản',
                  type: 'text',
                  admin: {
                    width: '33.33%',
                    placeholder: 'VD: Quyết định, Kế hoạch, Phác đồ, Thông tư...',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'issuedAt',
                  label: 'Ngày ban hành',
                  type: 'date',
                  admin: {
                    width: '33.33%',
                    date: {
                      displayFormat: 'dd/MM/yyyy',
                      pickerAppearance: 'dayOnly',
                    },
                  },
                },
                {
                  name: 'effectiveAt',
                  label: 'Ngày có hiệu lực',
                  type: 'date',
                  admin: {
                    width: '33.33%',
                    date: {
                      displayFormat: 'dd/MM/yyyy',
                      pickerAppearance: 'dayOnly',
                    },
                  },
                },
                {
                  name: 'category',
                  label: 'Loại tài liệu cũ (tương thích dữ liệu)',
                  type: 'text',
                  admin: {
                    width: '33.33%',
                    readOnly: true,
                    description: 'Giữ dữ liệu cũ; tài liệu mới nên chọn Chuyên mục chuẩn.',
                  },
                },
              ],
            },
            {
              name: 'summary',
              label: 'Trích yếu nội dung văn bản',
              type: 'textarea',
              admin: {
                rows: 3,
                placeholder: 'Trích yếu tóm tắt nội dung chính của văn bản...',
              },
            },
            {
              name: 'file',
              label: 'Tệp văn bản / tài liệu đính kèm (PDF, Word, Excel...)',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description: 'Tải tệp mới hoặc chọn lại tệp đã có trong Thư viện. Hệ thống tự động mở trình đọc PDF trực tuyến.',
              },
            },
            {
              name: 'cover',
              label: 'Ảnh đại diện (không bắt buộc)',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Không bắt buộc. Nếu bỏ trống website dùng ảnh mặc định Văn bản – Tài liệu trong Hệ thống → Ảnh mặc định nội dung.',
              },
            },
          ],
        },
        {
          label: '📝 Nội dung văn bản chi tiết',
          fields: [
            {
              name: 'content',
              label: 'Nội dung toàn văn (soạn thảo nếu có)',
              type: 'richText',
              admin: {
                description: 'Tùy chọn: Nhập nội dung toàn văn của văn bản trực tiếp bằng trình soạn thảo.',
              },
            },
          ],
        },
        {
          label: '🎨 Định dạng & Quyền bảo mật',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'accessMode',
                  label: 'Chế độ bảo mật & Quyền truy cập',
                  type: 'select',
                  defaultValue: 'public',
                  options: [
                    { label: 'Công khai (Mọi người đều được xem và tải)', value: 'public' },
                    { label: 'Mã PIN bảo mật (Khóa xem, khóa tải, khóa in khi chưa có mã)', value: 'pin' },
                    { label: 'Lưu hành nội bộ (Chỉ nhân viên y tế / Bác sĩ)', value: 'internal' },
                    { label: 'Khóa hoàn toàn (Chỉ xem trích yếu, cấm tải)', value: 'locked' },
                  ],
                  admin: {
                    width: '50%',
                    description: 'Nếu chọn Mã PIN: Trình xem file, nút Tải về và lệnh In PDF sẽ bị chặn 100% cho đến khi người dùng nhập đúng mã PIN.',
                  },
                },
                {
                  name: 'pinCode',
                  label: 'Mã PIN xác thực riêng (nếu dùng mã PIN)',
                  type: 'text',
                  admin: {
                    width: '50%',
                    placeholder: 'VD: TL2026 (để trống sẽ dùng mã PIN chung của viện)',
                    description: 'Đặt mã PIN riêng cho văn bản này. Nếu để trống, hệ thống tự động áp dụng Mã PIN mặc định trong Cài đặt Hệ thống.',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'allowDownload',
                  label: 'Cho phép tải tài liệu về máy',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    width: '33.33%',
                    description: 'Nếu tắt, nút Tải về sẽ bị ẩn và link tải trực tiếp bị khóa để chỉ cho phép xem trực tuyến.',
                  },
                },
                {
                  name: 'preventCopy',
                  label: 'Chống sao chép / Chống lấy thông tin',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    width: '33.33%',
                    description: 'Khi bật: chặn chuột phải, chặn bôi đen/copy chữ và chặn các phím tắt sao chép nội dung.',
                  },
                },
                {
                  name: 'showViewer',
                  label: 'Nhúng khung xem tài liệu trực tiếp',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: {
                    width: '33.33%',
                    description: 'Tự động mở trình đọc tài liệu PDF/Word trực tiếp ngay trên trang chi tiết.',
                  },
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Định dạng & Thẩm mỹ hiển thị (Styling Controls)',
              admin: {
                initCollapsed: true,
                description: 'Tùy chỉnh canh lề, màu sắc và kích cỡ chữ hiển thị văn bản ra website.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'textAlign',
                      label: 'Canh lề tiêu đề & trích yếu',
                      type: 'select',
                      defaultValue: 'left',
                      options: [
                        { label: 'Canh trái (Left)', value: 'left' },
                        { label: 'Canh giữa (Center)', value: 'center' },
                        { label: 'Canh phải (Right)', value: 'right' },
                        { label: 'Canh đều 2 bên (Justify)', value: 'justify' },
                      ],
                      admin: { width: '33.33%' },
                    },
                    {
                      name: 'titleColor',
                      label: 'Màu sắc tiêu đề',
                      type: 'select',
                      defaultValue: 'default',
                      options: [
                        { label: 'Đen đậm y tế (Mặc định)', value: 'default' },
                        { label: 'Xanh dương đậm (Navy)', value: 'navy' },
                        { label: 'Xanh y tế (Primary Blue)', value: 'blue' },
                        { label: 'Xanh lá y tế (Green)', value: 'green' },
                        { label: 'Đỏ nổi bật (Red)', value: 'red' },
                      ],
                      admin: { width: '33.33%' },
                    },
                    {
                      name: 'titleSize',
                      label: 'Kích cỡ chữ tiêu đề',
                      type: 'select',
                      defaultValue: 'normal',
                      options: [
                        { label: 'Tiêu chuẩn (Vừa vặn)', value: 'normal' },
                        { label: 'Lớn (Nổi bật)', value: 'large' },
                        { label: 'Rất lớn (Đặc biệt)', value: 'xlarge' },
                      ],
                      admin: { width: '33.33%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'summaryColor',
                      label: 'Màu sắc chữ trích yếu',
                      type: 'select',
                      defaultValue: 'default',
                      options: [
                        { label: 'Đen xám chuẩn (Mặc định)', value: 'default' },
                        { label: 'Xanh đen dịu mắt (Slate)', value: 'slate' },
                        { label: 'Xám đậm tương phản (Dark)', value: 'dark' },
                      ],
                      admin: { width: '50%' },
                    },
                    {
                      name: 'summarySize',
                      label: 'Kích cỡ chữ trích yếu',
                      type: 'select',
                      defaultValue: 'normal',
                      options: [
                        { label: 'Chuẩn (0.96rem)', value: 'normal' },
                        { label: 'Lớn vừa (1.05rem)', value: 'large' },
                        { label: 'Nhỏ gọn (0.9rem)', value: 'small' },
                      ],
                      admin: { width: '50%' },
                    },
                  ],
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
                    description: 'Để trống sẽ tự động lấy Tên văn bản.',
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
                description: 'Để trống sẽ tự động lấy từ ô Trích yếu.',
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
                    description: 'Bật nếu không muốn Google lập chỉ mục văn bản này.',
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
  ],
}
