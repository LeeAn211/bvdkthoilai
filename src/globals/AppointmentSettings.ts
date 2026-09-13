import type { GlobalConfig, Field } from 'payload'
import { moduleAccess } from '@/access'

// Helper: field màu với ColorPickerField custom component
const colorField = (name: string, label: string, defaultValue?: string, opts?: Record<string, unknown>): Field => ({
  name,
  label,
  type: 'text',
  ...(defaultValue ? { defaultValue } : {}),
  admin: {
    components: {
      Field: '/src/components/admin/ColorPickerField#default',
    },
    ...(opts?.admin as Record<string, unknown> || {}),
  },
  ...(opts || {}),
} as Field)

export const AppointmentSettings: GlobalConfig = {
  slug: 'appointment-settings',
  label: 'Cấu hình Đặt lịch khám tại cơ sở',
  admin: {
    group: 'Khám bệnh',
    description: 'Tùy chỉnh toàn diện thiết kế, màu sắc, font chữ, bố cục, tùy chỉnh nội dung/nhãn/khung giờ các trường có sẵn và thêm/bớt trường mới.',
  },
  access: {
    read: () => true,
    update: moduleAccess('schedules', 'edit'),
  },
  fields: [
    {
      name: 'enabled',
      label: 'Bật tính năng đặt lịch khám tại cơ sở',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      type: 'collapsible',
      label: '📝 Tiêu đề & Thông điệp giới thiệu',
      admin: { initCollapsed: false },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'pageTitle',
              label: 'Tiêu đề trang',
              type: 'text',
              defaultValue: 'Đăng ký đặt lịch khám tại cơ sở',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'eyebrow',
              label: 'Dòng nhãn nhỏ phía trên',
              type: 'text',
              defaultValue: 'DỊCH VỤ NGƯỜI BỆNH',
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'pageDescription',
          label: 'Mô tả hướng dẫn người bệnh',
          type: 'textarea',
          defaultValue: 'Chủ động đăng ký khám bệnh tại Bệnh viện Đa khoa Khu vực Thới Lai. Quý khách sẽ nhận được mã phiếu hẹn và được ưu tiên hỗ trợ tiếp đón nhanh tại viện.',
        },
        {
          type: 'row',
          fields: [
            { name: 'leftColumnTitle', label: 'Tiêu đề cột trái (Thông tin khách hàng)', type: 'text', defaultValue: 'Thông tin khách hàng', admin: { width: '50%' } },
            { name: 'rightColumnTitle', label: 'Tiêu đề cột phải (Chuyên khoa & Đặt lịch)', type: 'text', defaultValue: 'Chuyên khoa', admin: { width: '50%' } },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: '🎨 Tùy chỉnh thiết kế, màu sắc & Font chữ trang đặt lịch',
      admin: { initCollapsed: false },
      fields: [
        {
          type: 'row',
          fields: [
            colorField('submitButtonBg', 'Màu nền nút Đăng ký', '#0ea5e9'),
            colorField('submitButtonHoverBg', 'Màu nền nút Đăng ký khi di chuột', '#0284c7'),
            colorField('submitButtonTextColor', 'Màu chữ nút Đăng ký', '#ffffff'),
          ],
        },
        {
          type: 'row',
          fields: [
            colorField('formBackground', 'Màu nền khung form', '#ffffff'),
            colorField('inputBorderColor', 'Màu viền ô nhập thông thường', '#e2e8f0'),
            colorField('inputFocusBorderColor', 'Màu viền khi bấm vào ô nhập (Focus)', '#f472b6'),
          ],
        },
        {
          type: 'row',
          fields: [
            colorField('headingColor', 'Màu chữ tiêu đề các mục', '#1e293b'),
            colorField('labelColor', 'Màu nhãn tên trường', '#334155'),
            colorField('requiredStarColor', 'Màu dấu hoa thị bắt buộc (*)', '#ef4444'),
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'fontFamily',
              label: 'Kiểu font chữ form',
              type: 'select',
              defaultValue: 'inherit',
              admin: { width: '50%' },
              options: [
                { label: 'Theo font hệ thống website', value: 'inherit' },
                { label: 'Arial, sans-serif', value: 'Arial, Helvetica, sans-serif' },
                { label: '"Segoe UI", Roboto, sans-serif', value: '"Segoe UI", Roboto, sans-serif' },
                { label: '"Montserrat", sans-serif', value: '"Montserrat", sans-serif' },
                { label: '"Roboto", sans-serif', value: '"Roboto", sans-serif' },
                { label: '"Be Vietnam Pro", sans-serif', value: '"Be Vietnam Pro", sans-serif' },
              ],
            },
            {
              name: 'submitButtonText',
              label: 'Chữ hiển thị trên nút Đăng ký',
              type: 'text',
              defaultValue: 'Đăng ký',
              admin: { width: '50%', placeholder: 'Đăng ký' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'inputBorderRadius', label: 'Bo tròn góc ô nhập (px)', type: 'number', defaultValue: 8, min: 0, max: 30, admin: { width: '33%' } },
            { name: 'submitButtonRadius', label: 'Bo tròn góc nút Đăng ký (px)', type: 'number', defaultValue: 9999, min: 0, max: 9999, admin: { width: '33%' } },
            { name: 'formMaxWidth', label: 'Chiều rộng tối đa form (px)', type: 'number', defaultValue: 960, min: 600, max: 1400, admin: { width: '34%' } },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: '⏰ Tùy chỉnh danh sách Khung giờ khám (Sáng / Chiều / Giờ cụ thể)',
      admin: {
        initCollapsed: false,
        description: 'Tùy chỉnh các khung giờ khám hiển thị cho người bệnh lựa chọn (VD: Buổi sáng 07:00 – 11:30, Buổi chiều 13:00 – 17:00, Ca tối, hoặc các khung giờ 30 phút). Bấm "Add Khung giờ khám" để thêm hoặc sửa/xóa các khung giờ hiện có.',
      },
      fields: [
        {
          name: 'timeSlots',
          label: 'Danh sách các khung giờ khám',
          type: 'array',
          labels: { singular: 'Khung giờ khám', plural: 'Các khung giờ khám' },
          defaultValue: [
            { label: 'Buổi sáng (07:00 – 11:30)', value: 'morning', isDefault: true },
            { label: 'Buổi chiều (13:00 – 17:00)', value: 'afternoon', isDefault: false },
          ],
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'label',
                  label: 'Tên hiển thị khung giờ (VD: Buổi sáng 07:00 – 11:00 hoặc 07:30 – 08:00)',
                  type: 'text',
                  required: true,
                  admin: { width: '50%', placeholder: 'VD: Buổi sáng (07:00 – 11:30)' },
                },
                {
                  name: 'value',
                  label: 'Mã khung giờ (viết liền không dấu, VD: sang, chieu, ca1)',
                  type: 'text',
                  required: true,
                  admin: { width: '30%', placeholder: 'VD: morning' },
                },
                {
                  name: 'isDefault',
                  label: 'Mặc định chọn sẵn',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: { width: '20%' },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: '🏥 Tùy chỉnh danh sách Chuyên khoa khám',
      admin: {
        initCollapsed: false,
        description: 'Tùy chỉnh nguồn danh sách Chuyên khoa hiển thị trên form đặt lịch: tự động lấy theo hệ thống, chọn lọc danh sách chuyên khoa cụ thể, hoặc tự nhập danh sách chuyên khoa riêng cho form.',
      },
      fields: [
        {
          name: 'specialtySource',
          label: 'Nguồn danh sách Chuyên khoa',
          type: 'select',
          defaultValue: 'auto',
          admin: {
            description: 'Chọn phương thức cung cấp danh sách chuyên khoa cho người bệnh đăng ký.',
          },
          options: [
            { label: '🌐 Tự động: Lấy toàn bộ Chuyên khoa đang hoạt động trong hệ thống (hoặc Khoa lâm sàng nếu chưa tạo)', value: 'auto' },
            { label: '🎯 Chọn lọc: Chỉ định các Chuyên khoa được phép đặt khám (chọn từ danh mục Chuyên khoa)', value: 'selected' },
            { label: '✏️ Tự cấu hình riêng: Tự nhập danh sách chuyên khoa khám theo ý muốn (dành riêng cho form đặt hẹn)', value: 'custom' },
          ],
        },
        {
          name: 'selectedSpecialties',
          label: 'Các Chuyên khoa được phép chọn đặt lịch',
          type: 'relationship',
          relationTo: 'specialties',
          hasMany: true,
          admin: {
            condition: (data: any) => data?.specialtySource === 'selected',
            description: 'Chỉ những chuyên khoa được chọn ở đây mới hiển thị trên form đăng ký.',
          },
        },
        {
          name: 'customSpecialties',
          label: 'Danh sách Chuyên khoa tự cấu hình riêng',
          type: 'array',
          labels: { singular: 'Chuyên khoa', plural: 'Các chuyên khoa' },
          admin: {
            condition: (data: any) => data?.specialtySource === 'custom',
            description: 'Thêm danh sách các chuyên khoa khám tùy ý (VD: Khám Tổng quát, Tim mạch, Nhi khoa...). Bấm "Add Chuyên khoa" để thêm.',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'name',
                  label: 'Tên chuyên khoa khám',
                  type: 'text',
                  required: true,
                  admin: { width: '70%', placeholder: 'VD: Khám Nội tổng quát' },
                },
                {
                  name: 'code',
                  label: 'Mã chuyên khoa (tùy chọn)',
                  type: 'text',
                  admin: { width: '30%', placeholder: 'VD: noi-tong-quat' },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: '✏️ Tùy chỉnh Nhãn & Gợi ý (Placeholder) của các trường có sẵn',
      admin: {
        initCollapsed: false,
        description: 'Bạn có thể thay đổi tên nhãn hiển thị và chữ gợi ý nhập (placeholder) cho từng trường thông tin mặc định theo đúng nhu cầu.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'nameFieldLabel', label: 'Tên nhãn trường Họ tên', type: 'text', defaultValue: 'Họ và tên', admin: { width: '50%' } },
            { name: 'nameFieldPlaceholder', label: 'Gợi ý nhập Họ tên', type: 'text', defaultValue: 'Họ và tên', admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'phoneFieldLabel', label: 'Tên nhãn trường Số điện thoại', type: 'text', defaultValue: 'Số điện thoại', admin: { width: '50%' } },
            { name: 'phoneFieldPlaceholder', label: 'Gợi ý nhập Số điện thoại', type: 'text', defaultValue: 'Số điện thoại', admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'emailFieldLabel', label: 'Tên nhãn trường Email', type: 'text', defaultValue: 'Email', admin: { width: '50%' } },
            { name: 'emailFieldPlaceholder', label: 'Gợi ý nhập Email', type: 'text', defaultValue: 'Email', admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'addressFieldLabel', label: 'Tên nhãn trường Địa chỉ', type: 'text', defaultValue: 'Địa chỉ', admin: { width: '50%' } },
            { name: 'addressFieldPlaceholder', label: 'Gợi ý nhập Địa chỉ', type: 'text', defaultValue: 'Địa chỉ', admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'dobFieldLabel', label: 'Tên nhãn trường Ngày sinh', type: 'text', defaultValue: 'Ngày sinh', admin: { width: '50%' } },
            { name: 'genderFieldLabel', label: 'Tên nhãn trường Giới tính', type: 'text', defaultValue: 'Giới tính', admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'specialtyFieldLabel', label: 'Tên nhãn trường Chuyên khoa', type: 'text', defaultValue: 'Chuyên khoa', admin: { width: '50%' } },
            { name: 'specialtyFieldPlaceholder', label: 'Dòng chọn đầu tiên của Chuyên khoa', type: 'text', defaultValue: '-- Chọn chuyên khoa --', admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'doctorFieldLabel', label: 'Tên nhãn trường Bác sĩ', type: 'text', defaultValue: 'Bác sĩ mong muốn khám (tùy chọn)', admin: { width: '50%' } },
            { name: 'appointmentDateFieldLabel', label: 'Tên nhãn trường Ngày khám', type: 'text', defaultValue: 'Ngày khám', admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'symptomsFieldLabel', label: 'Tên nhãn trường Thông tin bổ sung', type: 'text', defaultValue: 'Thông tin bổ sung', admin: { width: '50%' } },
            { name: 'symptomsFieldPlaceholder', label: 'Gợi ý nhập Thông tin bổ sung', type: 'text', defaultValue: 'Thông tin bổ sung', admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'timeSlotFieldLabel', label: 'Tên nhãn trường Khung giờ khám', type: 'text', defaultValue: 'Khung giờ khám', admin: { width: '50%' } },
            { name: 'insuranceFieldLabel', label: 'Tên nhãn trường Thẻ BHYT', type: 'text', defaultValue: 'Mã số thẻ BHYT (nếu có)', admin: { width: '50%' } },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: '⚙️ Bật / Tắt & Cấu hình bắt buộc các trường thông tin mặc định',
      admin: { initCollapsed: false },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'showEmail', label: 'Hiện trường Email', type: 'checkbox', defaultValue: true, admin: { width: '25%' } },
            { name: 'showAddress', label: 'Hiện trường Địa chỉ', type: 'checkbox', defaultValue: true, admin: { width: '25%' } },
            { name: 'showInsurance', label: 'Hiện trường Mã thẻ BHYT', type: 'checkbox', defaultValue: true, admin: { width: '25%' } },
            { name: 'showDoctorSelect', label: 'Cho phép chọn Bác sĩ mong muốn', type: 'checkbox', defaultValue: true, admin: { width: '25%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'showDob', label: 'Hiện trường Ngày sinh', type: 'checkbox', defaultValue: true, admin: { width: '25%' } },
            { name: 'showGender', label: 'Hiện trường Giới tính', type: 'checkbox', defaultValue: true, admin: { width: '25%' } },
            { name: 'showSymptoms', label: 'Hiện trường Thông tin bổ sung / Triệu chứng', type: 'checkbox', defaultValue: true, admin: { width: '25%' } },
            { name: 'showTimeSlot', label: 'Hiện trường Chọn khung giờ khám', type: 'checkbox', defaultValue: true, admin: { width: '25%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'requireEmail', label: 'Bắt buộc nhập Email', type: 'checkbox', defaultValue: false, admin: { width: '25%' } },
            { name: 'requireAddress', label: 'Bắt buộc nhập Địa chỉ', type: 'checkbox', defaultValue: false, admin: { width: '25%' } },
            { name: 'requireDob', label: 'Bắt buộc chọn Ngày sinh', type: 'checkbox', defaultValue: false, admin: { width: '25%' } },
            { name: 'requireSymptoms', label: 'Bắt buộc nhập Thông tin bổ sung', type: 'checkbox', defaultValue: false, admin: { width: '25%' } },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: '➕ Thêm các trường thông tin tùy biến (Custom Fields)',
      admin: {
        initCollapsed: false,
        description: 'Bạn có thể bấm "Thêm Trường thông tin" để bổ sung bất kỳ trường nào cần thu thập thêm (VD: Nghề nghiệp, Số CCCD/CMND, Triệu chứng sốt, Nơi chuyển tuyến, Ghi chú đặc biệt...) mà không cần sửa code.',
      },
      fields: [
        {
          name: 'customFields',
          label: 'Danh sách trường tùy biến',
          type: 'array',
          labels: { singular: 'Trường thông tin', plural: 'Các trường thông tin' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'name', label: 'Mã trường (viết liền không dấu, VD: cccd, job)', type: 'text', required: true, admin: { width: '30%', placeholder: 'VD: cccd' } },
                { name: 'label', label: 'Tên nhãn hiển thị (VD: Số CCCD/Định danh)', type: 'text', required: true, admin: { width: '45%', placeholder: 'VD: Số CCCD/Định danh' } },
                { name: 'required', label: 'Bắt buộc', type: 'checkbox', defaultValue: false, admin: { width: '25%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'type',
                  label: 'Kiểu dữ liệu',
                  type: 'select',
                  defaultValue: 'text',
                  required: true,
                  admin: { width: '30%' },
                  options: [
                    { label: 'Văn bản ngắn (Text)', value: 'text' },
                    { label: 'Đoạn văn dài (Textarea)', value: 'textarea' },
                    { label: 'Hộp chọn (Dropdown / Select)', value: 'select' },
                    { label: 'Số (Number)', value: 'number' },
                    { label: 'Ngày tháng (Date)', value: 'date' },
                    { label: 'Hộp tích chọn (Checkbox)', value: 'checkbox' },
                  ],
                },
                {
                  name: 'column',
                  label: 'Vị trí hiển thị',
                  type: 'select',
                  defaultValue: 'left',
                  admin: { width: '30%' },
                  options: [
                    { label: 'Cột trái (Thông tin khách hàng)', value: 'left' },
                    { label: 'Cột phải (Chuyên khoa & Đặt lịch)', value: 'right' },
                  ],
                },
                { name: 'placeholder', label: 'Gợi ý nhập (Placeholder)', type: 'text', admin: { width: '40%', placeholder: 'VD: Nhập 12 số CCCD...' } },
              ],
            },
            {
              name: 'options',
              label: 'Các lựa chọn (nếu chọn kiểu Hộp chọn / Select)',
              type: 'textarea',
              admin: {
                placeholder: 'Mỗi lựa chọn 1 dòng.\nVD:\nBHYT đúng tuyến\nBHYT trái tuyến\nKhám dịch vụ tự nguyện',
                description: 'Chỉ áp dụng khi chọn kiểu Hộp chọn (Select). Mỗi lựa chọn nhập trên 1 dòng riêng biệt.',
              },
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: '📋 Hướng dẫn & Lời dặn khi đến khám',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'hospitalGuidance',
          label: 'Lời dặn người bệnh (Hiển thị sau khi đặt khám thành công)',
          type: 'textarea',
          defaultValue: '• Vui lòng có mặt tại Quầy Tiếp đón trước giờ hẹn 15 phút.\n• Mang theo Căn cước công dân (hoặc VNeID mức 2) và thẻ BHYT (nếu có).\n• Xuất trình Mã phiếu hẹn hoặc Quét mã QR tại bàn hướng dẫn để nhận số thứ tự ưu tiên.',
        },
        {
          name: 'hotlineSupport',
          label: 'Hotline hỗ trợ đặt khám',
          type: 'text',
          defaultValue: '02923686115',
          admin: { placeholder: '02923686115' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: '🛡️ Cấu hình Hạn chế Spam & Bảo vệ Đặt lịch',
      admin: {
        initCollapsed: false,
        description: 'Bảo vệ hệ thống chống spam: giới hạn số lần đặt trên mỗi IP, khoảng thời gian chờ giữa 2 lần đặt cùng số điện thoại, và kiểm tra trùng lặp.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'maxSubmissionsPerIp',
              label: 'Số lần tối đa gửi từ 1 địa chỉ IP trong 15 phút',
              type: 'number',
              defaultValue: 5,
              min: 1,
              max: 50,
              admin: { width: '33%', description: 'Mặc định: 5 lần/15 phút. Nếu vượt quá sẽ bị tạm chặn.' },
            },
            {
              name: 'minSecondsBetweenSubmissions',
              label: 'Thời gian chờ tối thiểu giữa 2 lần đặt của cùng SĐT (giây)',
              type: 'number',
              defaultValue: 60,
              min: 10,
              max: 600,
              admin: { width: '34%', description: 'Tránh việc cùng 1 số điện thoại bấm gửi liên tiếp (Mặc định: 60 giây).' },
            },
            {
              name: 'preventDuplicateBooking',
              label: 'Chặn đặt trùng (Cùng SĐT + Cùng ngày khám + Cùng chuyên khoa)',
              type: 'checkbox',
              defaultValue: true,
              admin: { width: '33%', description: 'Nếu người bệnh đã có phiếu hẹn trong ngày cùng chuyên khoa, yêu cầu kiểm tra lại mã phiếu đã cấp.' },
            },
          ],
        },
      ],
    },
  ],
}
