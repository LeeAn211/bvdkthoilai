import type { GlobalConfig } from 'payload'
import { admins } from '@/access'

export const SurveyPageSettings: GlobalConfig = {
  slug: 'survey-page-settings',
  label: 'Trang Khảo sát ý kiến',
  admin: {
    group: '💬 Chăm sóc người bệnh & Khảo sát',
    description: 'Tùy chỉnh tiêu đề, mô tả, thông báo và các danh mục phòng khám / khoa nội trú dùng cho phiếu khảo sát trên trang /khao-sat.',
  },
  access: { read: () => true, update: admins },
  fields: [
    { name: 'eyebrow', label: 'Nhãn nhỏ (Eyebrow)', type: 'text', defaultValue: 'CHĂM SÓC NGƯỜI BỆNH & KHẢO SÁT' },
    { name: 'title', label: 'Tiêu đề trang', type: 'text', defaultValue: 'Khảo sát Ý kiến & Sự hài lòng' },
    { name: 'description', label: 'Mô tả trang', type: 'textarea', defaultValue: 'Bệnh viện Đa khoa Khu vực Thới Lai trân trọng từng ý kiến đóng góp của người bệnh và thân nhân để không ngừng nâng cao y đức, văn hóa phục vụ và chất lượng điều trị.' },
    { name: 'showNoticeBanner', label: 'Bật thông báo lưu ý đầu trang', type: 'checkbox', defaultValue: false },
    { name: 'noticeTitle', label: 'Tiêu đề thông báo lưu ý', type: 'text', defaultValue: 'Quy chế khảo sát ẩn danh' },
    { name: 'noticeContent', label: 'Nội dung thông báo (Hỗ trợ Enter)', type: 'textarea', defaultValue: 'Mọi câu trả lời của quý người bệnh hoàn toàn bảo mật và không ảnh hưởng đến quá trình điều trị.' },
    {
      name: 'noticeAlign',
      label: 'Canh lề thông báo',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Canh trái (Mặc định)', value: 'left' },
        { label: 'Canh giữa', value: 'center' },
        { label: 'Canh đều 2 bên (Justify)', value: 'justify' },
      ],
    },
    {
      name: 'infoBoxes',
      label: '3 Ô nguyên tắc / lưu ý khảo sát',
      type: 'array',
      labels: { singular: 'Ô thông tin', plural: 'Các ô thông tin' },
      admin: { description: 'Tùy chỉnh bật/tắt, biểu tượng, tiêu đề và mô tả của 3 ô thông tin trên trang /khao-sat.' },
      fields: [
        { name: 'enabled', label: 'Bật ô này', type: 'checkbox', defaultValue: true },
        { name: 'icon', label: 'Biểu tượng (Icon / Emoji)', type: 'text', defaultValue: '🛡️' },
        { name: 'title', label: 'Tiêu đề ô', type: 'text', required: true },
        { name: 'desc', label: 'Nội dung chi tiết', type: 'textarea', required: true },
      ],
    },
    {
      name: 'outpatientClinics',
      label: 'Danh sách Phòng khám Ngoại trú (Mỗi dòng 1 phòng khám)',
      type: 'textarea',
      admin: {
        description: 'Người quản trị có thể thêm mới, chỉnh sửa, xóa các phòng khám ngoại trú. Mỗi dòng là 1 lựa chọn hiển thị trong phiếu khảo sát ngoại trú.',
        placeholder: 'Phòng khám Nội tổng quát / Tim mạch / Tiểu đường\nPhòng khám Ngoại - Chấn thương\nPhòng khám Sản - Phụ khoa\nPhòng khám Nhi khoa\nLiên chuyên khoa Mắt - TMH - Răng Hàm Mặt\nPhòng khám Y học cổ truyền & Phục hồi chức năng\nKhu vực Tiếp nhận Cấp cứu',
      },
    },
    {
      name: 'inpatientDepartments',
      label: 'Danh sách Khoa điều trị Nội trú (Mỗi dòng 1 khoa)',
      type: 'textarea',
      admin: {
        description: 'Danh sách khoa điều trị nội trú. Mỗi dòng là 1 lựa chọn hiển thị trong phiếu khảo sát nội trú.',
        placeholder: 'Khoa Nội tổng hợp\nKhoa Ngoại tổng hợp\nKhoa Phụ sản\nKhoa Nhi\nKhoa Hồi sức cấp cứu (ICU)\nKhoa Y học cổ truyền & PHCN\nKhoa Truyền nhiễm',
      },
    },
    {
      name: 'staffPositions',
      label: 'Danh sách Vị trí chuyên môn / Chức danh Nhân viên y tế',
      type: 'textarea',
      admin: {
        description: 'Vị trí công tác của cán bộ nhân viên y tế (Mỗi dòng 1 vị trí).',
        placeholder: 'Bác sĩ điều trị\nĐiều dưỡng / Hộ sinh\nDược sĩ\nKỹ thuật viên xét nghiệm / CĐHA\nChuyên viên / Nhân viên phòng chức năng\nLãnh đạo Khoa / Phòng\nNhân viên hỗ trợ khác',
      },
    },
    {
      name: 'staffUnitTypes',
      label: 'Danh sách Khối đơn vị công tác (Mỗi dòng 1 khối)',
      type: 'textarea',
      admin: {
        description: 'Khối đơn vị công tác của nhân viên y tế (Mỗi dòng 1 khối đơn vị).',
        placeholder: 'Khoa Lâm sàng (Nội, Ngoại, Sản, Nhi, Cấp cứu...)\nKhoa Cận lâm sàng (Xét nghiệm, CĐHA, Dược...)\nPhòng Chức năng (KHTH, TCCB, TCKT, QLCL, ĐD...)',
      },
    },
    {
      name: 'staffDepartments',
      label: 'Danh sách Khoa / Phòng trực thuộc Nhân viên y tế',
      type: 'textarea',
      admin: {
        description: 'Danh sách khoa/phòng phân công công tác nhân viên y tế (Mỗi dòng 1 khoa/phòng).',
        placeholder: 'Khoa Khám bệnh\nKhoa Cấp cứu - Hồi sức tích cực\nKhoa Nội tổng hợp\nKhoa Ngoại tổng hợp\nKhoa Phụ sản\nKhoa Nhi\nKhoa Y học cổ truyền & PHCN\nKhoa Dược\nKhoa Xét nghiệm & CĐHA\nKhối các Phòng chức năng',
      },
    },
    {
      name: 'areaSuggestions',
      label: 'Danh sách Gợi ý Nơi cư trú (Mỗi dòng 1 địa chỉ theo chính quyền 2 cấp)',
      type: 'textarea',
      admin: {
        description: 'Danh sách gợi ý xã/phường/thị trấn và tỉnh/thành phố khi người bệnh nhập địa chỉ cư trú (Mỗi dòng 1 gợi ý).',
        placeholder: 'Xã Thới Lai, TP. Cần Thơ\nXã Trường Thành, TP. Cần Thơ\nXã Đông Thuận, TP. Cần Thơ\nXã Trường Xuân, TP. Cần Thơ\nXã Đông Hiệp, TP. Cần Thơ\nPhường Ô Môn, TP. Cần Thơ\nXã Trường Long, TP. Cần Thơ\nXã Thới Hưng, TP. Cần Thơ\nThị trấn Cờ Đỏ, TP. Cần Thơ\nThị trấn Phong Điền, TP. Cần Thơ\nPhường Thốt Nốt, TP. Cần Thơ\nPhường Ninh Kiều, TP. Cần Thơ\nPhường An Khánh, TP. Cần Thơ\nTỉnh Hậu Giang\nTỉnh Kiên Giang\nTỉnh An Giang\nTỉnh Đồng Tháp',
      },
    },
  ],
}
