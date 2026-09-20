export const id = '20260920_059_reconcile_generated_schema'
export const description = 'Đồng bộ default chatbot với schema Payload được sinh tự động và xác nhận schema production'

export async function up({ client }) {
  await client.query(`
    ALTER TABLE public."chatbot_settings"
      ALTER COLUMN "emergency_response" SET DEFAULT 'Dấu hiệu bạn mô tả có thể cần được cấp cứu. Vui lòng gọi ngay Bệnh viện Đa khoa Khu vực Thới Lai theo số {{HOTLINE}} hoặc gọi 115. Không tự dùng thuốc và không chờ chatbot tư vấn thêm nếu tình trạng đang nặng lên.',
      ALTER COLUMN "schedule_response_template" SET DEFAULT 'Lịch khám mới nhất đang được bệnh viện công bố: {{TITLE}}. Bạn hãy mở trang Lịch khám để xem bác sĩ, chuyên khoa và thời gian cụ thể.',
      ALTER COLUMN "working_hours_response_template" SET DEFAULT E'Thời gian tiếp nhận và khám bệnh đang được bệnh viện công bố:\\n{{ITEMS}}',
      ALTER COLUMN "vaccine_response_template" SET DEFAULT 'Các vắc xin đang được cập nhật là còn sẵn gồm: {{ITEMS}}. Tình trạng có thể thay đổi, vui lòng xem danh mục chi tiết trước khi đăng ký.',
      ALTER COLUMN "notice_response_template" SET DEFAULT 'Thông báo mới nhất: {{TITLE}}',
      ALTER COLUMN "procurement_response_template" SET DEFAULT 'Thông tin Đấu thầu – Mua sắm mới nhất: {{TITLE}}',
      ALTER COLUMN "price_response" SET DEFAULT 'Bảng giá dịch vụ và viện phí được cập nhật trực tiếp trên trang tra cứu của bệnh viện. Bạn có thể tìm theo tên dịch vụ để xem mức giá hiện hành.';
  `)
}

export async function verify({ client }) {
  const result = await client.query(`
    SELECT COUNT(*)::int AS count
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'chatbot_settings'
      AND column_name IN (
        'emergency_response',
        'schedule_response_template',
        'working_hours_response_template',
        'vaccine_response_template',
        'notice_response_template',
        'procurement_response_template',
        'price_response'
      )
      AND column_default IS NOT NULL
  `)
  if (result.rows[0]?.count !== 7) {
    throw new Error('Các default nội dung chatbot chưa được đồng bộ đầy đủ.')
  }
}
