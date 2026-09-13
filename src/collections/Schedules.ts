import type { CollectionConfig } from 'payload'
import { moduleAccess, publicActive } from '@/access'

export const Schedules: CollectionConfig = {
  slug: 'schedules',
  labels: { singular: 'Lịch khám / Lịch trực', plural: 'Lịch khám / Lịch trực' },
  admin: {
    useAsTitle: 'title',
    group: 'Khám bệnh',
    description: 'Ưu tiên đăng ảnh lịch khám tuần chính thức. Vẫn hỗ trợ nhập theo ngày/tuần/lịch trực cấp cứu để tra cứu chi tiết.',
  },
  access: { read: publicActive, create: moduleAccess('schedules', 'create'), update: moduleAccess('schedules', 'edit'), delete: moduleAccess('schedules', 'delete') },
  fields: [
    { name: 'title', label: 'Tên lịch', type: 'text', required: true, defaultValue: 'Lịch khám bác sĩ' },
    { name: 'summary', label: 'Mô tả ngắn', type: 'textarea', maxLength: 300, admin: { description: 'Hiển thị ở thẻ danh sách trước khi người xem bấm Xem chi tiết.' } },
    { name: 'coverImage', label: 'Ảnh đại diện', type: 'upload', relationTo: 'media', admin: { description: 'Không bắt buộc. Nếu bỏ trống website dùng ảnh mặc định Lịch khám trong Admin → Ảnh mặc định nội dung.' } },
    { name: 'detailContent', label: 'Nội dung chi tiết', type: 'richText', admin: { description: 'Nội dung chỉ hiển thị trong trang chi tiết của lịch.' } },
    {
      name: 'mode', label: 'Hình thức đăng lịch', type: 'select', required: true, defaultValue: 'attachment',
      options: [
        { label: 'Bảng phân công theo ngày (khám theo ca)', value: 'daily' },
        { label: 'Lịch trực cấp cứu theo tuần (bảng ma trận)', value: 'emergency' },
        { label: 'Lập lịch theo tuần', value: 'weekly' },
        { label: 'Ảnh lịch tuần / tệp đính kèm (khuyến nghị)', value: 'attachment' },
      ],
    },
    { name: 'date', label: 'Ngày khám', type: 'date', index: true, admin: { condition: (_data, siblingData) => !siblingData?.mode || siblingData?.mode === 'daily', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } } },
    {
      name: 'dailyAssignments',
      label: 'Bảng phân công ca trực / khám theo Khoa/Phòng',
      type: 'array',
      admin: {
        condition: (_data, siblingData) => !siblingData?.mode || siblingData?.mode === 'daily',
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
        condition: (_data, siblingData) => !siblingData?.mode || siblingData?.mode === 'daily',
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
        description: 'Thêm ca khám của từng bác sĩ. Bạn có thể thêm nhiều bác sĩ vào cùng 1 ngày (ví dụ: nhiều dòng cùng chọn Thứ Hai) một cách nhanh chóng. Phía ngoài website hệ thống sẽ tự động gộp tất cả bác sĩ cùng thứ vào một hàng ngang chuyên nghiệp duy nhất.',
        initCollapsed: false,
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
    // =========================================================================
    // LỊCH TRỰC CẤP CỨU THEO TUẦN (Emergency Weekly Schedule - Matrix Table)
    // =========================================================================
    {
      type: 'row',
      fields: [
        { name: 'emergencyWeekStart', label: 'Tuần trực từ ngày', type: 'date', admin: { condition: (_data, siblingData) => siblingData?.mode === 'emergency', width: '50%', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } } },
        { name: 'emergencyWeekEnd', label: 'Đến ngày', type: 'date', admin: { condition: (_data, siblingData) => siblingData?.mode === 'emergency', width: '50%', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } } },
      ],
    },
    {
      name: 'emergencyTemplateHelper',
      type: 'ui',
      admin: {
        condition: (_data, siblingData) => siblingData?.mode === 'emergency',
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
        condition: (_data, siblingData) => siblingData?.mode === 'emergency',
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
        condition: (_data, siblingData) => siblingData?.mode === 'emergency',
        description: 'Ghi chú điều động, công tác, học tập của các bác sĩ trong tuần (tự động import từ file Excel).',
      },
    },
    {
      name: 'emergencyContacts',
      label: 'Danh bạ điện thoại trực & Cấp cứu liên viện',
      type: 'array',
      admin: {
        condition: (_data, siblingData) => siblingData?.mode === 'emergency',
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
        condition: (_data, siblingData) => siblingData?.mode === 'emergency',
        description: 'Lưu trữ tệp Excel gốc để tiện tải về xem lại hoặc tra cứu lịch sử khi cần.',
      },
    },

    // =========================================================================
    // ATTACHMENT MODE
    // =========================================================================
    { name: 'scheduleType', label: 'Tính chất lịch', type: 'select', defaultValue: 'official', options: [{ label: 'Lịch chính thức', value: 'official' }, { label: 'Điều chỉnh / bổ sung', value: 'adjustment' }], admin: { condition: (_data, siblingData) => siblingData?.mode === 'attachment' } },
    { name: 'scheduleImage', label: 'Ảnh lịch khám tuần (ưu tiên)', type: 'upload', relationTo: 'media', admin: { condition: (_data, siblingData) => siblingData?.mode === 'attachment', description: 'Tải ảnh JPG/PNG mới hoặc chọn lại ảnh lịch đã có trong thư viện.' } },
    { name: 'scheduleFile', label: 'Tệp lịch khám', type: 'upload', relationTo: 'media', admin: { condition: (_data, siblingData) => siblingData?.mode === 'attachment', description: 'Tải Excel/PDF/Word mới hoặc chọn lại tệp lịch đã có trong thư viện.' } },
    { name: 'attachmentFiles', label: 'Tệp đính kèm bổ sung', type: 'array', admin: { condition: (_data, siblingData) => siblingData?.mode === 'attachment' }, fields: [{ name: 'file', label: 'Tệp', type: 'upload', relationTo: 'media', required: true }, { name: 'label', label: 'Tên hiển thị', type: 'text' }] },
    { name: 'validFrom', label: 'Hiệu lực từ ngày', type: 'date', admin: { condition: (_data, siblingData) => siblingData?.mode === 'attachment', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } } },
    { name: 'validTo', label: 'Hiệu lực đến ngày', type: 'date', admin: { condition: (_data, siblingData) => siblingData?.mode === 'attachment', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } } },
    { name: 'note', label: 'Ghi chú chung', type: 'textarea' },
    { name: 'active', label: 'Đang áp dụng', type: 'checkbox', defaultValue: true },
  ],
}


