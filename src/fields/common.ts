import type { Field } from 'payload'

export const slugifyVietnamese = (input: string) =>
  input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

export const slugField = (sourceField = 'title', collectionSlug?: string): Field => ({
  name: 'slug',
  label: 'Đường dẫn (Slug)',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  hooks: {
    beforeValidate: [
      ({ value, siblingData, originalDoc }) => {
        const sibling = siblingData as Record<string, unknown> | undefined
        const original = originalDoc as Record<string, unknown> | undefined
        const source = sibling?.[sourceField] ?? original?.[sourceField]

        // Slug được tự sinh khi để trống, nhưng quản trị viên có thể chỉnh lại.
        // Nếu đã có giá trị thì ưu tiên chính giá trị slug để tránh đổi URL ngoài ý muốn khi sửa tiêu đề.
        if (typeof value === 'string' && value.trim()) {
          return slugifyVietnamese(value)
        }

        if (typeof source === 'string' && source.trim()) {
          return slugifyVietnamese(source)
        }

        return value
      },
    ],
  },
  validate: collectionSlug ? async (value: unknown, { req, siblingData, id }: any) => {
    const sibling = siblingData as Record<string, unknown> | undefined
    const source = sibling?.[sourceField]
    const raw = typeof value === 'string' && value.trim() ? value : source
    const candidate = typeof raw === 'string' ? slugifyVietnamese(raw) : ''
    if (!candidate) return `Không thể tạo slug. Vui lòng nhập ${sourceField === 'title' ? 'tiêu đề' : 'tên'} hoặc nhập slug thủ công.`

    const found = await req.payload.find({
      collection: collectionSlug as any,
      where: { slug: { equals: candidate } },
      limit: 2,
      depth: 0,
      overrideAccess: true,
    })
    const duplicated = found.docs.some((doc: any) => String(doc.id) !== String(id || ''))
    if (duplicated) return `Slug “${candidate}” đã tồn tại. Vui lòng chỉnh slug ở ô này.`
    return true
  } : undefined,
  admin: {
    position: 'sidebar',
    description: `Tự động tạo từ ${sourceField === 'title' ? 'Tiêu đề' : 'Tên'} khi để trống. Có thể chỉnh thủ công. Nếu slug bị trùng, hệ thống sẽ báo ngay để sửa trước khi lưu.`,
  },
})

export const attachmentsField = (name = 'attachments'): Field => ({
  name,
  label: 'Tệp đính kèm',
  type: 'array',
  labels: {
    singular: 'Tệp đính kèm',
    plural: 'Các tệp đính kèm',
  },
  fields: [
    {
      name: 'label',
      label: 'Tên hiển thị',
      type: 'text',
      required: false,
      admin: {
        hidden: true,
        description: 'Website tự động sử dụng tên và định dạng của tệp đã tải lên.',
      },
    },
    {
      name: 'file',
      label: 'Tệp',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: { description: 'Chọn “Tạo mới” để tải tệp lên hoặc “Chọn từ thư viện” để dùng lại tệp đã có.' },
    },
  ],
})

export const seoFields: Field[] = [
  {
    name: 'seoTitle',
    label: 'Tiêu đề SEO',
    type: 'text',
    maxLength: 60,
    admin: { position: 'sidebar' },
  },
  {
    name: 'seoDescription',
    label: 'Mô tả SEO',
    type: 'textarea',
    maxLength: 160,
    admin: { position: 'sidebar' },
  },
  {
    name: 'seoImage',
    label: 'Ảnh SEO / Chia sẻ',
    type: 'upload',
    relationTo: 'media',
    admin: { position: 'sidebar', description: 'Có thể tải ảnh mới hoặc chọn lại ảnh đã có trong Thư viện Tệp & Hình ảnh.' },
  },
  {
    name: 'canonicalUrl',
    label: 'Canonical URL',
    type: 'text',
    admin: { position: 'sidebar', description: 'Để trống để hệ thống dùng URL hiện tại. Chỉ nhập khi cần khai báo URL chuẩn khác.' },
  },
  {
    name: 'noIndex',
    label: 'Không lập chỉ mục (noindex)',
    type: 'checkbox',
    defaultValue: false,
    admin: { position: 'sidebar' },
  },
  {
    name: 'excludeFromSitemap',
    label: 'Không đưa vào sitemap',
    type: 'checkbox',
    defaultValue: false,
    admin: { position: 'sidebar' },
  },
]


export const workflowFields: Field[] = [
  {
    name: 'workflowState',
    label: 'Trạng thái biên tập',
    type: 'select',
    defaultValue: 'draft',
    options: [
      { label: 'Bản nháp', value: 'draft' },
      { label: 'Đã gửi duyệt', value: 'submitted' },
      { label: 'Đã duyệt', value: 'approved' },
      { label: 'Đã xuất bản', value: 'published' },
      { label: 'Đã ẩn', value: 'hidden' },
    ],
    admin: {
      position: 'sidebar',
      description: 'Luồng nội dung: Nháp → Gửi duyệt → Duyệt → Xuất bản/Ẩn. Quyền chuyển trạng thái được kiểm tra phía server.',
    },
  },
]

export const categoryRelationshipField = (scope: string): Field => ({
  name: 'categoryRef',
  label: 'Chuyên mục chuẩn',
  type: 'relationship',
  relationTo: 'categories',
  filterOptions: { scope: { equals: scope }, active: { equals: true } },
  admin: {
    description: 'Chọn chuyên mục quản lý tập trung. Trường chuyên mục cũ vẫn được giữ để tương thích dữ liệu hiện có.',
  },
})

export const createdByField: Field = {
  name: 'createdBy',
  label: 'Người tạo',
  type: 'relationship',
  relationTo: 'users',
  admin: { position: 'sidebar', readOnly: true },
}

export const layoutTemplateField: Field = {
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
    position: 'sidebar',
    description: 'Chọn mẫu giao diện trang chi tiết cho bài viết này.',
  },
}

export const postSourceField: Field = {
  name: 'source',
  label: 'Nguồn bài viết',
  type: 'text',
  admin: {
    position: 'sidebar',
    description: 'Nguồn bài viết. Nếu để trống, hệ thống sẽ tự động hiển thị Nguồn mặc định cài trong Mẫu giao diện.',
    placeholder: 'VD: Bác sĩ CKII Nguyễn Văn A, Theo Bộ Y tế...',
  },
}

export const imageDisplayFields: Field[] = [
  {
    name: 'coverFit',
    label: 'Cách hiển thị ảnh đại diện trên thẻ / trang chủ',
    type: 'select',
    defaultValue: 'cover',
    options: [
      { label: 'Lấp đầy khung (Khuyên dùng)', value: 'cover' },
      { label: 'Vừa vặn toàn bộ ảnh (Không crop, hiển thị trọn vẹn 100%)', value: 'contain' },
    ],
    admin: {
      position: 'sidebar',
      description: 'Nếu ảnh bị cắt mất chi tiết hoặc chữ, chọn “Vừa vặn toàn bộ ảnh” để hiển thị đầy đủ không bị xén.',
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
      position: 'sidebar',
      description: 'Chỉnh góc lấy nét khi ảnh bị xén mất phần đầu hoặc tiêu đề.',
    },
  },
]
