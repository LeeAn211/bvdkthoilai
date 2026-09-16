import type { CollectionConfig } from 'payload'
import { anyone, moduleAccess } from '@/access'
import { attachmentsField, seoFields, slugField } from '@/fields/common'
import { detachNavigationReference } from '@/hooks/detachNavigationReference'

export const AdvancedTechniques: CollectionConfig = {
  slug: 'advanced-techniques',
  labels: { singular: 'Kỹ thuật chuyên sâu', plural: 'Kỹ thuật chuyên sâu' },
  admin: {
    useAsTitle: 'title',
    group: '🩺 Chuyên môn & Tổ chức',
    defaultColumns: ['title', 'badge', 'department', 'order', 'active', 'updatedAt'],
    description: 'Quản lý thông tin giới thiệu chi tiết các kỹ thuật cao, công nghệ y tế hiện đại của bệnh viện.',
  },
  access: {
    read: anyone,
    create: moduleAccess('pages', 'create'),
    update: moduleAccess('pages', 'edit'),
    delete: moduleAccess('pages', 'delete'),
  },
  hooks: {
    beforeDelete: [detachNavigationReference('advanced-techniques')],
  },
  fields: [
    { name: 'title', label: 'Tên kỹ thuật chuyên sâu', type: 'text', required: true },
    slugField('title', 'advanced-techniques'),
    {
      name: 'badge',
      label: 'Nhãn khoa / lĩnh vực (Badge)',
      type: 'text',
      admin: { placeholder: 'Ví dụ: Phòng khám Da - Thẩm mỹ Da, Tầm soát chuyên sâu, Sản phụ khoa...' },
    },
    {
      name: 'department',
      label: 'Khoa / Phòng thực hiện (không bắt buộc)',
      type: 'relationship',
      relationTo: 'departments',
      admin: { description: 'Chọn đơn vị phụ trách triển khai kỹ thuật này.' },
    },
    {
      name: 'cover',
      label: 'Hình ảnh / Poster kỹ thuật',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: '💡 Gợi ý kích thước chuẩn: Tỷ lệ đứng 1:1.15 hoặc 3:4 (ví dụ: 600×700px, 600×800px hoặc 500×580px). Nên sử dụng hình ảnh chất lượng cao chụp trang thiết bị y tế hiện đại, poster kỹ thuật hoặc bác sĩ đang thực hiện thủ thuật.',
      },
    },
    {
      name: 'imageFit',
      label: 'Cách hiển thị ảnh trên thẻ',
      type: 'select',
      defaultValue: 'contain',
      options: [
        { label: 'Vừa vặn khung, trọn vẹn không bị cắt (khuyên dùng - contain)', value: 'contain' },
        { label: 'Lấp đầy khung - Canh đỉnh đầu / phần trên (cover-top)', value: 'cover-top' },
        { label: 'Lấp đầy khung - Canh chính giữa tâm ảnh (cover-center)', value: 'cover-center' },
        { label: 'Lấp đầy khung - Canh phần dưới (cover-bottom)', value: 'cover-bottom' },
        { label: 'Lấp đầy khung chuẩn (cover)', value: 'cover' },
        { label: 'Co giãn vừa kín khung ảnh (fill)', value: 'fill' },
      ],
      admin: {
        description: 'Tùy chọn cách hiển thị để poster/ảnh không bị cắt mất chữ hoặc góc: Chọn "Vừa vặn khung" để ảnh luôn hiển thị trọn vẹn 100% không bị cắt bất kỳ góc nào; hoặc chọn "Lấp đầy khung" nếu muốn ảnh phủ kín toàn bộ thẻ.',
      },
    },
    {
      name: 'enableLink',
      label: 'Bật liên kết khi bấm vào thẻ kỹ thuật',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'BẬT: Bấm vào thẻ kỹ thuật sẽ chuyển đến bài viết chi tiết (/ky-thuat-chuyen-sau/[slug]) hoặc Đường dẫn tùy chỉnh bên dưới. TẮT: Thẻ chỉ hiển thị thông tin để xem (không bấm chuyển trang, không hiện con trỏ link).',
      },
    },
    {
      name: 'customUrl',
      label: 'Đường dẫn liên kết tùy chỉnh (không bắt buộc)',
      type: 'text',
      admin: {
        condition: (_data, siblingData) => siblingData?.enableLink !== false,
        placeholder: 'Ví dụ: /ky-thuat-chuyen-sau/... hoặc link bài viết/giới thiệu khác',
        description: 'Chỉ áp dụng khi bật liên kết ở trên. Nếu để trống, hệ thống sẽ tự động dẫn đến trang chi tiết kỹ thuật (/ky-thuat-chuyen-sau/[slug]).',
      },
    },
    {
      name: 'showCoverInDetail',
      label: 'Hiển thị ảnh đại diện lên đầu bài viết chi tiết',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mặc định là TẮT để đầu bài viết chi tiết gọn gàng, không bị lặp lại ảnh đại diện lớn.',
      },
    },
    {
      name: 'summary',
      label: 'Tóm tắt / Mô tả ngắn',
      type: 'textarea',
      maxLength: 500,
      admin: { description: 'Giới thiệu khái quát về kỹ thuật và ưu điểm nổi bật.' },
    },
    {
      name: 'content',
      label: 'Nội dung bài viết chi tiết',
      type: 'richText',
      required: true,
      admin: { description: 'Trình bày đầy đủ quy trình thực hiện, chỉ định, lợi ích điều trị, thiết bị y tế hiện đại...' },
    },
    {
      name: 'advantages',
      label: 'Ưu điểm vượt trội',
      type: 'array',
      labels: { singular: 'Ưu điểm', plural: 'Các ưu điểm vượt trội' },
      fields: [{ name: 'text', label: 'Nội dung ưu điểm', type: 'text', required: true }],
    },
    {
      name: 'indications',
      label: 'Đối tượng / Trường hợp chỉ định',
      type: 'textarea',
      admin: { description: 'Các trường hợp bệnh nhân nên áp dụng kỹ thuật này.' },
    },
    attachmentsField(),
    {
      name: 'order',
      label: 'Thứ tự ưu tiên',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Số nhỏ hơn sẽ được ưu tiên xếp trước.' },
    },
    {
      name: 'featured',
      label: 'Nổi bật trang chủ',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'active',
      label: 'Hiển thị công khai',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    ...seoFields,
  ],
}
