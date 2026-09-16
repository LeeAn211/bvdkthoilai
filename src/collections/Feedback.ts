import type { CollectionConfig } from 'payload'
import { moduleAccess } from '@/access'

export const Feedback: CollectionConfig = {
  slug: 'feedback',
  labels: { singular: 'Phản hồi người bệnh', plural: 'Phản hồi người bệnh' },
  admin: {
    useAsTitle: 'name',
    group: '💬 Chăm sóc người bệnh & Khảo sát',
    defaultColumns: ['code', 'name', 'phone', 'type', 'status', 'createdAt'],
  },
  access: {
    create: moduleAccess('feedback', 'create'),
    read: moduleAccess('feedback', 'view'),
    update: moduleAccess('feedback', 'edit'),
    delete: moduleAccess('feedback', 'delete'),
  },
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        // Tự động gán thời điểm giải quyết khi chuyển sang trạng thái "done"
        if (data?.status === 'done' && originalDoc?.status !== 'done' && !data.resolvedAt) {
          return { ...data, resolvedAt: new Date().toISOString() }
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        if (!doc?.code) return doc

        // Đồng bộ 2 chiều với feedbackCases nếu tồn tại hồ sơ tương ứng
        try {
          const cases = await req.payload.find({
            collection: 'feedbackCases',
            where: { code: { equals: doc.code } },
            limit: 1,
            depth: 0,
            overrideAccess: true,
            req,
          })

          if (cases.docs.length > 0) {
            const caseItem: any = cases.docs[0]
            const mappedStatus = doc.status === 'done' ? 'resolved' : doc.status === 'processing' ? 'processing' : 'new'
            const updatePayload: any = {}

            if (caseItem.status !== mappedStatus) {
              updatePayload.status = mappedStatus
            }
            if (doc.response && doc.response !== caseItem.publicResponse) {
              updatePayload.publicResponse = doc.response
            }

            if (Object.keys(updatePayload).length > 0) {
              await req.payload.update({
                collection: 'feedbackCases',
                id: caseItem.id,
                data: updatePayload,
                overrideAccess: true,
                req,
              })

              // Ghi log hành động vào feedbackActions để người bệnh thấy trên dòng thời gian
              let actionType = 'status'
              let actionNote = `Cập nhật trạng thái sang: ${doc.status === 'done' ? 'Đã xử lý' : doc.status === 'processing' ? 'Đang xử lý' : 'Mới tiếp nhận'}`
              if (updatePayload.publicResponse) {
                actionType = 'response'
                actionNote = `Bệnh viện gửi phản hồi chính thức cho người bệnh.`
              }

              await req.payload.create({
                collection: 'feedbackActions',
                data: {
                  case: caseItem.id,
                  action: actionType as any,
                  note: actionNote,
                  fromStatus: caseItem.status,
                  toStatus: mappedStatus,
                  performedBy: doc.handledBy || req.user?.id,
                  public: true,
                },
                overrideAccess: true,
                req,
              })
            }
          }
        } catch (syncErr) {
          console.warn('Sync feedback to feedbackCases error:', syncErr)
        }

        return doc
      },
    ],
  },
  fields: [
    {
      name: 'code',
      label: 'Mã tra cứu phản ánh',
      type: 'text',
      index: true,
      admin: {
        readOnly: true,
        description: 'Mã hồ sơ định danh duy nhất cấp cho người bệnh để tra cứu tiến độ trực tuyến.',
      },
    },
    {
      type: 'row',
      fields: [
        { name: 'name', label: 'Họ và tên người bệnh / Thân nhân', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'phone', label: 'Số điện thoại', type: 'text', required: true, admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', label: 'Email liên hệ', type: 'email', admin: { width: '50%' } },
        {
          name: 'type',
          label: 'Phân loại phản hồi',
          type: 'select',
          required: true,
          options: ['Góp ý', 'Khen ngợi', 'Khiếu nại', 'Khác'],
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'message',
      label: 'Nội dung phản ánh của người bệnh',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Chi tiết thông tin ý kiến, đóng góp hoặc khiếu nại do người bệnh gửi.',
      },
    },
    {
      type: 'collapsible',
      label: '📋 QUY TRÌNH XỬ LÝ & PHẢN HỒI NGƯỜI BỆNH (DÀNH CHO BỆNH VIỆN)',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'status',
              label: 'Trạng thái xử lý',
              type: 'select',
              defaultValue: 'new',
              required: true,
              options: [
                { label: 'Mới tiếp nhận', value: 'new' },
                { label: 'Đang xác minh & Xử lý', value: 'processing' },
                { label: 'Đã giải quyết & Phản hồi', value: 'done' },
              ],
              admin: { width: '33.33%' },
            },
            {
              name: 'handledBy',
              label: 'Cán bộ / Lãnh đạo phụ trách xử lý',
              type: 'relationship',
              relationTo: 'users',
              admin: { width: '33.33%' },
            },
            {
              name: 'resolvedAt',
              label: 'Thời điểm hoàn tất',
              type: 'date',
              admin: {
                width: '33.33%',
                date: { pickerAppearance: 'dayAndTime' },
                description: 'Tự động cập nhật khi chuyển sang Đã xử lý hoặc chọn thủ công.',
              },
            },
          ],
        },
        {
          name: 'response',
          label: 'Nội dung phản hồi chính thức gửi cho người bệnh (Công khai)',
          type: 'textarea',
          admin: {
            description: 'Văn bản trả lời chính thức của Bệnh viện Đa khoa Khu vực Thới Lai. Người bệnh sẽ đọc được câu trả lời này khi tra cứu bằng mã hồ sơ.',
          },
        },
        {
          name: 'resolutionNote',
          label: 'Ghi chú & Biện pháp xử lý nội bộ (Nội bộ bệnh viện)',
          type: 'textarea',
          admin: {
            description: 'Ghi chú nghiệp vụ, chỉ đạo của Ban Giám đốc hoặc biên bản xác minh nội bộ (Không hiển thị ra ngoài cho người bệnh).',
          },
        },
      ],
    },
  ],
}
