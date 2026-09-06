import type { CollectionConfig } from 'payload'
import { publicActive } from '@/access'

/**
 * Bảng legacy của giai đoạn đầu: từng trộn thông báo, đợt tiêm và danh mục vắc xin.
 * Giữ collection để đọc/migrate dữ liệu cũ, nhưng không cho nhập mới từ Admin.
 * Nguồn chuẩn hiện tại: vaccinationSchedules + vaccines + vaccinePrices.
 */
export const Vaccinations: CollectionConfig = {
  slug: 'vaccinations',
  labels: { singular: 'Tiêm ngừa cũ', plural: 'Tiêm ngừa cũ (Legacy)' },
  admin: {
    useAsTitle: 'vaccineName',
    group: 'Khám bệnh',
    hidden: true,
    description: 'Dữ liệu tương thích phiên bản cũ. Không nhập mới. Hãy dùng Lịch tiêm chủng và Danh mục vắc xin.',
  },
  access: {
    read: publicActive,
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    { name: 'entryType', label: 'Nhóm thông tin', type: 'select', required: true, defaultValue: 'campaign', options: [
      { label: 'Thông báo lịch tiêm ngừa chung', value: 'announcement' },
      { label: 'Tiêm ngừa theo đợt', value: 'campaign' },
      { label: 'Loại vắc xin tiêm ngừa', value: 'vaccine' },
    ] },
    { name: 'vaccineName', label: 'Tiêu đề / Tên vắc xin', type: 'text', required: true },
    { name: 'summary', label: 'Mô tả ngắn', type: 'textarea' },
    { name: 'announcementContent', label: 'Nội dung thông báo chung', type: 'richText' },
    { name: 'announcementImage', label: 'Ảnh thông báo', type: 'upload', relationTo: 'media' },
    { name: 'announcementFile', label: 'Tệp thông báo', type: 'upload', relationTo: 'media' },
    { name: 'campaignImage', label: 'Ảnh đợt tiêm', type: 'upload', relationTo: 'media' },
    { name: 'target', label: 'Đối tượng tiêm', type: 'text' },
    { name: 'date', label: 'Ngày bắt đầu', type: 'date' },
    { name: 'endDate', label: 'Ngày kết thúc', type: 'date' },
    { name: 'startTime', label: 'Giờ bắt đầu', type: 'text' },
    { name: 'endTime', label: 'Giờ kết thúc', type: 'text' },
    { name: 'location', label: 'Địa điểm', type: 'text' },
    { name: 'manufacturer', label: 'Nhà sản xuất', type: 'text' },
    { name: 'origin', label: 'Nước sản xuất', type: 'text' },
    { name: 'prevents', label: 'Phòng bệnh', type: 'textarea' },
    { name: 'ageGroup', label: 'Độ tuổi / đối tượng', type: 'text' },
    { name: 'vaccineImage', label: 'Ảnh vắc xin', type: 'upload', relationTo: 'media' },
    { name: 'detailContent', label: 'Nội dung chi tiết', type: 'richText' },
    { name: 'availability', label: 'Tình trạng', type: 'select', defaultValue: 'available', options: [
      { label: 'Đang có vắc xin', value: 'available' },
      { label: 'Sắp có', value: 'coming' },
      { label: 'Tạm hết', value: 'unavailable' },
    ] },
    { name: 'fee', label: 'Giá tiêm dự kiến', type: 'number', min: 0 },
    { name: 'note', label: 'Ghi chú', type: 'textarea' },
    { name: 'registrationUrl', label: 'Liên kết đăng ký', type: 'text' },
    { name: 'active', label: 'Hiển thị trên website', type: 'checkbox', defaultValue: true },
  ],
}
