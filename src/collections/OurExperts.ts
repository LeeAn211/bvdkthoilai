import type { CollectionConfig } from 'payload'
import { anyone, loggedIn } from '@/access'
import { seoFields, slugField, slugifyVietnamese } from '@/fields/common'
import { detachNavigationReference } from '@/hooks/detachNavigationReference'

export const OurExperts: CollectionConfig = {
  slug: 'our-experts',
  labels: { singular: 'Chuyên gia của chúng tôi', plural: 'Chuyên gia của chúng tôi' },
  admin: {
    useAsTitle: 'name',
    group: '🩺 Chuyên môn & Tổ chức',
    defaultColumns: ['name', 'position', 'doctorRef', 'badge', 'order', 'active', 'updatedAt'],
    description: 'Quản lý danh sách chuyên gia, bác sĩ xuất hiện trong mục Chuyên gia của chúng tôi trên Trang chủ.',
  },
  access: {
    read: anyone,
    create: loggedIn,
    update: loggedIn,
    delete: loggedIn,
  },
  hooks: {
    beforeDelete: [detachNavigationReference('our-experts')],
    beforeValidate: [
      async ({ data, req }) => {
        if (!data) return data
        if (data.doctorRef) {
          const docId = typeof data.doctorRef === 'object' ? data.doctorRef.id : data.doctorRef
          try {
            const doc: any = await req.payload.findByID({
              collection: 'doctors',
              id: docId,
              depth: 1,
              overrideAccess: true,
            })
            if (doc) {
              // Họ và tên chỉ lấy doc.name (chứa BSCKII. ..., BSCKI. ..., v.v.), TUYỆT ĐỐI không ghép chức vụ doc.title vào trước tên
              const cleanDoctorName = (doc.name || '').trim()
              if (!data.name) {
                data.name = cleanDoctorName
              }
              if (!data.slug) {
                data.slug = doc.slug || slugifyVietnamese(data.name || cleanDoctorName)
              }
              // data.position được giữ riêng nếu người dùng nhập; nếu để trống thì giữ trống để page.tsx tự động lấy từ Bác sĩ liên kết
              // Nếu bên chuyên gia chưa chọn ảnh riêng, tự động gán ảnh đại diện của Bác sĩ đã chọn
              if (!data.image && doc.avatar) {
                data.image = typeof doc.avatar === 'object' ? doc.avatar?.id : doc.avatar
              }
            }
          } catch {}
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'doctorRef',
      label: 'Liên kết chọn Bác sĩ (từ mục Tổ chức → Bác sĩ)',
      type: 'relationship',
      relationTo: 'doctors',
      admin: {
        description: 'Khi chọn bác sĩ từ danh sách Tổ chức → Bác sĩ, hệ thống sẽ tự động dùng hình ảnh, họ tên, chức vụ, học vị và liên kết xem chi tiết của bác sĩ đó. Nếu bác sĩ chưa có ảnh/thông tin mới áp dụng thông tin bên dưới.',
      },
    },
    {
      name: 'name',
      label: 'Họ và tên chuyên gia / bác sĩ',
      type: 'text',
      required: false,
      admin: {
        description: 'Để trống hệ thống sẽ tự lấy từ Bác sĩ đã chọn. Chỉ nhập khi muốn ghi đè hoặc thêm chuyên gia tự do.',
      },
    },
    {
      name: 'slug',
      label: 'Đường dẫn (Slug)',
      type: 'text',
      required: false,
      unique: true,
      index: true,
      hooks: {
        beforeValidate: [
          async ({ value, siblingData, req }) => {
            if (typeof value === 'string' && value.trim()) {
              return slugifyVietnamese(value)
            }
            const sibling = siblingData as Record<string, any> | undefined
            if (sibling?.name && typeof sibling.name === 'string' && sibling.name.trim()) {
              return slugifyVietnamese(sibling.name)
            }
            if (sibling?.doctorRef) {
              const docId = typeof sibling.doctorRef === 'object' ? sibling.doctorRef.id : sibling.doctorRef
              try {
                const doc: any = await req.payload.findByID({
                  collection: 'doctors',
                  id: docId,
                  depth: 0,
                  overrideAccess: true,
                })
                if (doc?.slug) return doc.slug
                if (doc?.name) return slugifyVietnamese(doc.name)
              } catch {}
            }
            return value || `chuyen-gia-${Date.now()}`
          },
        ],
      },
      admin: {
        position: 'sidebar',
        description: 'Tự động tạo từ Tên chuyên gia hoặc Bác sĩ được liên kết khi để trống.',
      },
    },
    {
      name: 'position',
      label: 'Chức vụ / Chức danh chuyên môn',
      type: 'text',
      admin: {
        placeholder: 'Ví dụ: Giám đốc Bệnh viện, Trưởng khoa Khám bệnh, Cố vấn...',
        description: 'Nếu để trống hệ thống sẽ tự lấy từ Bác sĩ liên kết.',
      },
    },
    {
      name: 'showDepartment',
      label: 'Hiển thị Khoa / Phòng sau chức vụ',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Bật để hiển thị dạng "Chức vụ · Khoa/Phòng" (Ví dụ: Phó Giám đốc · Ban Giám đốc). Tắt nếu chỉ muốn hiển thị riêng chức vụ (Ví dụ: Giám đốc).',
      },
    },
    {
      name: 'customSubtitle',
      label: 'Dòng thông tin phụ tùy chỉnh (Ghi đè dòng chức vụ / phòng ban)',
      type: 'text',
      admin: {
        placeholder: 'Ví dụ: Giám đốc hoặc Phó Giám đốc - Ban Giám đốc',
        description: 'Nếu nhập tại đây, hệ thống sẽ ưu tiên hiển thị chính xác nội dung này thay cho chức vụ và phòng ban tự động.',
      },
    },
    {
      name: 'badge',
      label: 'Nhãn nhỏ góc thẻ (Badge)',
      type: 'text',
      admin: {
        placeholder: 'Ví dụ: Ban Giám đốc, Cố vấn chuyên môn...',
        description: 'Nếu để trống sẽ tự lấy tên Chuyên khoa hoặc Khoa/Phòng của bác sĩ.',
      },
    },
    {
      name: 'image',
      label: 'Hình ảnh chân dung',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: '💡 Gợi ý kích thước chuẩn: Tỷ lệ đứng 3:4 hoặc 1:1.15 (ví dụ: 600×800px, 450×600px hoặc 400×460px). Nên dùng ảnh chụp bán thân áo blouse trắng nền sáng. Nếu để trống hệ thống sẽ tự động lấy từ ảnh đại diện (avatar) của Bác sĩ được liên kết.',
      },
    },
    {
      name: 'imageFit',
      label: 'Cách hiển thị ảnh',
      type: 'select',
      defaultValue: 'contain',
      options: [
        { label: 'Vừa vặn khung, trọn vẹn không bị cắt (khuyên dùng - contain)', value: 'contain' },
        { label: 'Lấp đầy khung - Canh đỉnh đầu / mặt rõ nét (cover-top)', value: 'cover-top' },
        { label: 'Lấp đầy khung - Canh chính giữa tâm ảnh (cover-center)', value: 'cover-center' },
        { label: 'Lấp đầy khung - Canh phần dưới (cover-bottom)', value: 'cover-bottom' },
        { label: 'Co giãn vừa kín khung ảnh (fill)', value: 'fill' },
      ],
      admin: {
        description: 'Tùy chọn cách hiển thị để ảnh chân dung không bị mất đầu hoặc viền xấu: Chọn "Vừa vặn khung" để ảnh luôn hiển thị trọn vẹn 100% không bị cắt bất kỳ góc nào; hoặc chọn "Lấp đầy khung - Canh đỉnh đầu" để ảnh phủ kín thẻ nhưng luôn thấy rõ khuôn mặt.',
      },
    },
    {
      name: 'enableLink',
      label: 'Bật liên kết khi bấm vào thẻ chuyên gia',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'BẬT: Bấm vào thẻ chuyên gia sẽ chuyển đến trang chi tiết Bác sĩ hoặc Link tùy chỉnh bên dưới. TẮT: Thẻ chuyên gia chỉ hiển thị thông tin tĩnh để xem (không bấm chuyển trang, không hiện con trỏ link).',
      },
    },
    {
      name: 'url',
      label: 'Đường dẫn liên kết tùy chỉnh (không bắt buộc)',
      type: 'text',
      admin: {
        condition: (_data, siblingData) => siblingData?.enableLink !== false,
        placeholder: 'Ví dụ: /bac-si/nguyen-van-a hoặc link bài viết/giới thiệu...',
        description: 'Chỉ có tác dụng khi bật liên kết ở trên. Nếu để trống, hệ thống sẽ tự động dẫn đến trang chi tiết của bác sĩ (/bac-si/[slug]).',
      },
    },
    {
      name: 'openNewTab',
      label: 'Mở liên kết ở tab mới',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        condition: (_data, siblingData) => siblingData?.enableLink !== false,
      },
    },
    {
      name: 'order',
      label: 'Thứ tự hiển thị',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Số nhỏ hơn sẽ xếp trước trên slider.' },
    },
    {
      name: 'active',
      label: 'Hiển thị trên website',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    ...seoFields,
  ],
}
