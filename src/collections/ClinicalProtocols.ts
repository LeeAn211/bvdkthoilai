import type { CollectionConfig } from 'payload'
import { adminField, contentDeleteAccess, moduleAccess } from '@/access'
import { seoFields, slugField } from '@/fields/common'
import { protectDocumentMedia } from '@/hooks/protectDocumentMedia'

export const ClinicalProtocols: CollectionConfig = {
  slug: 'clinical-protocols',
  labels: { singular: 'Phác đồ điều trị', plural: 'Phác đồ điều trị' },
  admin: {
    useAsTitle: 'title',
    group: '🩺 Chuyên môn & Tổ chức',
    defaultColumns: ['title', 'code', 'specialty', 'views', 'issuedAt', 'allowDownload', 'preventCopy', 'updatedAt'],
    description: 'Quản lý danh mục và tài liệu Phác đồ điều trị, Hướng dẫn chẩn đoán & điều trị chuẩn y khoa của Bệnh viện.',
  },
  access: {
    read: () => true,
    create: moduleAccess('clinical-protocols', 'create'),
    update: moduleAccess('clinical-protocols', 'edit'),
    delete: contentDeleteAccess('clinical-protocols'),
  },
  hooks: { afterChange: [protectDocumentMedia] },
  trash: true,
  versions: { maxPerDoc: 30 },
  fields: [
    { name: 'title', label: 'Tên phác đồ / Hướng dẫn điều trị', type: 'text', required: true },
    slugField('title', 'clinical-protocols'),
    {
      type: 'row',
      fields: [
        { name: 'code', label: 'Mã phác đồ / Số quyết định', type: 'text', index: true, admin: { width: '50%' } },
        {
          name: 'specialty',
          label: 'Chuyên khoa / Lĩnh vực áp dụng',
          type: 'relationship',
          relationTo: 'specialties',
          admin: { width: '50%', description: 'Chọn chuyên khoa áp dụng (Nội, Ngoại, Sản, Nhi, Cấp cứu...)' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'documentType', label: 'Hình thức văn bản', type: 'text', defaultValue: 'Phác đồ điều trị', admin: { width: '50%' } },
        { name: 'issuer', label: 'Cơ quan / Đơn vị ban hành', type: 'text', defaultValue: 'Bệnh viện Đa khoa Khu vực Thới Lai', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'signer', label: 'Người ký duyệt / Hội đồng chuyên môn', type: 'text', admin: { width: '33.33%' } },
        { name: 'issuedAt', label: 'Ngày ban hành / áp dụng', type: 'date', admin: { width: '33.33%' } },
        { name: 'effectiveAt', label: 'Ngày hiệu lực', type: 'date', admin: { width: '33.33%' } },
      ],
    },
    { name: 'summary', label: 'Trích yếu / Tóm tắt phác đồ', type: 'textarea' },
    { name: 'content', label: 'Nội dung chi tiết (soạn thảo nếu có)', type: 'richText' },
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
            { label: '👁️ Chỉ cho xem trực tuyến (Cấm tải, cấm sao chép, cấm in ấn mọi hình thức)', value: 'view_only' },
            { label: 'Mã PIN bảo mật (Khóa xem, khóa tải, khóa in khi chưa có mã)', value: 'pin' },
            { label: 'Lưu hành nội bộ (Chỉ nhân viên y tế / Bác sĩ)', value: 'internal' },
            { label: 'Khóa hoàn toàn (Chỉ xem trích yếu, cấm tải)', value: 'locked' },
          ],
          admin: {
            width: '50%',
            description: 'Nếu chọn "Chỉ cho xem trực tuyến": Hệ thống mở khung đọc trực tiếp trên web nhưng chặn 100% nút tải về, chặn phím tắt copy, chặn chuột phải và chặn lệnh in ấn với mọi hình thức.',
          },
        },
        {
          name: 'pinCode',
          label: 'Mã PIN xác thực riêng (nếu dùng mã PIN)',
          type: 'text',
          access: { create: adminField, read: () => false, update: adminField },
          admin: {
            width: '50%',
            placeholder: 'VD: TL2026 (để trống sẽ dùng mã PIN chung của viện)',
            description: 'Đặt mã PIN riêng cho phác đồ này. Nếu để trống, hệ thống tự động áp dụng Mã PIN mặc định trong Cài đặt Hệ thống.',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'allowDownload',
          label: 'Cho phép tải phác đồ về máy',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Bật: hiển thị nút Tải về. Tắt: chỉ cho phép xem trực tuyến trên website.' },
        },
        {
          name: 'preventCopy',
          label: 'Chống sao chép / Chống lấy thông tin',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Bật: chặn chuột phải, chặn bôi đen/copy chữ và chặn các phím tắt sao chép nội dung.' },
        },
        {
          name: 'showViewer',
          label: 'Nhúng khung xem tài liệu trực tiếp',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Tự động mở khung đọc tài liệu PDF/Word trực tiếp ngay trên trang chi tiết.' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Định dạng & Thẩm mỹ hiển thị (Styling Controls)',
      admin: { initCollapsed: true, description: 'Tùy chỉnh canh lề, màu sắc và kích cỡ chữ hiển thị phác đồ ra website' },
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
    {
      name: 'file',
      label: 'Tệp phác đồ đính kèm (PDF / Word)',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: { description: 'Tải tệp PDF/Word phác đồ để hệ thống nhúng khung đọc trực tiếp cho bác sĩ và người xem.' },
    },
    {
      name: 'cover',
      label: 'Ảnh đại diện',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Không bắt buộc. Nếu bỏ trống sẽ dùng ảnh mặc định của mục Văn bản – Tài liệu.' },
    },
    {
      name: 'views',
      label: 'Lượt xem phác đồ',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Số lượt truy cập và xem chi tiết phác đồ điều trị.',
      },
    },
    ...seoFields,
  ],
}
