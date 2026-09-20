export const id = '20260920_055_chatbot_admin_answer_content'
export const description = 'Đưa mẫu trả lời hệ thống và các nội dung điều hướng chatbot vào khu vực quản trị'
export const transactional = false

const intents = [
  ['Đặt lịch khám', ['dat lich kham', 'dang ky kham', 'hen kham', 'lay hen bac si'], 'Bạn có thể gửi yêu cầu đặt lịch khám tại cơ sở, chọn ngày, khung giờ và chuyên khoa phù hợp. Bệnh viện sẽ tiếp nhận và liên hệ xác nhận.', 'Đặt lịch khám', '/dat-lich-kham'],
  ['Đội ngũ bác sĩ', ['tim bac si', 'danh sach bac si', 'bac si chuyen khoa', 'doi ngu bac si'], 'Trang Đội ngũ bác sĩ giúp bạn tra cứu bác sĩ, chuyên môn và khoa/phòng công tác.', 'Xem đội ngũ bác sĩ', '/bac-si'],
  ['Danh sách chuyên khoa', ['chuyen khoa nao', 'danh sach chuyen khoa', 'khoa kham', 'kham khoa nao'], 'Bạn có thể xem danh sách chuyên khoa và phạm vi khám chữa bệnh của từng khoa. Nếu chưa xác định được khoa phù hợp, hãy gửi câu hỏi cho tư vấn viên.', 'Xem các chuyên khoa', '/chuyen-khoa'],
  ['Quy trình khám bệnh', ['quy trinh kham', 'thu tuc kham', 'di kham can gi', 'cac buoc kham benh', 'lay so kham'], 'Trang Quy trình khám bệnh hướng dẫn các bước tiếp nhận, đăng ký, khám lâm sàng, cận lâm sàng, thanh toán và nhận thuốc.', 'Xem quy trình khám', '/quy-trinh-kham-benh'],
  ['BHYT và thông tin người bệnh', ['bao hiem y te', 'bhyt', 'quyen loi bao hiem', 'kham bao hiem', 'giay to bhyt'], 'Thông tin dành cho người bệnh bao gồm hướng dẫn giấy tờ, quyền lợi BHYT, quy trình khám và các tiện ích hỗ trợ.', 'Thông tin dành cho người bệnh', '/danh-cho-nguoi-benh'],
  ['Điều trị nội trú', ['dieu tri noi tru', 'nhap vien', 'tham nuoi benh', 'nguoi nuoi benh', 'noi quy noi tru'], 'Trang Điều trị nội trú cung cấp hướng dẫn nhập viện, sinh hoạt, thăm nuôi và các lưu ý trong thời gian điều trị.', 'Xem hướng dẫn nội trú', '/dieu-tri-noi-tru'],
  ['Gói khám sức khỏe', ['goi kham', 'kham tong quat', 'kham suc khoe', 'kham lai xe', 'kham xin viec'], 'Bạn có thể tra cứu các gói khám sức khỏe, đối tượng áp dụng và nội dung kiểm tra trên trang Gói khám.', 'Xem các gói khám', '/goi-kham'],
  ['Sơ đồ bệnh viện', ['so do benh vien', 'duong den khoa', 'khoa o dau', 'phong o dau', 'ban do benh vien'], 'Sơ đồ bệnh viện giúp bạn xác định khu vực tiếp đón, khoa/phòng và hướng di chuyển trong khuôn viên.', 'Mở sơ đồ bệnh viện', '/so-do-benh-vien'],
  ['Liên hệ bệnh viện', ['dia chi benh vien', 'so dien thoai', 'hotline', 'lien he benh vien', 'duong di'], 'Trang Liên hệ cung cấp địa chỉ, số điện thoại, hotline và bản đồ chỉ đường đến Bệnh viện Đa khoa Khu vực Thới Lai.', 'Xem thông tin liên hệ', '/lien-he'],
  ['Gửi góp ý phản ánh', ['gop y', 'phan anh', 'khieu nai', 'khen ngoi', 'gui y kien'], 'Bạn có thể gửi góp ý, phản ánh hoặc lời khen trực tuyến. Hệ thống sẽ cấp mã hồ sơ để theo dõi quá trình xử lý.', 'Gửi góp ý – phản ánh', '/gop-y'],
  ['Tra cứu phản ánh', ['tra cuu gop y', 'tra cuu phan anh', 'ma phan anh', 'tinh trang phan anh'], 'Bạn hãy nhập mã hồ sơ đã được cấp để kiểm tra trạng thái và nội dung phản hồi từ bệnh viện.', 'Tra cứu phản ánh', '/gop-y/tra-cuu'],
  ['Khảo sát hài lòng', ['khao sat hai long', 'danh gia benh vien', 'phieu khao sat', 'khao sat nguoi benh'], 'Bạn có thể tham gia khảo sát để đánh giá chất lượng phục vụ và gửi ý kiến cải tiến cho bệnh viện.', 'Tham gia khảo sát', '/khao-sat'],
  ['Biểu mẫu', ['bieu mau', 'tai mau don', 'mau don benh vien', 'form benh vien'], 'Trang Biểu mẫu cung cấp các mẫu đơn và tài liệu hành chính đang được bệnh viện công khai.', 'Xem biểu mẫu', '/bieu-mau'],
  ['Văn bản tài liệu', ['van ban', 'tai lieu', 'quyet dinh', 'cong van'], 'Bạn có thể tra cứu văn bản, quyết định và tài liệu công khai của bệnh viện.', 'Tra cứu văn bản', '/van-ban'],
  ['Tuyển dụng', ['tuyen dung', 'xin viec benh vien', 'viec lam benh vien', 'nop ho so tuyen dung'], 'Thông tin vị trí tuyển dụng, yêu cầu và thời hạn nộp hồ sơ được cập nhật trên trang Tuyển dụng.', 'Xem thông tin tuyển dụng', '/tuyen-dung'],
  ['Phác đồ điều trị', ['phac do dieu tri', 'huong dan dieu tri', 'quy trinh chuyen mon'], 'Kho Phác đồ điều trị cung cấp các hướng dẫn chuyên môn được bệnh viện công bố theo từng chuyên khoa.', 'Xem phác đồ điều trị', '/phac-do-dieu-tri'],
  ['Kỹ thuật chuyên sâu', ['ky thuat chuyen sau', 'ky thuat moi', 'dich vu ky thuat'], 'Trang Kỹ thuật chuyên sâu giới thiệu các kỹ thuật và năng lực chuyên môn đang triển khai tại bệnh viện.', 'Xem kỹ thuật chuyên sâu', '/ky-thuat-chuyen-sau'],
  ['Chất lượng bệnh viện', ['chat luong benh vien', 'an toan nguoi benh', 'chi so chat luong'], 'Trang Chất lượng bệnh viện cung cấp thông tin về hoạt động cải tiến chất lượng và an toàn người bệnh.', 'Xem chất lượng bệnh viện', '/chat-luong-benh-vien'],
  ['Tìm kiếm website', ['tim kiem tren website', 'tim noi dung', 'tra cuu website'], 'Bạn có thể sử dụng trang Tìm kiếm để tra cứu đồng thời tin tức, thông báo, bác sĩ và các nội dung công khai.', 'Mở trang tìm kiếm', '/tim-kiem'],
]

