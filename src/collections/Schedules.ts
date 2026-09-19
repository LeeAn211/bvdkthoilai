import type { CollectionConfig } from 'payload'
import { moduleAccess, publicActiveFor } from '@/access'

export const Schedules: CollectionConfig = {
  slug: 'schedules',
  labels: { singular: 'Lịch khám / Lịch trực', plural: 'Lịch khám / Lịch trực' },
  admin: {
    useAsTitle: 'title',
    group: '🏥 Khám bệnh & Dịch vụ Y tế',
    description: 'Ưu tiên đăng ảnh lịch khám tuần chính thức. Vẫn hỗ trợ nhập theo ngày/tuần/lịch trực cấp cứu để tra cứu chi tiết.',
  },
  access: { read: publicActiveFor('schedules'), create: moduleAccess('schedules', 'create'), update: moduleAccess('schedules', 'edit'), delete: moduleAccess('schedules', 'delete') },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: '📋 Thông tin chung',
          fields: [
            { name: 'title', label: 'Tên lịch', type: 'text', required: true, defaultValue: 'Lịch khám bác sĩ' },
            {
              name: 'mode',
              label: 'Hình thức đăng lịch',
              type: 'select',
              required: true,
              defaultValue: 'daily',
              admin: {
                description: 'Chọn đúng loại lịch để nhập liệu nhanh và hiển thị chuyên nghiệp nhất.',
              },
              options: [
                { label: '🩺 Phân công Bác sĩ theo ngày (4 khung giờ)', value: 'daily' },
                { label: '👩‍⚕️ Phân công Điều dưỡng - Nữ hộ sinh theo ngày (ĐD - NHS)', value: 'nurse' },
                { label: '🚑 Lịch trực cấp cứu theo tuần (bảng ma trận)', value: 'emergency' },
                { label: '📎 Ảnh lịch tuần / tệp đính kèm (khuyến nghị)', value: 'attachment' },
              ],
            },
            {
              name: 'summary',
              label: 'Mô tả ngắn',
              type: 'textarea',
              maxLength: 300,
              admin: { description: 'Hiển thị ở thẻ danh sách trước khi người xem bấm Xem chi tiết.' },
            },
            {
              name: 'coverImage',
              label: 'Ảnh đại diện',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Không bắt buộc. Nếu bỏ trống website dùng ảnh mặc định Lịch khám trong Admin → Ảnh mặc định nội dung.' },
            },
            {
              name: 'detailContent',
              label: 'Nội dung chi tiết bổ sung',
              type: 'richText',
              admin: { description: 'Nội dung chỉ hiển thị trong trang chi tiết của lịch.' },
            },
            { name: 'note', label: 'Ghi chú chung cho bài đăng', type: 'textarea' },
            { name: 'active', label: 'Đang áp dụng (hiển thị công khai)', type: 'checkbox', defaultValue: true },
          ],
        },
        {
          label: '🩺 Phân công Bác sĩ',
          admin: {
            condition: (_data, siblingData) => !siblingData?.mode || siblingData?.mode === 'daily',
          },
          fields: [
            {
              name: 'date',
              label: 'Ngày khám / trực',
              type: 'date',
              index: true,
              admin: {
                date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
                description: 'Chọn ngày áp dụng lịch phân công.',
              },
            },
            {
              name: 'dailyScheduleType',
              label: 'Loại phân công',
              type: 'select',
              defaultValue: 'doctor',
              admin: {
                description: 'Mặc định là phân công bác sĩ theo 4 ca.',
              },
              options: [
                { label: '🩺 Bác sĩ khám bệnh (4 khung giờ)', value: 'doctor' },
                { label: '👩‍⚕️ Điều dưỡng - Nữ hộ sinh (ĐD - NHS)', value: 'nurse' },
              ],
            },
            {
              name: 'dailyTemplateHelper',
              type: 'ui',
              admin: {
                components: {
                  Field: '/src/components/admin/DailyTemplateDownload#default',
                },
              },
            },
            {
              name: 'dailyAssignments',
              label: 'Bảng phân công ca trực / khám theo Khoa/Phòng (Bác sĩ)',
              type: 'array',
              admin: {
                description: 'Nhập nhanh theo từng Khoa/Phòng. Mỗi ca có thể nhập danh sách bác sĩ ngăn cách bằng dấu phẩy (VD: "BS. Năm, BS. Dương, BS. Linh, BS. Tân..."). Giao diện website sẽ tự động dựng bảng banner y tế chuẩn mẫu.',
                initCollapsed: false,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'departmentName',
                      label: 'Khoa / Phòng',
                      type: 'text',
                      required: true,
                      admin: { width: '60%', placeholder: 'VD: KHÁM BỆNH, CẤP CỨU, NỘI, YHCT, NGOẠI...' },
                    },
                    {
                      name: 'departmentIcon',
                      label: 'Biểu tượng Khoa/Phòng',
                      type: 'select',
                      defaultValue: 'stethoscope',
                      admin: { width: '40%' },
                      options: [
                        { label: '🩺 Ống nghe (Khám bệnh)', value: 'stethoscope' },
                        { label: '🚑 Xe cứu thương (Cấp cứu)', value: 'ambulance' },
                        { label: '🛏️ Giường bệnh (Nội khoa)', value: 'bed' },
                        { label: '🧪 Chày cối / Dược (YHCT)', value: 'mortar' },
                        { label: '🔪 Dao mổ (Ngoại khoa)', value: 'scalpel' },
                        { label: '🤱 Sản phụ / Nhi (Sản khoa)', value: 'baby' },
                        { label: '📟 Siêu âm / Thăm dò (Siêu âm)', value: 'ultrasound' },
                        { label: '🦷 Răng (Răng Hàm Mặt)', value: 'tooth' },
                        { label: '🦠 Vi sinh / Covid (Khám đặc thù)', value: 'virus' },
                        { label: '🏥 Phòng ban chung', value: 'clinic' },
                      ],
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'morningDoctors',
                      label: '07:00 – 10:00 (Buổi sáng)',
                      type: 'textarea',
                      admin: { width: '25%', placeholder: 'BS. Năm, BS. Dương, BS. Linh...' },
                    },
                    {
                      name: 'noonDoctors',
                      label: '10:00 – 11:00',
                      type: 'textarea',
                      admin: { width: '25%', placeholder: 'BS. Hoàng, BS. Dương, BS. Linh...' },
                    },
                    {
                      name: 'afternoonDoctors',
                      label: '13:00 – 16:00 (Buổi chiều)',
                      type: 'textarea',
                      admin: { width: '25%', placeholder: 'BS. Năm, BS. Dương, BS. Linh...' },
                    },
                    {
                      name: 'eveningDoctors',
                      label: '16:00 – 17:00 (Buổi tối)',
                      type: 'textarea',
                      admin: { width: '25%', placeholder: 'BS. Dương, BS. Linh, BS. Tân...' },
                    },
                  ],
                },
                { name: 'note', label: 'Ghi chú riêng cho khoa này (nếu có)', type: 'text' },
              ],
            },
            // Các trường đơn lẻ cũ để đảm bảo 100% backward compatibility
            {
              type: 'collapsible',
              label: 'Thông tin cá nhân đơn lẻ (Dành cho lịch cũ hoặc bổ sung)',
              admin: {
                initCollapsed: true,
              },
              fields: [
                { name: 'doctor', label: 'Chọn bác sĩ đơn lẻ', type: 'relationship', relationTo: 'doctors' },
                { name: 'department', label: 'Chọn Khoa / Phòng đơn lẻ', type: 'relationship', relationTo: 'departments' },
                { name: 'startTime', label: 'Giờ bắt đầu', type: 'text', admin: { placeholder: '07:00' } },
                { name: 'endTime', label: 'Giờ kết thúc', type: 'text', admin: { placeholder: '11:00' } },
                { name: 'room', label: 'Phòng khám', type: 'text' },
              ],
            },
          ],
        },
        {
          label: '👩‍⚕️ Phân công Điều dưỡng - NHS',
          admin: {
            condition: (_data, siblingData) => siblingData?.mode === 'nurse' || (!siblingData?.mode && siblingData?.dailyScheduleType === 'nurse'),
          },
          fields: [
            {
              name: 'nurseTemplateHelper',
              type: 'ui',
              admin: {
                components: {
                  Field: '/src/components/admin/NurseTemplateDownload#default',
                },
              },
            },
            {
              type: 'collapsible',
              label: '⚙️ Tùy chỉnh Tiêu đề các Cột & Thêm ô/cột mới (Tùy chọn)',
              admin: {
                initCollapsed: true,
                description: 'Cho phép thay đổi tên các cột (Khoa/Phòng, Hành chánh, Tăng cường) hoặc kích hoạt thêm Cột thứ 4 khi có nhu cầu phát sinh.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'nurseCol1Title',
                      label: 'Tiêu đề Cột 1 (Mặc định: KHOA / PHÒNG)',
                      type: 'text',
                      defaultValue: 'KHOA / PHÒNG',
                      admin: { width: '50%', placeholder: 'KHOA / PHÒNG' },
                    },
                    {
                      name: 'nurseCol1Sub',
                      label: 'Mô tả phụ Cột 1 (tùy chọn)',
                      type: 'text',
                      admin: { width: '50%', placeholder: 'VD: Khoa / Phòng trực' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'nurseCol2Title',
                      label: 'Tiêu đề Cột 2 (Mặc định: HÀNH CHÁNH)',
                      type: 'text',
                      defaultValue: 'HÀNH CHÁNH',
                      admin: { width: '50%', placeholder: 'HÀNH CHÁNH' },
                    },
                    {
                      name: 'nurseCol2Sub',
                      label: 'Mô tả phụ Cột 2 (Mặc định: Ca trực chính theo phân công)',
                      type: 'text',
                      defaultValue: 'Ca trực chính theo phân công',
                      admin: { width: '50%', placeholder: 'Ca trực chính theo phân công' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'nurseCol3Title',
                      label: 'Tiêu đề Cột 3 (Mặc định: TĂNG CƯỜNG)',
                      type: 'text',
                      defaultValue: 'TĂNG CƯỜNG',
                      admin: { width: '50%', placeholder: 'TĂNG CƯỜNG' },
                    },
                    {
                      name: 'nurseCol3Sub',
                      label: 'Mô tả phụ Cột 3 (Mặc định: Hỗ trợ chuyên môn / Điều động)',
                      type: 'text',
                      defaultValue: 'Hỗ trợ chuyên môn / Điều động',
                      admin: { width: '50%', placeholder: 'Hỗ trợ chuyên môn / Điều động' },
                    },
                  ],
                },
                {
                  name: 'nurseEnableCol4',
                  label: '➕ Kích hoạt thêm Cột thứ 4 (Ô mới tùy nhu cầu sau này)',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Tích chọn để hiển thị thêm một cột phân công mới trên cả bảng Admin và bảng ngoài website.',
                  },
                },
                {
                  type: 'row',
                  admin: {
                    condition: (_data, siblingData) => Boolean(siblingData?.nurseEnableCol4),
                  },
                  fields: [
                    {
                      name: 'nurseCol4Title',
                      label: 'Tiêu đề Cột thứ 4',
                      type: 'text',
                      admin: { width: '50%', placeholder: 'VD: TRỰC ĐÊM / ĐIỀU ĐỘNG KHÁC / CA 3...' },
                    },
                    {
                      name: 'nurseCol4Sub',
                      label: 'Mô tả phụ Cột thứ 4',
                      type: 'text',
                      admin: { width: '50%', placeholder: 'VD: Phân công ngoài giờ hoặc ghi chú riêng' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'nurseAssignments',
              label: 'Bảng phân công Điều dưỡng - Nữ hộ sinh theo Khoa/Phòng',
              type: 'array',
              admin: {
                description: 'Bảng phân công theo Khoa/Phòng. Hỗ trợ đầy đủ Import Excel và Quét ảnh AI OCR.',
                initCollapsed: false,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'departmentName',
                      label: 'Khoa / Phòng',
                      type: 'text',
                      required: true,
                      admin: { width: '60%', placeholder: 'VD: KHÁM BỆNH-LCK, HSCC, NỘI-NHI, YHCT, PHỤ SẢN...' },
                    },
                    {
                      name: 'departmentIcon',
                      label: 'Biểu tượng Khoa/Phòng',
                      type: 'select',
                      defaultValue: 'stethoscope',
                      admin: { width: '40%' },
                      options: [
                        { label: '🩺 Ống nghe (Khám bệnh - LCK)', value: 'stethoscope' },
                        { label: '🚑 Xe cứu thương (HSCC / Cấp cứu)', value: 'ambulance' },
                        { label: '🛏️ Giường bệnh (Nội - Nhi - Truyền nhiễm)', value: 'bed' },
                        { label: '🧪 Chày cối / Dược (YHCT và PHCN)', value: 'mortar' },
                        { label: '🔪 Dao mổ (Ngoại TH)', value: 'scalpel' },
                        { label: '🤱 Sản phụ (Phụ sản)', value: 'baby' },
                        { label: '🦠 Vi sinh / KSNK', value: 'virus' },
                        { label: '🏥 Phòng ban (KHTH, Phòng ĐD...)', value: 'clinic' },
                        { label: '🦷 Răng Hàm Mặt', value: 'tooth' },
                        { label: '📟 Cận lâm sàng', value: 'ultrasound' },
                      ],
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'administrativeStaff',
                      label: 'Ca Hành chánh (hoặc Cột 2)',
                      type: 'textarea',
                      admin: {
                        width: '50%',
                        placeholder: 'VD: Vân, Song, Tuấn, Hạnh, Diễm, Tuyền C, Yến.\nTuyền S: Phòng răng.\nPhòng tiêm ngừa: Ys Trang, Ys Oanh.',
                      },
                    },
                    {
                      name: 'reinforcementStaff',
                      label: 'Ca Tăng cường (hoặc Cột 3)',
                      type: 'textarea',
                      admin: {
                        width: '50%',
                        placeholder: 'VD: Trình ký giấy: Thiện.\nYs Ngân S: (Phòng DV + BSGĐ)...',
                      },
                    },
                  ],
                },
                {
                  name: 'extraStaff',
                  label: 'Nhân sự / Nội dung Cột thứ 4 (áp dụng khi đã kích hoạt Cột 4)',
                  type: 'textarea',
                  admin: {
                    placeholder: 'Nội dung phân công cho cột thứ 4 nếu đã bật ở phần cấu hình tiêu đề...',
                  },
                },
                { name: 'note', label: 'Ghi chú riêng cho khoa này (nếu có)', type: 'text' },
              ],
            },
            {
              name: 'nurseGeneralNote',
              label: 'Ghi chú chân bảng (Nghỉ phép / Điều động công tác)',
              type: 'textarea',
              admin: {
                placeholder: 'VD: Ghi chú: Nghỉ phép: Lập, Nghi, Kiên.',
                description: 'Hiển thị ở chân bảng lịch điều dưỡng.',
              },
            },
          ],
        },
        {
          label: '🚑 Lịch trực Cấp cứu (Tuần)',
          admin: {
            condition: (_data, siblingData) => siblingData?.mode === 'emergency',
          },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'emergencyWeekStart', label: 'Tuần trực từ ngày', type: 'date', admin: { width: '50%', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } } },
                { name: 'emergencyWeekEnd', label: 'Đến ngày', type: 'date', admin: { width: '50%', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } } },
              ],
            },
            {
              name: 'emergencyTemplateHelper',
              type: 'ui',
              admin: {
                components: {
                  Field: '/src/components/admin/EmergencyTemplateDownload#default',
                },
              },
            },
            {
              name: 'weeklyDeptSlots',
              label: 'Bảng lịch trực theo Khoa/Bộ phận (Import từ file Excel)',
              type: 'array',
              admin: {
                description: '📋 Mỗi dòng = 1 Khoa/Bộ phận (LÃNH ĐẠO, CẤP CỨU, NỘI-NHI...). 7 ô = nhân sự trực T2→CN. Dùng nút Import Excel bên trên để tự động điền.',
                initCollapsed: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'deptName', label: 'Khoa / Bộ phận', type: 'text', required: true, admin: { width: '40%', placeholder: 'VD: CẤP CỨU TỔNG HỢP, LÃNH ĐẠO, NỘI-NHI...' } },
                    { name: 'deptType', label: 'Loại', type: 'select', defaultValue: 'clinical', admin: { width: '30%' }, options: [
                      { label: '🏥 Lâm sàng (Bác sĩ, ĐD)', value: 'clinical' },
                      { label: '👔 Lãnh đạo', value: 'leader' },
                      { label: '🔬 Cận lâm sàng', value: 'paraclinical' },
                      { label: '🚗 Hành chính / Hậu cần', value: 'admin' },
                    ] },
                    { name: 'subRole', label: 'Vai trò / Loại nhân sự', type: 'text', admin: { width: '30%', placeholder: 'VD: BÁC SĨ, ĐIỀU DƯỠNG...' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'day2', label: 'Thứ Hai', type: 'textarea', admin: { width: '14.28%' } },
                    { name: 'day3', label: 'Thứ Ba', type: 'textarea', admin: { width: '14.28%' } },
                    { name: 'day4', label: 'Thứ Tư', type: 'textarea', admin: { width: '14.28%' } },
                    { name: 'day5', label: 'Thứ Năm', type: 'textarea', admin: { width: '14.28%' } },
                    { name: 'day6', label: 'Thứ Sáu', type: 'textarea', admin: { width: '14.28%' } },
                    { name: 'day7', label: 'Thứ Bảy', type: 'textarea', admin: { width: '14.28%' } },
                    { name: 'day8', label: 'Chủ Nhật', type: 'textarea', admin: { width: '14.28%' } },
                  ],
                },
                { name: 'fixedStaff', label: 'Nhân sự trực tuần (danh sách)', type: 'textarea', admin: { placeholder: 'Bs Nghĩa, Bs Kiều, Thu, Loan, Tâm...' } },
                { name: 'note', label: 'Ghi chú riêng', type: 'text' },
              ],
            },
            {
              name: 'emergencyGeneralNote',
              label: 'Ghi chú chung tuần trực',
              type: 'textarea',
              admin: {
                description: 'Ghi chú điều động, công tác, học tập của các bác sĩ trong tuần (tự động import từ file Excel).',
              },
            },
            {
              name: 'emergencyContacts',
              label: 'Danh bạ điện thoại trực & Cấp cứu liên viện',
              type: 'array',
              admin: {
                description: 'Số điện thoại tài xế, điện nước, công an, bảo vệ, viện phí, bệnh viện tuyến trên... (tự động import từ file Excel).',
                initCollapsed: true,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', label: 'Tên bộ phận / Bệnh viện', type: 'text', required: true, admin: { width: '40%' } },
                    { name: 'phone', label: 'Số điện thoại', type: 'text', required: true, admin: { width: '30%' } },
                    { name: 'type', label: 'Phân loại', type: 'select', defaultValue: 'internal', admin: { width: '30%' }, options: [
                      { label: '📞 Trực nội bộ (Tài xế, Điện nước, Bảo vệ...)', value: 'internal' },
                      { label: '🚑 Cấp cứu liên viện (Đa khoa TW, Nhi Đồng...)', value: 'emergency_unit' },
                    ] },
                  ],
                },
                { name: 'note', label: 'Ghi chú thêm', type: 'text' },
              ],
            },
            {
              name: 'emergencyExcelFile',
              label: 'Tệp Excel lịch trực đã lưu (tùy chọn)',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Lưu trữ tệp Excel gốc để tiện tải về xem lại hoặc tra cứu lịch sử khi cần.',
              },
            },
          ],
        },
        {
          label: '📎 Tệp đính kèm & Ảnh lịch',
          admin: {
            condition: (_data, siblingData) => siblingData?.mode === 'attachment',
          },
          fields: [
            { name: 'scheduleType', label: 'Tính chất lịch', type: 'select', defaultValue: 'official', options: [{ label: 'Lịch chính thức', value: 'official' }, { label: 'Điều chỉnh / bổ sung', value: 'adjustment' }] },
            { name: 'scheduleImage', label: 'Ảnh lịch khám tuần (ưu tiên)', type: 'upload', relationTo: 'media', admin: { description: 'Tải ảnh JPG/PNG mới hoặc chọn lại ảnh lịch đã có trong thư viện.' } },
            { name: 'scheduleFile', label: 'Tệp lịch khám', type: 'upload', relationTo: 'media', admin: { description: 'Tải Excel/PDF/Word mới hoặc chọn lại tệp lịch đã có trong thư viện.' } },
            { name: 'attachmentFiles', label: 'Tệp đính kèm bổ sung', type: 'array', fields: [{ name: 'file', label: 'Tệp', type: 'upload', relationTo: 'media', required: true }, { name: 'label', label: 'Tên hiển thị', type: 'text' }] },
            { name: 'validFrom', label: 'Hiệu lực từ ngày', type: 'date', admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } } },
            { name: 'validTo', label: 'Hiệu lực đến ngày', type: 'date', admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } } },
          ],
        },
      ],
    },
    // Trường tương thích ngược cho lịch tuần cũ nếu còn tài liệu
    {
      type: 'row',
      fields: [
        { name: 'weekStart', label: 'Tuần từ ngày', type: 'date', admin: { condition: (_data, siblingData) => siblingData?.mode === 'weekly', width: '50%', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } } },
        { name: 'weekEnd', label: 'Đến ngày', type: 'date', admin: { condition: (_data, siblingData) => siblingData?.mode === 'weekly', width: '50%', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } } },
      ],
    },
    {
      name: 'weeklySlots', label: 'Các ca / bác sĩ khám trong tuần', type: 'array',
      admin: {
        condition: (_data, siblingData) => siblingData?.mode === 'weekly',
        description: 'Tương thích ngược dữ liệu tuần cũ.',
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'dayOfWeek', label: 'Thứ trong tuần', type: 'select', required: true, admin: { width: '30%' }, options: [
                { label: 'Thứ Hai', value: '2' }, { label: 'Thứ Ba', value: '3' }, { label: 'Thứ Tư', value: '4' }, { label: 'Thứ Năm', value: '5' }, { label: 'Thứ Sáu', value: '6' }, { label: 'Thứ Bảy', value: '7' }, { label: 'Chủ Nhật', value: '8' },
              ],
            },
            { name: 'doctor', label: 'Bác sĩ phụ trách', type: 'relationship', relationTo: 'doctors', required: true, admin: { width: '40%' } },
            { name: 'department', label: 'Khoa / Phòng', type: 'relationship', relationTo: 'departments', required: true, admin: { width: '30%' } },
          ],
        },
        { type: 'row', fields: [
          { name: 'startTime', label: 'Từ giờ', type: 'text', required: true, admin: { width: '33%', placeholder: '07:00' } },
          { name: 'endTime', label: 'Đến giờ', type: 'text', required: true, admin: { width: '33%', placeholder: '11:00' } },
          { name: 'room', label: 'Phòng khám', type: 'text', admin: { width: '34%' } },
        ] },
        { name: 'note', label: 'Ghi chú buổi khám', type: 'text' },
      ],
    },
  ],
}

