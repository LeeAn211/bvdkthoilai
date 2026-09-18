import type { CollectionConfig } from 'payload'
import { anyone, organizationDepartmentScopedAccess } from '@/access'
import { seoFields, slugField, slugifyVietnamese } from '@/fields/common'

export const Specialties: CollectionConfig = {
  slug: 'specialties',
  labels: { singular: 'Chuyên khoa', plural: 'Chuyên khoa' },
  admin: {
    useAsTitle: 'name',
    group: '🩺 Chuyên môn & Tổ chức',
    defaultColumns: ['name', 'department', 'order', 'active', 'updatedAt'],
    description: 'Chuyên khoa là lĩnh vực chuyên môn, KHÔNG dùng để sao chép tên Khoa/Phòng. Mỗi chuyên khoa có thể liên kết với một Khoa/Phòng phụ trách.',
  },
  access: {
    read: anyone,
    create: organizationDepartmentScopedAccess('specialties', 'create'),
    update: organizationDepartmentScopedAccess('specialties', 'edit'),
    delete: organizationDepartmentScopedAccess('specialties', 'delete'),
  },
  versions: { drafts: true, maxPerDoc: 20 },
  hooks: {
    beforeValidate: [async ({ data, req }) => {
      const record: any = data || {}
      const user: any = req.user
      const privileged = !user || ['super-admin', 'system-admin', 'admin', 'hr'].includes(user.role)
      const assigned = typeof user?.department === 'object' ? user.department?.id : user?.department
      if (!privileged && assigned) record.department = assigned

      // Nếu không nhập Tên chuyên khoa nhưng có chọn Khoa / Phòng phụ trách,
      // tự động lấy Tên của Khoa / Phòng đó làm Tên chuyên khoa mặc định
      const hasCustomName = typeof record.name === 'string' && record.name.trim().length > 0
      if (!hasCustomName && record.department) {
        const deptId = typeof record.department === 'object' ? record.department?.id : record.department
        if (deptId) {
          try {
            const dept = await req.payload.findByID({
              collection: 'departments',
              id: deptId,
              depth: 0,
            })
            if (dept?.name) {
              record.name = dept.name
            }
          } catch {
            // Không tìm thấy khoa/phòng hoặc có lỗi truy vấn
          }
        }
      }

      // Tự động sinh slug nếu chưa có hoặc đang để trống
      if (!record.slug && record.name && typeof record.name === 'string' && record.name.trim().length > 0) {
        record.slug = slugifyVietnamese(record.name)
      }

      return record
    }],
  },
  fields: [
    {
      name: 'useDepartmentName',
      label: 'Cờ dữ liệu cũ: dùng tên Khoa/Phòng',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        hidden: true,
        description: 'Trường tương thích dữ liệu cũ. Không sử dụng cho bản ghi mới.',
      },
    },
    {
      name: 'department',
      label: 'Khoa / Phòng phụ trách',
      type: 'relationship',
      relationTo: 'departments',
      required: true,
      admin: {
        description: 'Chọn đơn vị phụ trách chuyên khoa. Nếu để trống "Tên chuyên khoa" bên dưới, hệ thống sẽ tự động lấy tên Khoa/Phòng này làm tên hiển thị.',
      },
    },
    {
      name: 'name',
      label: 'Tên chuyên khoa',
      type: 'text',
      required: false,
      validate: (value: unknown, { siblingData }: any) => {
        const valStr = typeof value === 'string' ? value.trim() : ''
        if (!valStr && !siblingData?.department) {
          return 'Vui lòng nhập Tên chuyên khoa hoặc chọn Khoa / Phòng phụ trách để hệ thống tự động điền.'
        }
        return true
      },
      admin: {
        placeholder: 'Để trống sẽ tự động lấy theo Tên Khoa / Phòng phụ trách ở trên...',
        description: 'Nếu muốn đặt tên chuyên môn riêng biệt (VD: Tim mạch, Nội soi, Phục hồi chức năng...) thì nhập tại đây. Nếu để trống, hệ thống sẽ tự động lấy tên của Khoa/Phòng phụ trách làm mặc định hiển thị.',
      },
    },
    slugField('name', 'specialties'),
    { name: 'summary', label: 'Giới thiệu ngắn', type: 'textarea' },
    { name: 'content', label: 'Giới thiệu chi tiết', type: 'richText' },
    {
      name: 'cover',
      label: 'Ảnh đại diện chuyên khoa',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: '💡 Khuyên dùng ảnh nằm ngang tỷ lệ 16:9 hoặc 16:10 (khoảng 1200×675px hoặc 800×450px). Có thể tải ảnh chụp phòng khám, bác sĩ hoặc thiết bị chuyên khoa.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'coverFitHome',
          label: '🖼️ Cách hiển thị ảnh ở NGOÀI TRANG CHỦ',
          type: 'select',
          defaultValue: 'cover-top',
          options: [
            { label: 'Lấp đầy khung - Canh đỉnh đầu / mặt bác sĩ (Khuyên dùng - cover-top)', value: 'cover-top' },
            { label: 'Vừa vặn khung, trọn vẹn 100% không bị cắt (contain)', value: 'contain' },
            { label: 'Lấp đầy khung - Canh chính giữa tâm ảnh (cover-center)', value: 'cover-center' },
            { label: 'Lấp đầy khung - Canh phần dưới (cover-bottom)', value: 'cover-bottom' },
            { label: 'Lấp đầy khung chuẩn (cover)', value: 'cover' },
            { label: 'Co giãn vừa kín khung ảnh (fill)', value: 'fill' },
          ],
          admin: {
            width: '50%',
            description: 'Tùy chọn hiển thị riêng biệt cho Thẻ Chuyên khoa trên trang chủ.',
          },
        },
        {
          name: 'coverFitDetail',
          label: '🖼️ Cách hiển thị ảnh TRONG TRANG CHI TIẾT',
          type: 'select',
          defaultValue: 'contain',
          options: [
            { label: 'Vừa vặn khung, trọn vẹn 100% không bị cắt (Khuyên dùng - contain)', value: 'contain' },
            { label: 'Lấp đầy khung - Canh đỉnh đầu / phần trên (cover-top)', value: 'cover-top' },
            { label: 'Lấp đầy khung - Canh chính giữa tâm ảnh (cover-center)', value: 'cover-center' },
            { label: 'Lấp đầy khung - Canh phần dưới (cover-bottom)', value: 'cover-bottom' },
            { label: 'Lấp đầy khung chuẩn (cover)', value: 'cover' },
            { label: 'Co giãn vừa kín khung ảnh (fill)', value: 'fill' },
          ],
          admin: {
            width: '50%',
            description: 'Tùy chọn hiển thị riêng biệt cho Khung ảnh lớn trên trang chi tiết chuyên khoa.',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'coverPosition',
          label: 'Điểm lấy nét ảnh (Trọng tâm)',
          type: 'select',
          defaultValue: 'top',
          options: [
            { label: 'Ưu tiên phần trên (Lấy rõ đầu/mặt - Mặc định)', value: 'top' },
            { label: 'Chính giữa ảnh (Center)', value: 'center' },
            { label: 'Ưu tiên phần dưới (Bottom)', value: 'bottom' },
          ],
          admin: {
            width: '50%',
            description: 'Chỉnh góc lấy nét khi ảnh bị xén mất phần đầu hoặc khuôn mặt.',
          },
        },
      ],
    },
    { name: 'services', label: 'Dịch vụ / kỹ thuật nổi bật', type: 'richText' },
    {
      type: 'collapsible',
      label: '⚙️ Cấu hình Trang Chi Tiết & Bật/Tắt các khối (Sidebar, Bác sĩ, Phác đồ, Banner)',
      admin: {
        initCollapsed: false,
        description: 'Tùy chỉnh bật/tắt độc lập từng khối nội dung trên trang chi tiết chuyên khoa và chèn thêm các banner quảng cáo tùy ý ở sidebar bên trái.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'showDepartmentCard',
              label: 'Hiển thị khối "Đơn vị phụ trách" (Sidebar)',
              type: 'checkbox',
              defaultValue: true,
              admin: { width: '50%' },
            },
            {
              name: 'showBookingCard',
              label: 'Hiển thị khối "Đăng ký khám bệnh" (Sidebar)',
              type: 'checkbox',
              defaultValue: true,
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          admin: {
            condition: (_data, siblingData) => siblingData?.showBookingCard !== false,
          },
          fields: [
            {
              name: 'customBookingTitle',
              label: 'Tiêu đề khối Đăng ký (Ghi đè mặc định)',
              type: 'text',
              admin: { width: '50%', placeholder: 'Ví dụ: Đăng ký khám bệnh' },
            },
            {
              name: 'customBookingButtonLabel',
              label: 'Tên nút đặt khám',
              type: 'text',
              admin: { width: '50%', placeholder: 'Ví dụ: Đặt khám chuyên khoa' },
            },
          ],
        },
        {
          type: 'row',
          admin: {
            condition: (_data, siblingData) => siblingData?.showBookingCard !== false,
          },
          fields: [
            {
              name: 'customBookingButtonUrl',
              label: 'Đường dẫn liên kết nút đặt khám (Để trống dùng Medpro)',
              type: 'text',
              admin: { width: '50%', placeholder: 'https://medpro.vn/...' },
            },
            {
              name: 'customHotline',
              label: 'Số Hotline tiếp nhận riêng (Nếu khác hotline bệnh viện)',
              type: 'text',
              admin: { width: '50%', placeholder: '02923686115' },
            },
          ],
        },
        {
          name: 'customBookingDesc',
          label: 'Mô tả khối Đăng ký (Để trống dùng mặc định)',
          type: 'textarea',
          admin: {
            condition: (_data, siblingData) => siblingData?.showBookingCard !== false,
            placeholder: 'Chủ động chọn bác sĩ và thời gian khám qua cổng đăng ký trực tuyến...',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'showNoticeBox',
              label: 'Hiển thị khối "Lưu ý BHYT & Giờ trực" (Sidebar)',
              type: 'checkbox',
              defaultValue: true,
              admin: { width: '50%' },
            },
            {
              name: 'customNoticeText',
              label: 'Nội dung khối lưu ý (Ghi đè mặc định)',
              type: 'text',
              admin: {
                width: '50%',
                condition: (_data, siblingData) => siblingData?.showNoticeBox !== false,
                placeholder: 'Ví dụ: Áp dụng đầy đủ quyền lợi BHYT đúng tuyến...',
              },
            },
          ],
        },
        {
          name: 'sidebarBanners',
          label: '🖼️ Danh sách Banner Quảng cáo / Tiện ích (Chọn ảnh & Thêm trực quan)',
          type: 'array',
          labels: { singular: 'Banner', plural: 'Các Banner quảng cáo' },
          admin: {
            description: 'Bấm "Thêm Banner" để tải lên hoặc chọn ảnh từ thư viện, nhập tiêu đề và liên kết tùy ý mà không cần dùng mã JSON.',
            initCollapsed: false,
          },
          fields: [
            {
              name: 'image',
              label: 'Ảnh Banner',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Tải ảnh mới hoặc chọn ảnh từ thư viện media của bệnh viện.' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'title',
                  label: 'Tiêu đề Banner (Tùy chọn)',
                  type: 'text',
                  admin: { width: '50%', placeholder: 'Ví dụ: Gói tầm soát sức khỏe' },
                },
                {
                  name: 'btnText',
                  label: 'Tên nút bấm (Tùy chọn)',
                  type: 'text',
                  admin: { width: '50%', placeholder: 'Ví dụ: Xem chi tiết' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'link',
                  label: 'Đường dẫn liên kết khi bấm vào',
                  type: 'text',
                  admin: { width: '70%', placeholder: '/bang-gia hoặc https://...' },
                },
                {
                  name: 'openNewTab',
                  label: 'Mở tab mới',
                  type: 'checkbox',
                  defaultValue: true,
                  admin: { width: '30%' },
                },
              ],
            },
            {
              name: 'desc',
              label: 'Mô tả ngắn (Tùy chọn)',
              type: 'textarea',
              admin: { placeholder: 'Nội dung phụ tóm tắt chương trình hoặc tiện ích...' },
            },
          ],
        },
        {
          name: 'sidebarBannersJson',
          label: 'Danh sách Banner bổ sung nâng cao (JSON tùy ý - Tùy chọn)',
          type: 'textarea',
          admin: {
            description: '💡 (Dành cho nâng cao) Nếu đã dùng danh sách chọn ảnh ở trên thì có thể để trống ô này.',
            placeholder: '[{"title": "TIÊM CHỦNG VẮC XIN", "desc": "Danh mục vắc xin mới nhất", "btnText": "Xem lịch tiêm", "link": "/tiem-chung"}]',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'showCoverImage',
              label: 'Hiển thị Ảnh bìa chuyên khoa',
              type: 'checkbox',
              defaultValue: true,
              admin: { width: '50%' },
            },
            {
              name: 'showSummaryLead',
              label: 'Hiển thị dòng Tóm tắt chuyên môn',
              type: 'checkbox',
              defaultValue: true,
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'showContentSection',
              label: 'Hiển thị khối "Giới thiệu chuyên môn" (RichText)',
              type: 'checkbox',
              defaultValue: true,
              admin: { width: '50%' },
            },
            {
              name: 'showServicesSection',
              label: 'Hiển thị khối "Dịch vụ & Kỹ thuật nổi bật"',
              type: 'checkbox',
              defaultValue: true,
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'showDoctorsSection',
              label: 'Hiển thị khối "Đội ngũ Bác sĩ chuyên khoa"',
              type: 'checkbox',
              defaultValue: true,
              admin: { width: '33.33%' },
            },
            {
              name: 'showProtocolsSection',
              label: 'Hiển thị khối "Phác đồ & Hướng dẫn điều trị"',
              type: 'checkbox',
              defaultValue: true,
              admin: { width: '33.33%' },
            },
            {
              name: 'showRelatedSection',
              label: 'Hiển thị khối "Các chuyên khoa liên quan"',
              type: 'checkbox',
              defaultValue: true,
              admin: { width: '33.33%' },
            },
          ],
        },
      ],
    },
    { name: 'order', label: 'Thứ tự hiển thị', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    { name: 'active', label: 'Hiển thị trên website', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    ...seoFields,
  ],
}
