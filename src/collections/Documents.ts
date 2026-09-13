import type { CollectionConfig } from 'payload'
import { contentDeleteAccess, moduleAccess } from '@/access'
import { categoryRelationshipField, seoFields, slugField } from '@/fields/common'

export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: { singular: 'Văn bản / Tài liệu', plural: 'Văn bản / Tài liệu' },
  admin: { useAsTitle: 'title', group: '📰 Truyền thông & Văn bản', defaultColumns: ['title', 'number', 'categoryRef', 'issuedAt', 'year', 'updatedAt'] },
  access: { read: () => true, create: moduleAccess('documents', 'create'), update: moduleAccess('documents', 'edit'), delete: contentDeleteAccess('documents') },
  trash: true,
  versions: { maxPerDoc: 30 },
  fields: [
    { name: 'title', label: 'Tên văn bản', type: 'text', required: true },
    slugField('title', 'documents'),
    { name: 'number', label: 'Số / ký hiệu', type: 'text', index: true },
    categoryRelationshipField('documents'),
    { name: 'category', label: 'Loại tài liệu cũ (tương thích dữ liệu)', type: 'text', admin: { description: 'Giữ dữ liệu cũ; tài liệu mới nên chọn Chuyên mục chuẩn.' } },
    { name: 'issuer', label: 'Cơ quan / đơn vị ban hành', type: 'text' },
    { name: 'issuedAt', label: 'Ngày ban hành', type: 'date' },
    { name: 'effectiveAt', label: 'Ngày hiệu lực', type: 'date' },
    { name: 'year', label: 'Năm ban hành', type: 'number' },
    { name: 'documentType', label: 'Hình thức văn bản', type: 'text', admin: { placeholder: 'Ví dụ: Phác đồ điều trị, Kế hoạch, Quyết định, Hướng dẫn chuyên môn...' } },
    { name: 'signer', label: 'Người ký duyệt', type: 'text' },
    { name: 'summary', label: 'Trích yếu', type: 'textarea' },
    { name: 'content', label: 'Nội dung chi tiết (nếu có)', type: 'richText' },
    {
      type: 'row',
      fields: [
        {
          name: 'allowDownload',
          label: 'Cho phép tải tài liệu về máy',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Nếu tắt, nút Tải về sẽ bị ẩn và link tải trực tiếp bị khóa để chỉ cho phép xem trực tuyến.' },
        },
        {
          name: 'preventCopy',
          label: 'Chống sao chép / Chống lấy thông tin',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Khi bật: chặn chuột phải, chặn bôi đen/copy chữ và chặn các phím tắt sao chép nội dung.' },
        },
        {
          name: 'showViewer',
          label: 'Nhúng khung xem tài liệu trực tiếp',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Tự động mở trình đọc tài liệu PDF/Word trực tiếp ngay trên trang chi tiết.' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Định dạng & Thẩm mỹ hiển thị (Styling Controls)',
      admin: { initCollapsed: true, description: 'Tùy chỉnh canh lề, màu sắc và kích cỡ chữ hiển thị văn bản ra website' },
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
    { name: 'cover', label: 'Ảnh đại diện', type: 'upload', relationTo: 'media', admin: { description: 'Không bắt buộc. Nếu bỏ trống website dùng ảnh mặc định Văn bản – Tài liệu trong Admin → Ảnh mặc định nội dung.' } },
    { name: 'file', label: 'Tệp đính kèm', type: 'upload', relationTo: 'media', required: true, admin: { description: 'Tải tệp mới hoặc chọn lại tệp đã có trong Thư viện Tệp & Hình ảnh.' } },
    ...seoFields,
  ],
}