export async function up({ client }) {
  await client.query(`
    ALTER TABLE public."chatbot_settings"
      ADD COLUMN IF NOT EXISTS "emergency_response" varchar,
      ADD COLUMN IF NOT EXISTS "schedule_response_template" varchar,
      ADD COLUMN IF NOT EXISTS "working_hours_response_template" varchar,
      ADD COLUMN IF NOT EXISTS "vaccine_response_template" varchar,
      ADD COLUMN IF NOT EXISTS "notice_response_template" varchar,
      ADD COLUMN IF NOT EXISTS "procurement_response_template" varchar,
      ADD COLUMN IF NOT EXISTS "price_response" varchar;
  `)

  for (const [name, phrases, answer, linkLabel, linkUrl] of intents) {
    const existing = await client.query('SELECT id FROM public."chatbot_intents" WHERE name = $1 LIMIT 1', [name])
    let parentId = existing.rows[0]?.id
    if (!parentId) {
      const inserted = await client.query(`
        INSERT INTO public."chatbot_intents" (name, answer, link_label, link_url, open_new_tab, priority, active, updated_at, created_at)
        VALUES ($1, $2, $3, $4, false, 20, true, NOW(), NOW()) RETURNING id
      `, [name, answer, linkLabel, linkUrl])
      parentId = inserted.rows[0].id
    }
    for (const [order, phrase] of phrases.entries()) {
      await client.query(`
        INSERT INTO public."chatbot_intents_phrases" (_order, _parent_id, id, text)
        VALUES ($1::integer, $2::integer, md5($2::integer::text || ':' || $3::text), $3::varchar)
        ON CONFLICT (id) DO NOTHING
      `, [order, parentId, phrase])
    }
  }
}

export async function verify({ client }) {
  const columns = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'chatbot_settings'
      AND column_name IN ('emergency_response', 'schedule_response_template', 'working_hours_response_template', 'vaccine_response_template', 'notice_response_template', 'procurement_response_template', 'price_response')
  `)
  if (columns.rowCount !== 7) throw new Error('Thiếu cột cấu hình nội dung trả lời chatbot.')
  const seeded = await client.query('SELECT COUNT(*)::int AS count FROM public."chatbot_intents" WHERE name = ANY($1::text[])', [intents.map((item) => item[0])])
  if (seeded.rows[0].count < intents.length) throw new Error('Chưa nạp đủ kịch bản chatbot mặc định.')
}
