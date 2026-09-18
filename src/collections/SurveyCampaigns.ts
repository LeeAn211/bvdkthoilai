import type { CollectionConfig } from 'payload'
import { moduleAccess } from '@/access'
import { slugField } from '@/fields/common'

export const SurveyCampaigns: CollectionConfig = {
  slug: 'survey-campaigns',
  labels: {
    singular: 'Đợt khảo sát & Phiếu trả lời',
    plural: 'Khảo sát ý kiến & Kết quả đánh giá',
  },
  admin: {
    useAsTitle: 'title',
    group: '💬 Chăm sóc người bệnh & Khảo sát',
    defaultColumns: ['title', 'slug', 'active', 'startAt', 'endAt'],
    description: 'Hệ thống quản lý thống nhất: Quản lý các đợt khảo sát, câu hỏi, theo dõi số lượt tham gia, xem chi tiết phiếu trả lời, biểu đồ mức độ hài lòng và xuất báo cáo Excel.',
    components: {
      beforeList: ['/src/components/admin/SurveyQuickToolbar#default'],
    },
  },
  access: {
    read: () => true,
    create: moduleAccess('surveys', 'create'),
    update: moduleAccess('surveys', 'edit'),
    delete: moduleAccess('surveys', 'delete'),
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Tên đợt khảo sát' },
    slugField('title', 'survey-campaigns'),
    {
      name: 'useCustomQuestions',
      type: 'checkbox',
      defaultValue: true,
      label: '⚡ Tự thiết lập câu hỏi trực tiếp cho đợt khảo sát này',
      admin: {
        description: 'Mặc định BẬT: Bạn có thể nhập trực tiếp các câu hỏi khảo sát ở danh sách ngay bên dưới mà không cần tạo template phức tạp.',
      },
    },
    {
      name: 'templateVersion',
      type: 'relationship',
      relationTo: 'survey-template-versions',
      label: 'Phiên bản mẫu (snapshot tiêu chuẩn)',
      admin: {
        condition: (data) => !data?.useCustomQuestions,
        description: 'Chọn phiên bản mẫu snapshot nếu dùng hệ thống template phân cấp của Bộ Y tế.',
      },
    },
    {
      name: 'showDemographics',
      type: 'checkbox',
      defaultValue: true,
      label: 'Hiển thị khối thông tin chung người tham gia (Giới tính, Độ tuổi, Đối tượng)',
      admin: {
        condition: (data) => Boolean(data?.useCustomQuestions),
      },
    },
    {
      name: 'surveyFileImportHelper',
      type: 'ui',
      admin: {
        condition: (data) => Boolean(data?.useCustomQuestions),
        components: {
          Field: '/src/components/admin/SurveyFileImportHelper#default',
        },
      },
    },
    {
      name: 'customQuestions',
      type: 'array',
      label: '📋 Danh sách câu hỏi khảo sát linh hoạt',
      labels: {
        singular: 'Câu hỏi',
        plural: 'Các câu hỏi',
      },
      admin: {
        condition: (data) => Boolean(data?.useCustomQuestions),
        description: 'Tự do thêm, sửa, xóa, sắp xếp các câu hỏi khảo sát theo nhu cầu riêng của bệnh viện.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'code',
              type: 'text',
              required: true,
              label: 'Mã câu (VD: C1, Q1)',
              admin: { width: '30%' },
            },
            {
              name: 'type',
              type: 'select',
              required: true,
              defaultValue: 'rating5',
              label: 'Loại câu hỏi',
              admin: { width: '40%' },
              options: [
                { label: '⭐ Mức hài lòng 1 – 5 sao / emoji', value: 'rating5' },
                { label: '🎯 Đánh giá điểm 1 – 10', value: 'rating10' },
                { label: '🔘 Chọn 1 đáp án (Radio)', value: 'single' },
                { label: '☑️ Chọn nhiều đáp án (Checkbox)', value: 'multiple' },
                { label: '⚖️ Đúng / Sai hoặc Có / Không', value: 'yesno' },
                { label: '✍️ Nhập ý kiến tự do (Textarea)', value: 'text' },
              ],
            },
            {
              name: 'required',
              type: 'checkbox',
              defaultValue: true,
              label: 'Bắt buộc trả lời',
              admin: { width: '30%' },
            },
          ],
        },
        {
          name: 'question',
          type: 'textarea',
          required: true,
          label: 'Nội dung câu hỏi khảo sát',
        },
        {
          name: 'options',
          type: 'textarea',
          label: 'Các lựa chọn (Mỗi dòng một lựa chọn)',
          admin: {
            condition: (_data, siblingData) =>
              siblingData?.type === 'single' || siblingData?.type === 'multiple',
            description: 'Nhập mỗi lựa chọn trên 1 dòng. Áp dụng cho loại "Chọn 1 đáp án" hoặc "Chọn nhiều đáp án".',
          },
        },
        {
          name: 'order',
          type: 'number',
          defaultValue: 0,
          label: 'Thứ tự ưu tiên',
        },
      ],
    },
    { name: 'department', type: 'relationship', relationTo: 'departments', label: 'Khoa/Phòng' },
    {
      type: 'row',
      fields: [
        { name: 'startAt', type: 'date', required: true, label: 'Ngày bắt đầu', admin: { width: '50%' } },
        { name: 'endAt', type: 'date', required: true, label: 'Ngày kết thúc', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'active', type: 'checkbox', defaultValue: true, label: 'Đang mở tiếp nhận khảo sát', admin: { width: '50%' } },
        { name: 'anonymous', type: 'checkbox', defaultValue: true, label: 'Cho phép ẩn danh 100%', admin: { width: '50%' } },
      ],
    },
    {
      name: 'publicNote',
      type: 'textarea',
      label: 'Hướng dẫn / Lời ngỏ gửi người tham gia khảo sát',
      admin: {
        description: 'Đoạn văn bản xuất hiện ở đầu phiếu khảo sát để giới thiệu và hướng dẫn người tham gia.',
      },
    },
    {
      name: 'customOptions',
      type: 'group',
      label: '⚙️ Danh mục & Lựa chọn riêng cho đợt khảo sát này (Tùy chọn)',
      admin: {
        description: 'Nếu đợt khảo sát này có danh sách phòng khám, khoa phòng, chức danh hoặc địa bàn riêng biệt, bạn có thể nhập vào đây. Nếu để trống, hệ thống sẽ sử dụng danh sách mặc định của bệnh viện.',
      },
      fields: [
        {
          name: 'outpatientClinics',
          label: 'Danh sách Phòng khám Ngoại trú (Mỗi dòng 1 phòng khám)',
          type: 'textarea',
          admin: {
            description: 'Áp dụng khi đợt khảo sát này dành cho khối ngoại trú. Mỗi dòng là 1 lựa chọn phòng khám.',
            placeholder: 'Phòng khám Nội tổng quát / Tim mạch / Tiểu đường\nPhòng khám Ngoại - Chấn thương\nPhòng khám Sản - Phụ khoa\nPhòng khám Nhi khoa\nLiên chuyên khoa Mắt - TMH - Răng Hàm Mặt\nPhòng khám Y học cổ truyền & Phục hồi chức năng\nKhu vực Tiếp nhận Cấp cứu',
          },
        },
        {
          name: 'inpatientDepartments',
          label: 'Danh sách Khoa điều trị Nội trú (Mỗi dòng 1 khoa)',
          type: 'textarea',
          admin: {
            description: 'Áp dụng khi đợt khảo sát này dành cho khối nội trú. Mỗi dòng là 1 khoa điều trị.',
            placeholder: 'Khoa Nội tổng hợp\nKhoa Ngoại tổng hợp\nKhoa Phụ sản\nKhoa Nhi\nKhoa Hồi sức cấp cứu (ICU)\nKhoa Y học cổ truyền & PHCN\nKhoa Truyền nhiễm',
          },
        },
        {
          name: 'staffPositions',
          label: 'Danh sách Vị trí chuyên môn / Chức danh Nhân viên y tế',
          type: 'textarea',
          admin: {
            description: 'Áp dụng khi đợt khảo sát dành cho nhân viên y tế (Mỗi dòng 1 vị trí).',
            placeholder: 'Bác sĩ điều trị\nĐiều dưỡng / Hộ sinh\nDược sĩ\nKỹ thuật viên xét nghiệm / CĐHA\nChuyên viên / Nhân viên phòng chức năng\nLãnh đạo Khoa / Phòng\nNhân viên hỗ trợ khác',
          },
        },
        {
          name: 'staffUnitTypes',
          label: 'Danh sách Khối đơn vị công tác (Mỗi dòng 1 khối)',
          type: 'textarea',
          admin: {
            description: 'Khối đơn vị công tác của nhân viên y tế (Mỗi dòng 1 khối).',
            placeholder: 'Khoa Lâm sàng (Nội, Ngoại, Sản, Nhi, Cấp cứu...)\nKhoa Cận lâm sàng (Xét nghiệm, CĐHA, Dược...)\nPhòng Chức năng (KHTH, TCCB, TCKT, QLCL, ĐD...)',
          },
        },
        {
          name: 'staffDepartments',
          label: 'Danh sách Khoa / Phòng trực thuộc Nhân viên y tế',
          type: 'textarea',
          admin: {
            description: 'Danh sách khoa/phòng phân công nhân viên y tế (Mỗi dòng 1 khoa/phòng).',
            placeholder: 'Khoa Khám bệnh\nKhoa Cấp cứu - Hồi sức tích cực\nKhoa Nội tổng hợp\nKhoa Ngoại tổng hợp\nKhoa Phụ sản\nKhoa Nhi\nKhoa Y học cổ truyền & PHCN\nKhoa Dược\nKhoa Xét nghiệm & CĐHA\nKhối các Phòng chức năng',
          },
        },
        {
          name: 'areaSuggestions',
          label: 'Danh sách Gợi ý Nơi cư trú (Mỗi dòng 1 địa chỉ)',
          type: 'textarea',
          admin: {
            description: 'Danh sách gợi ý địa bàn cư trú (Mỗi dòng 1 gợi ý).',
            placeholder: 'Xã Thới Lai, TP. Cần Thơ\nXã Trường Thành, TP. Cần Thơ\nXã Đông Thuận, TP. Cần Thơ\nXã Trường Xuân, TP. Cần Thơ\nXã Đông Hiệp, TP. Cần Thơ\nPhường Ô Môn, TP. Cần Thơ\nXã Trường Long, TP. Cần Thơ\nXã Thới Hưng, TP. Cần Thơ\nThị trấn Cờ Đỏ, TP. Cần Thơ\nThị trấn Phong Điền, TP. Cần Thơ\nPhường Thốt Nốt, TP. Cần Thơ\nPhường Ninh Kiều, TP. Cần Thơ\nPhường An Khánh, TP. Cần Thơ\nTỉnh Hậu Giang\nTỉnh Kiên Giang\nTỉnh An Giang\nTỉnh Đồng Tháp',
          },
        },
      ],
    },
  ],
}
