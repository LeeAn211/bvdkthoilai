import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '@/access'
import { attachmentsField, seoFields, slugField } from '@/fields/common'
import { detachNavigationReference } from '@/hooks/detachNavigationReference'

export const AdvancedTechniques: CollectionConfig = {
  slug: 'advanced-techniques',
  labels: { singular: 'Kỹ thuật chuyên sâu', plural: 'Kỹ thuật chuyên sâu' },
  admin: {
    useAsTitle: 'title',
    group: 'Nội dung',
    defaultColumns: ['title', 'badge', 'department', 'order', 'active', 'updatedAt'],
    description: 'Quản lý thông tin giới thiệu chi tiết các kỹ thuật cao, công nghệ y tế hiện đại của bệnh viện.',
  },
  access: {
    read: anyone,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn,
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
      admin: { description: 'Hình ảnh đại diện hiển thị trên carousel và danh sách kỹ thuật chuyên sâu.' },
    },
    {
      name: 'imageFit',
      label: 'Cách hiển thị ảnh trên thẻ',
      type: 'select',
      defaultValue: 'contain',
      options: [
        { label: 'Vừa vặn khung, không bị cắt và giữ nguyên tỉ lệ (khuyên dùng)', value: 'contain' },
        { label: 'Lấp đầy khung (crop đều các cạnh)', value: 'cover' },
      ],
      admin: { description: 'Chế độ Vừa vặn (contain) đảm bảo ảnh hoặc poster hiển thị trọn vẹn, không bị méo hay biến dạng.' },
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
