import fs from 'fs';
import { Client } from 'pg';

const env = fs.readFileSync('.env', 'utf8');
let conn = '';
for (const line of env.split('\n')) {
  if (line.startsWith('DATABASE_URL=')) conn = line.replace('DATABASE_URL=', '').trim();
}
const client = new Client({ connectionString: conn });

async function seedRemainingTabs() {
  await client.connect();
  console.log('Connected to DB...');

  // ==========================================
  // 1. PATIENT PORTAL SETTINGS (/danh-cho-nguoi-benh)
  // ==========================================
  let ppsId;
  const ppsExist = await client.query('SELECT id FROM patient_portal_settings LIMIT 1');
  if (ppsExist.rows.length === 0) {
    const res = await client.query(`
      INSERT INTO patient_portal_settings (
        hero_eyebrow, hero_title, hero_description, hero_show_notice_banner,
        hero_notice_title, hero_notice_content, hero_notice_align,
        commitments_section_enabled, cta_section_enabled,
        cta_section_title, cta_section_description,
        cta_section_primary_btn_text, cta_section_secondary_btn_text, cta_section_secondary_btn_link
      ) VALUES (
        'CỔNG TIỆN ÍCH DÀNH CHO NGƯỜI BỆNH',
        'Dành cho Người bệnh',
        'Tổng hợp đầy đủ hướng dẫn quy trình khám chữa bệnh, lịch làm việc, biểu phí, kênh tiếp nhận phản ánh và khảo sát ý kiến tại Bệnh viện Đa khoa Khu vực Thới Lai.',
        false,
        'Thông báo dành cho người bệnh & thân nhân',
        '• Vui lòng mang theo CCCD gắn chip (hoặc ứng dụng VNeID mức 2) và thẻ BHYT khi đến đăng ký khám.\n• Đặt lịch hẹn trực tuyến để được tiếp nhận ưu tiên và giảm thời gian chờ đợi.',
        'left',
        true, true,
        'Bạn cần hỗ trợ khẩn cấp hoặc cần hỏi thêm thông tin?',
        'Đường dây nóng bệnh viện: 0292 3861 234 · Cấp cứu 24/24: 0292 3861 115. Bệnh viện luôn sẵn sàng phục vụ!',
        'Gọi tư vấn ngay',
        'Thông tin liên hệ',
        '/lien-he'
      ) RETURNING id
    `);
    ppsId = res.rows[0].id;
  } else {
    ppsId = ppsExist.rows[0].id;
  }

  // Sub-tabs
  const subTabCount = await client.query('SELECT count(*) FROM pps_sub_tabs WHERE _parent_id = $1', [ppsId]);
  if (parseInt(subTabCount.rows[0].count) === 0) {
    const tabs = [
      { order: 1, id: 'tab-1', key: 'danh-cho-nguoi-benh', label: 'Cổng tổng hợp', href: '/danh-cho-nguoi-benh', icon: '🏥', badge: '' },
      { order: 2, id: 'tab-2', key: 'quy-trinh', label: 'Quy trình khám', href: '/quy-trinh-kham-benh', icon: '🩺', badge: '' },
      { order: 3, id: 'tab-3', key: 'noi-tru', label: 'Điều trị nội trú', href: '/dieu-tri-noi-tru', icon: '🛏️', badge: '' },
      { order: 4, id: 'tab-4', key: 'goi-kham', label: 'Gói khám sức khỏe', href: '/goi-kham', icon: '📦', badge: '' },
      { order: 5, id: 'tab-5', key: 'so-do', label: 'Sơ đồ bệnh viện', href: '/so-do-benh-vien', icon: '🗺️', badge: '' },
      { order: 6, id: 'tab-6', key: 'khao-sat', label: 'Khảo sát ý kiến', href: '/khao-sat', icon: '📝', badge: '' },
      { order: 7, id: 'tab-7', key: 'gop-y', label: 'Góp ý – Phản ánh', href: '/gop-y', icon: '💬', badge: '' },
      { order: 8, id: 'tab-8', key: 'tra-cuu', label: 'Tra cứu phản ánh', href: '/gop-y/tra-cuu', icon: '🔍', badge: '' },
      { order: 9, id: 'tab-9', key: 'hoi-dap', label: 'Hỏi đáp y tế (FAQ)', href: '/hoi-dap', icon: '❓', badge: '' },
      { order: 10, id: 'tab-10', key: 'bieu-mau', label: 'Biểu mẫu điện tử', href: '/bieu-mau', icon: '📋', badge: '' },
      { order: 11, id: 'tab-11', key: 'chat-luong', label: 'Chất lượng bệnh viện', href: '/chat-luong-benh-vien', icon: '⭐', badge: '' },
      { order: 12, id: 'tab-12', key: 'lien-he', label: 'Liên hệ & Hotline', href: '/lien-he', icon: '📞', badge: '' }
    ];
    for (const t of tabs) {
      await client.query(`
        INSERT INTO pps_sub_tabs (_order, _parent_id, id, enabled, key, label, href, icon, badge)
        VALUES ($1, $2, $3, true, $4, $5, $6, $7, $8)
      `, [t.order, ppsId, t.id, t.key, t.label, t.href, t.icon, t.badge]);
    }
  }

  // Commitments
  const commCount = await client.query('SELECT count(*) FROM pps_commits WHERE _parent_id = $1', [ppsId]);
  if (parseInt(commCount.rows[0].count) === 0) {
    const commits = [
      { order: 1, id: 'comm-1', icon: '❤️', title: 'Lấy người bệnh làm trung tâm', desc: 'Mọi quy trình được tối ưu hóa nhằm rút ngắn thời gian chờ đợi, nâng cao an toàn và sự hài lòng của người bệnh.' },
      { order: 2, id: 'comm-2', icon: '🛡️', title: 'Bảo đảm quyền lợi BHYT 100%', desc: 'Người bệnh có thẻ BHYT được hưởng tối đa mức chi trả theo quy định của Luật BHYT, hỗ trợ tích hợp VssID và CCCD.' },
      { order: 3, id: 'comm-3', icon: '📞', title: 'Hỗ trợ khẩn cấp 24/24', desc: 'Khoa Cấp cứu thường trực 24/7. Đường dây nóng Ban Giám đốc tiếp nhận mọi ý kiến đóng góp kịp thời nhất.' }
    ];
    for (const c of commits) {
      await client.query(`
        INSERT INTO pps_commits (_order, _parent_id, id, enabled, icon, title, "desc")
        VALUES ($1, $2, $3, true, $4, $5, $6)
      `, [c.order, ppsId, c.id, c.icon, c.title, c.desc]);
    }
  }

  // Service Groups & Items
  const grpCount = await client.query('SELECT count(*) FROM pps_svc_groups WHERE _parent_id = $1', [ppsId]);
  if (parseInt(grpCount.rows[0].count) === 0) {
    const group1Id = 'grp-1';
    await client.query(`
      INSERT INTO pps_svc_groups (_order, _parent_id, id, enabled, category_title)
      VALUES (1, $1, $2, true, 'HƯỚNG DẪN & THỦ TỤC THĂM KHÁM')
    `, [ppsId, group1Id]);

    const items1 = [
      { order: 1, id: 'itm-1', title: 'Quy trình Khám bệnh', desc: 'Sơ đồ các bước thăm khám có thẻ BHYT, khám thu phí tự nguyện và tiếp nhận cấp cứu 24/24.', href: '/quy-trinh-kham-benh', icon: '🩺', badge: 'Cần xem trước', badge_type: 'active', button_text: 'Truy cập dịch vụ →' },
      { order: 2, id: 'itm-2', title: 'Giờ làm việc & Khung giờ khám sớm', desc: 'Thời gian phát số từ 06:00, nhóm khoa khám sớm 06:30 sáng và lịch trực các phòng chức năng.', href: '/lich-lam-viec', icon: '⏰', badge: 'Từ 06:00 sáng', badge_type: 'periodic', button_text: 'Xem giờ làm việc →' },
      { order: 3, id: 'itm-3', title: 'Lịch khám bệnh & Lịch trực cấp cứu', desc: 'Tra cứu danh sách bác sĩ trực, lịch phân công phòng khám theo tuần và lịch thường trực cấp cứu.', href: '/lich-kham', icon: '📅', badge: 'Cập nhật hàng tuần', badge_type: 'active', button_text: 'Xem lịch khám →' },
      { order: 4, id: 'itm-4', title: 'Bảng giá Viện phí & Danh mục BHYT', desc: 'Biểu phí khám bệnh, giá ngày giường, phẫu thuật thủ thuật và quyền lợi chi trả bảo hiểm y tế.', href: '/bang-gia', icon: '💳', badge: 'Minh bạch', badge_type: 'periodic', button_text: 'Tra cứu viện phí →' },
      { order: 5, id: 'itm-5', title: 'Hướng dẫn Điều trị Nội trú', desc: 'Thủ tục nhập viện, đồ dùng mang theo, quy định buồng bệnh, giờ thăm và chế độ dinh dưỡng.', href: '/dieu-tri-noi-tru', icon: '🛏️', badge: 'Người bệnh nội trú', badge_type: 'active', button_text: 'Xem hướng dẫn nội trú →' },
      { order: 6, id: 'itm-6', title: 'Gói Khám Sức khỏe & Tầm soát', desc: 'Khám tổng quát, tầm soát tim mạch, khám lái xe, khám tiền hôn nhân với bảng giá chi tiết.', href: '/goi-kham', icon: '📦', badge: 'Chủ động', badge_type: 'active', button_text: 'Xem các gói khám →' },
      { order: 7, id: 'itm-7', title: 'Sơ đồ Chỉ dẫn Khoa / Phòng & Tiện ích', desc: 'Bản đồ phân tầng các phòng khám, xét nghiệm, nhà thuốc GPP, căn tin, ATM và bãi giữ xe.', href: '/so-do-benh-vien', icon: '🗺️', badge: 'Chỉ dẫn tiện ích', badge_type: 'periodic', button_text: 'Xem sơ đồ bệnh viện →' }
    ];

    for (const itm of items1) {
      await client.query(`
        INSERT INTO pps_svc_items (_order, _parent_id, id, enabled, title, "desc", href, icon, badge, badge_type, button_text)
        VALUES ($1, $2, $3, true, $4, $5, $6, $7, $8, $9, $10)
      `, [itm.order, group1Id, itm.id, itm.title, itm.desc, itm.href, itm.icon, itm.badge, itm.badge_type, itm.button_text]);
    }

    const group2Id = 'grp-2';
    await client.query(`
      INSERT INTO pps_svc_groups (_order, _parent_id, id, enabled, category_title)
      VALUES (2, $1, $2, true, 'TIẾP NHẬN Ý KIẾN, KHẢO SÁT & CSKH')
    `, [ppsId, group2Id]);

    const items2 = [
      { order: 1, id: 'itm-8', title: 'Khảo sát ý kiến & Sự hài lòng', desc: 'Đánh giá chất lượng phục vụ nội trú và ngoại trú theo chuẩn 83 Tiêu chí Bộ Y tế (100% ẩn danh).', href: '/khao-sat', icon: '📝', badge: '100% Ẩn danh', badge_type: 'active', button_text: 'Tham gia khảo sát →' },
      { order: 2, id: 'itm-9', title: 'Góp ý – Phản ánh chất lượng', desc: 'Gửi ý kiến đóng góp, phản ánh tinh thần thái độ hoặc khen ngợi tập thể y bác sĩ trực tiếp tới Ban Giám đốc.', href: '/gop-y', icon: '💬', badge: 'Tiếp nhận 24/7', badge_type: 'active', button_text: 'Gửi phản ánh →' },
      { order: 3, id: 'itm-10', title: 'Tra cứu Tiến độ Phản ánh', desc: 'Nhập Mã tiếp nhận hoặc tra cứu theo Số điện thoại để theo dõi trực tuyến kết quả giải quyết và văn bản trả lời chính thức.', href: '/gop-y/tra-cuu', icon: '🔍', badge: 'Minh bạch tiến độ', badge_type: 'active', button_text: 'Tra cứu tiến độ →' },
      { order: 4, id: 'itm-11', title: 'Hỏi đáp Y tế & Câu hỏi thường gặp', desc: 'Tổng hợp giải đáp thắc mắc về BHYT đúng tuyến, thủ tục chuyển viện và tiêm chủng mở rộng.', href: '/hoi-dap', icon: '❓', badge: 'Tra cứu nhanh', badge_type: 'periodic', button_text: 'Xem hỏi đáp y tế →' },
      { order: 5, id: 'itm-12', title: 'Biểu mẫu Điện tử & Tải về', desc: 'Tải về và đăng ký trực tuyến các giấy tờ: Giấy ra viện, Trích sao bệnh án, Đơn xin miễn giảm viện phí.', href: '/bieu-mau', icon: '📋', badge: 'Tải miễn phí', badge_type: 'periodic', button_text: 'Tải biểu mẫu ngay →' },
      { order: 6, id: 'itm-13', title: 'Chất lượng Bệnh viện & Cam kết', desc: 'Bộ chỉ số 83 tiêu chí của Bộ Y tế, đánh giá sự hài lòng và các chương trình cải tiến chất lượng liên tục.', href: '/chat-luong-benh-vien', icon: '⭐', badge: '83 Tiêu chí', badge_type: 'periodic', button_text: 'Xem kết quả chất lượng →' }
    ];

    for (const itm of items2) {
      await client.query(`
        INSERT INTO pps_svc_items (_order, _parent_id, id, enabled, title, "desc", href, icon, badge, badge_type, button_text)
        VALUES ($1, $2, $3, true, $4, $5, $6, $7, $8, $9, $10)
      `, [itm.order, group2Id, itm.id, itm.title, itm.desc, itm.href, itm.icon, itm.badge, itm.badge_type, itm.button_text]);
    }
    console.log('Seeded PatientPortalSettings!');
  }

  // ==========================================
  // 2. EXAMINATION FLOW SETTINGS (/quy-trinh-kham-benh)
  // ==========================================
  let efsId;
  const efsExist = await client.query('SELECT id FROM examination_flow_settings LIMIT 1');
  if (efsExist.rows.length === 0) {
    const res = await client.query(`
      INSERT INTO examination_flow_settings (
        eyebrow, title, description, show_notice_banner, notice_title, notice_content, notice_align,
        show_checklist, show_priority, show_support_banner
      ) VALUES (
        'HƯỚNG DẪN DÀNH CHO NGƯỜI BỆNH',
        'Quy trình Khám chữa bệnh',
        'Sơ đồ và các bước hướng dẫn người bệnh khi đến thăm khám có thẻ BHYT, khám thu phí dịch vụ hoặc tiếp nhận cấp cứu tại Bệnh viện Đa khoa Khu vực Thới Lai.',
        false,
        'Lưu ý khi đến khám tại Bệnh viện Đa khoa Khu vực Thới Lai',
        '• Người bệnh có thẻ BHYT đúng tuyến hoặc thông tuyến được hưởng đầy đủ quyền lợi chi trả.\n• Bệnh viện tiếp nhận khám sớm từ 06:30 tại các khoa chuyên môn trọng điểm.\n• Người cao tuổi, phụ nữ mang thai và trẻ nhỏ được cấp số ưu tiên tiếp đón.',
        'left',
        true, true, true
      ) RETURNING id
    `);
    efsId = res.rows[0].id;
  } else {
    efsId = efsExist.rows[0].id;
  }

  // Flow tabs
  const tabCount = await client.query('SELECT count(*) FROM examination_flow_settings_flow_tabs WHERE _parent_id = $1', [efsId]);
  if (parseInt(tabCount.rows[0].count) === 0) {
    const tabsData = [
      {
        order: 1, id: 'bhyt', label: 'Khám bệnh BHYT', badge_text: 'ĐÚNG TUYẾN & THÔNG TUYẾN TOÀN QUỐC',
        title: 'Quy trình Khám chữa bệnh có thẻ Bảo hiểm Y tế (BHYT)',
        summary: 'Áp dụng cho người bệnh có thẻ BHYT (hoặc ứng dụng VssID / VNeID mức 2 tích hợp thẻ BHYT). Bệnh viện Đa khoa Khu vực Thới Lai tiếp nhận thông tuyến huyện trên phạm vi toàn quốc theo đúng chính sách của Bộ Y tế.',
        steps: [
          { step: 1, title: 'Lấy số thứ tự & Tiếp đón ban đầu', location: 'Khu tiếp đón bệnh nhân – Tầng 1, Khoa Khám bệnh', time_estimate: '3 – 5 phút', desc: 'Người bệnh đến sảnh khoa khám bệnh, lấy số thứ tự tự động tại cây phát số hoặc nhận sự hướng dẫn trực tiếp từ nhân viên Tổ Chăm sóc khách hàng.', actions: '• Bấm máy lấy số thứ tự theo diện Khám BHYT.\n• Người cao tuổi (trên 75 tuổi), trẻ em dưới 6 tuổi, phụ nữ mang thai và người khuyết tật được cấp số ưu tiên.\n• Ngồi chờ tại ghế chờ sảnh tiếp đón, quan sát bảng điện tử gọi số.', note: 'Có thể sử dụng Căn cước công dân gắn chip để quét mã tự động lấy số nhanh chóng.', is_highlight: false, is_emergency: false },
          { step: 2, title: 'Đăng ký thông tin & Xuất trình thẻ BHYT', location: 'Quầy tiếp nhận BHYT (Cửa số 1 – 4)', time_estimate: '5 – 7 phút', desc: 'Khi bảng điện tử báo đến lượt, người bệnh đến quầy tiếp nhận để kiểm tra thẻ BHYT và phân buồng khám chuyên khoa.', actions: '• Xuất trình CCCD gắn chip (hoặc thẻ BHYT giấy + giấy tờ tùy thân có ảnh, hoặc VssID / VNeID).\n• Nộp giấy chuyển tuyến BHYT (nếu có trường hợp chuyển tuyến theo quy định).\n• Nhân viên y tế nhập thông tin, đo sinh hiệu cơ bản (huyết áp, nhiệt độ) và cấp Phiếu khám có số phòng & số thứ tự vào phòng khám.', note: 'Người bệnh giữ cẩn thận Phiếu khám bệnh và giấy tờ tùy thân để đối chiếu tại phòng khám.', is_highlight: true, is_emergency: false },
          { step: 3, title: 'Bác sĩ thăm khám lâm sàng', location: 'Phòng khám chuyên khoa ghi trên phiếu khám', time_estimate: '10 – 15 phút', desc: 'Người bệnh di chuyển đến trước phòng khám chuyên khoa tương ứng, chờ gọi tên theo số thứ tự hiển thị trên màn hình trước cửa phòng.', actions: '• Bác sĩ thăm khám, hỏi tiền sử bệnh tật, chẩn đoán ban đầu.\n• Nếu bệnh nhẹ không cần xét nghiệm: Bác sĩ kê đơn thuốc điều trị ngoại trú.\n• Nếu cần cận lâm sàng: Bác sĩ in Phiếu chỉ định (Xét nghiệm máu, nước tiểu, X-quang, Siêu âm, Điện tim...).', note: '', is_highlight: false, is_emergency: false },
          { step: 4, title: 'Thực hiện Cận lâm sàng (nếu có chỉ định)', location: 'Khoa Cận lâm sàng & Chẩn đoán hình ảnh', time_estimate: '20 – 45 phút (tùy dịch vụ)', desc: 'Người bệnh cầm phiếu chỉ định đến khu vực cận lâm sàng để lấy mẫu xét nghiệm hoặc chụp chiếu hình ảnh.', actions: '• Nộp phiếu tại Bàn tiếp nhận cận lâm sàng để lấy số thứ tự kỹ thuật.\n• Lấy mẫu máu/nước tiểu tại phòng Xét nghiệm (nhịn ăn sáng nếu có xét nghiệm đường huyết, mỡ máu).\n• Thực hiện Chụp X-Quang, Siêu âm ổ bụng/tim mạch, Đo điện tim theo hướng dẫn của kỹ thuật viên.\n• Ngồi chờ kết quả tại khu vực ghế chờ. Kết quả xét nghiệm và hình ảnh sẽ được liên thông tự động về máy tính của Bác sĩ khám.', note: 'Người bệnh không cần tự lấy kết quả giấy (trừ phim X-Quang), hệ thống mạng nội bộ viện sẽ gửi trực tiếp đến phòng khám ban đầu.', is_highlight: false, is_emergency: false },
          { step: 5, title: 'Bác sĩ kết luận & Tư vấn điều trị', location: 'Trở lại Phòng khám ban đầu (Bước 3)', time_estimate: '5 – 10 phút', desc: 'Sau khi có đầy đủ kết quả cận lâm sàng, người bệnh quay lại phòng khám ban đầu để bác sĩ hội chẩn và ra phác đồ điều trị.', actions: '• Bác sĩ đọc kết quả cận lâm sàng, giải thích tình trạng bệnh cho người bệnh và người nhà.\n• Kê đơn thuốc điều trị ngoại trú và hẹn ngày tái khám.\n• Hoặc chỉ định làm thủ tục Nhập viện điều trị nội trú nếu tình trạng bệnh cần theo dõi chuyên sâu.', note: '', is_highlight: false, is_emergency: false },
          { step: 6, title: 'Thanh toán viện phí & Đồng chi trả BHYT', location: 'Quầy Thu viện phí – Khoa Khám bệnh', time_estimate: '5 phút', desc: 'Người bệnh nộp phiếu thanh toán để đối soát chi phí BHYT và thanh toán phần đồng chi trả (nếu có).', actions: '• Nhân viên viện phí in Bảng kê chi phí khám chữa bệnh theo mẫu 01/BV của Bộ Y tế.\n• Người bệnh kiểm tra các mục chi phí và thanh toán phần tiền chênh lệch (nếu có).\n• Nhận lại Thẻ BHYT, CCCD và biên lai thu tiền điện tử.', note: 'Bệnh viện chấp nhận thanh toán không dùng tiền mặt (Quét mã VietQR, Chuyển khoản, Thẻ ngân hàng).', is_highlight: false, is_emergency: false },
          { step: 7, title: 'Lĩnh thuốc BHYT & Ra về', location: 'Khoa Dược – Quầy Phát thuốc Ngoại trú BHYT', time_estimate: '5 – 10 phút', desc: 'Người bệnh nộp đơn thuốc đã thanh toán tại quầy phát thuốc BHYT để nhận thuốc và nghe hướng dẫn sử dụng.', actions: '• Nộp đơn thuốc vào rổ tiếp nhận và chờ gọi tên.\n• Dược sĩ kiểm tra đơn thuốc, cấp phát đầy đủ thuốc theo danh mục BHYT.\n• Dược sĩ hướng dẫn cẩn thận liều dùng, thời điểm uống thuốc và những kiêng cữ cần thiết.\n• Người bệnh kiểm tra lại số lượng thuốc trước khi rời quầy và hoàn tất quy trình khám.', note: '', is_highlight: false, is_emergency: false }
        ]
      },
      {
        order: 2, id: 'dich-vu', label: 'Khám Thu phí / Dịch vụ', badge_text: 'NHANH CHÓNG & TIỆN ÍCH',
        title: 'Quy trình Khám bệnh Thu phí (Viện phí / Không BHYT)',
        summary: 'Dành cho người dân không tham gia BHYT, người có nhu cầu khám theo yêu cầu chuyên gia, khám kiểm tra sức khỏe tổng quát định kỳ hoặc người khám vượt tuyến không xuất trình BHYT.',
        steps: [
          { step: 1, title: 'Tiếp đón & Đăng ký khám Dịch vụ', location: 'Quầy tiếp nhận Khám Dịch vụ & Thu viện phí', time_estimate: '3 – 5 phút', desc: 'Người bệnh đến quầy tiếp đón dịch vụ, nêu rõ nhu cầu khám chuyên khoa hoặc khám sức khỏe tổng quát.', actions: '• Cung cấp thông tin cá nhân (Họ tên, ngày sinh, số điện thoại, CCCD).\n• Đăng ký chuyên khoa mong muốn (Nội, Ngoại, Sản, Nhi, Mắt, Tai Mũi Họng, Răng Hàm Mặt, Y học cổ truyền...).\n• Tạm ứng tiền công khám theo bảng giá niêm yết công khai của bệnh viện.\n• Nhận Phiếu khám dịch vụ có số phòng và số thứ tự.', note: '', is_highlight: false, is_emergency: false },
          { step: 2, title: 'Khám chuyên khoa & Tư vấn', location: 'Phòng khám Chuyên khoa theo phiếu', time_estimate: '10 – 15 phút', desc: 'Bác sĩ chuyên khoa thăm khám trực tiếp, tư vấn gói cận lâm sàng phù hợp với tình trạng sức khỏe.', actions: '• Bác sĩ thăm khám cẩn thận, lắng nghe các triệu chứng và nhu cầu kiểm tra.\n• Chỉ định các xét nghiệm hoặc chẩn đoán hình ảnh cần thiết, giải thích rõ mục đích và chi phí dự kiến.', note: '', is_highlight: true, is_emergency: false },
          { step: 3, title: 'Nộp phí Cận lâm sàng', location: 'Quầy Thu ngân Ngoại trú', time_estimate: '3 – 5 phút', desc: 'Người bệnh mang phiếu chỉ định đến quầy thu ngân để thanh toán phí cận lâm sàng trước khi thực hiện.', actions: '• Thu ngân in phiếu thu tiền theo bảng giá dịch vụ niêm yết.\n• Hỗ trợ thanh toán nhanh bằng tiền mặt hoặc quét mã QR qua các ứng dụng ngân hàng.', note: '', is_highlight: false, is_emergency: false },
          { step: 4, title: 'Thực hiện Xét nghiệm & Chẩn đoán hình ảnh', location: 'Khu Kỹ thuật Cận lâm sàng', time_estimate: '20 – 40 phút', desc: 'Được ưu tiên điều hướng thực hiện cận lâm sàng nhanh chóng, giảm thiểu tối đa thời gian chờ đợi.', actions: '• Lấy máu, nước tiểu, đo điện tim, siêu âm màu, chụp X-quang kỹ thuật số.\n• Nhân viên y tế hướng dẫn chi tiết thứ tự phòng chụp và thời gian trả kết quả.', note: '', is_highlight: false, is_emergency: false },
          { step: 5, title: 'Kết luận điều trị & Kê đơn thuốc', location: 'Phòng khám chuyên khoa ban đầu', time_estimate: '10 phút', desc: 'Bác sĩ phân tích kết quả cận lâm sàng, đưa ra chẩn đoán xác định và kê đơn thuốc điều trị.', actions: '• Tư vấn chế độ dinh dưỡng, sinh hoạt, tập luyện phục hồi.\n• Kê đơn thuốc ngoại trú hoặc chỉ định nhập viện theo yêu cầu nếu cần.', note: '', is_highlight: false, is_emergency: false },
          { step: 6, title: 'Mua thuốc tại Nhà thuốc Bệnh viện & Ra về', location: 'Nhà thuốc GPP Bệnh viện Đa khoa Khu vực Thới Lai', time_estimate: '5 – 10 phút', desc: 'Người bệnh mua thuốc theo đơn tại nhà thuốc đạt chuẩn GPP của bệnh viện, đảm bảo thuốc chính hãng, nguồn gốc rõ ràng và giá đúng quy định.', actions: '• Dược sĩ đối chiếu đơn thuốc, kiểm tra hạn sử dụng và đóng gói thuốc cẩn thận.\n• Hướng dẫn chi tiết cách bảo quản và cách dùng thuốc hiệu quả.', note: '', is_highlight: false, is_emergency: false }
        ]
      },
      {
        order: 3, id: 'cap-cuu', label: 'Cấp cứu 24/24', badge_text: 'TIẾP NHẬN LIÊN TỤC 24/7/365',
        title: 'Quy trình Tiếp nhận & Xử trí Cấp cứu 24/24',
        summary: 'Khoa Cấp cứu tiếp nhận người bệnh trong mọi tình trạng khẩn cấp vào bất kỳ thời điểm nào trong ngày. ƯU TIÊN HÀNG ĐẦU LÀ CỨU CHỮA TÍNH MẠNG NGƯỜI BỆNH, các thủ tục hành chính được hoàn tất sau.',
        steps: [
          { step: 1, title: 'Tiếp nhận khẩn cấp & Phân loại bệnh nhân (Triage)', location: 'Sảnh Khoa Cấp cứu – Cổng Cấp cứu 24/24', time_estimate: 'NGAY TẬP TỨC (< 1 phút)', desc: 'Người bệnh được kíp trực cấp cứu tiếp nhận ngay khi đến viện bằng xe cứu thương hoặc phương tiện cá nhân.', actions: '• Điều dưỡng và Bác sĩ đo sinh hiệu, đánh giá mức độ nguy kịch (Đỏ: Nguy kịch đe dọa tính mạng; Vàng: Nặng cần cấp cứu khẩn; Xanh: Ổn định).\n• Đưa ngay người bệnh nguy kịch vào Phòng Hồi sức Cấp cứu chống sốc.', note: '', is_highlight: true, is_emergency: true },
          { step: 2, title: 'Hồi sức, Khám & Xử trí Cấp cứu ban đầu', location: 'Phòng Hồi sức – Cấp cứu', time_estimate: 'Xử trí khẩn trương', desc: 'Kíp cấp cứu tiến hành ngay các biện pháp can thiệp y tế để bảo vệ đường thở, tuần hoàn và ổn định sinh hiệu.', actions: '• Thở oxy, đặt nội khí quản, ép tim ngoài lồng ngực (nếu ngừng thở/ngừng tim).\n• Thiết lập đường truyền tĩnh mạch, dùng thuốc cấp cứu khẩn cấp.\n• Băng bó, cầm máu, cố định nẹp nếu có chấn thương, gãy xương.', note: '', is_highlight: false, is_emergency: true },
          { step: 3, title: 'Làm thủ tục hành chính (Người nhà bệnh nhân thực hiện)', location: 'Bàn tiếp đón Khoa Cấp cứu', time_estimate: 'Thực hiện song song', desc: 'Trong lúc bác sĩ đang cấp cứu người bệnh, người nhà đi cùng sẽ cung cấp thông tin và nộp giấy tờ BHYT/CCCD.', actions: '• Nộp thẻ BHYT, CCCD hoặc ứng dụng định danh điện tử.\n• Khai báo tiền sử bệnh tật, dị ứng thuốc, nguyên nhân tai nạn/ngộ độc cho nhân viên y tế ghi nhận.', note: '', is_highlight: false, is_emergency: false },
          { step: 4, title: 'Thực hiện Cận lâm sàng Cấp cứu tại giường hoặc tại khoa', location: 'Tại Khoa Cấp cứu / Khoa Chẩn đoán hình ảnh', time_estimate: 'Ưu tiên khẩn cấp', desc: 'Kỹ thuật viên xét nghiệm và chẩn đoán hình ảnh phục vụ ngay tại khoa hoặc ưu tiên máy chụp chiếu cao nhất.', actions: '• Xét nghiệm máu khẩn (khí máu, đông máu, men tim, đường huyết cấp...).\n• Chụp X-quang cấp cứu tại giường hoặc tại phòng chụp.\n• Siêu âm cấp cứu FAST phát hiện tràn dịch, tràn máu màng tim/màng bụng.', note: '', is_highlight: false, is_emergency: false },
          { step: 5, title: 'Phân luồng điều trị chuyên sâu', location: 'Khoa Cấp cứu', time_estimate: 'Sau khi ổn định bước đầu', desc: 'Tùy theo kết quả cấp cứu và chẩn đoán bệnh, Bác sĩ trưởng kíp trực quyết định hướng điều trị tiếp theo:', actions: '• Chuyển Khoa Hồi sức tích cực – Chống độc (ICU) nếu người bệnh cần thở máy, lọc máu, theo dõi liên tục.\n• Chuyển phòng mổ cấp cứu (Phẫu thuật Ngoại khoa, Sản khoa khẩn cấp).\n• Chuyển các khoa lâm sàng chuyên khoa (Nội, Ngoại, Nhi, Phụ sản) để điều trị nội trú.\n• Chuyển tuyến trên an toàn (bằng xe cứu thương chuyên dụng có y bác sĩ đi kèm) nếu vượt quá khả năng chuyên môn kỹ thuật.\n• Cho về điều trị ngoại trú nếu tình trạng hoàn toàn ổn định và được theo dõi an toàn.', note: '', is_highlight: false, is_emergency: false }
        ]
      }
    ];

    for (const t of tabsData) {
      await client.query(`
        INSERT INTO examination_flow_settings_flow_tabs (_order, _parent_id, id, enabled, label, badge_text, title, summary)
        VALUES ($1, $2, $3, true, $4, $5, $6, $7)
      `, [t.order, efsId, t.id, t.label, t.badge_text, t.title, t.summary]);

      for (let j = 0; j < t.steps.length; j++) {
        const s = t.steps[j];
        await client.query(`
          INSERT INTO examination_flow_settings_flow_tabs_steps (
            _order, _parent_id, id, enabled, step, title, location, time_estimate, "desc", actions, note, is_highlight, is_emergency
          ) VALUES ($1, $2, $3, true, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `, [j + 1, t.id, `${t.id}-step-${j + 1}`, s.step, s.title, s.location, s.time_estimate, s.desc, s.actions, s.note, s.is_highlight, s.is_emergency]);
      }
    }
  }

  // Checklists
  const chkCount = await client.query('SELECT count(*) FROM examination_flow_settings_checklists WHERE _parent_id = $1', [efsId]);
  if (parseInt(chkCount.rows[0].count) === 0) {
    const chks = [
      { order: 1, id: 'chk-1', title: 'Căn cước công dân (CCCD) gắn chip', desc: 'Bản gốc CCCD gắn chip của người bệnh hoặc tài khoản định danh điện tử VNeID mức độ 2 đã tích hợp thẻ BHYT.', icon: 'id' },
      { order: 2, id: 'chk-2', title: 'Thẻ Bảo hiểm Y tế (BHYT)', desc: 'Thẻ BHYT giấy còn hạn sử dụng hoặc ứng dụng VssID / VNeID hiển thị mã số và hình ảnh thẻ hợp lệ.', icon: 'card' },
      { order: 3, id: 'chk-3', title: 'Giấy hẹn tái khám / Chuyển tuyến', desc: 'Giấy hẹn khám lại của bệnh viện (nếu có) hoặc Giấy chuyển viện hợp lệ từ cơ sở y tế tuyến trước.', icon: 'file' },
      { order: 4, id: 'chk-4', title: 'Đơn thuốc & Hồ sơ bệnh cũ', desc: 'Các toa thuốc đang uống, sổ khám bệnh, phim chụp X-Quang, CT, MRI và các kết quả xét nghiệm gần nhất để bác sĩ đối chiếu.', icon: 'medical' }
    ];
    for (const c of chks) {
      await client.query(`
        INSERT INTO examination_flow_settings_checklists (_order, _parent_id, id, enabled, title, "desc", icon)
        VALUES ($1, $2, $3, true, $4, $5, $6)
      `, [c.order, efsId, c.id, c.title, c.desc, c.icon]);
    }
  }

  // Priorities
  const priCount = await client.query('SELECT count(*) FROM examination_flow_settings_priorities WHERE _parent_id = $1', [efsId]);
  if (parseInt(priCount.rows[0].count) === 0) {
    const pris = [
      'Người bệnh trong tình trạng Cấp cứu khẩn cấp (Ưu tiên số 1)',
      'Trẻ em dưới 6 tuổi',
      'Người cao tuổi từ 75 tuổi trở lên',
      'Người khuyết tật nặng, suy kiệt',
      'Phụ nữ mang thai gần ngày sinh',
      'Người có công với cách mạng, Mẹ Việt Nam Anh hùng'
    ];
    for (let i = 0; i < pris.length; i++) {
      await client.query(`
        INSERT INTO examination_flow_settings_priorities (_order, _parent_id, id, enabled, text)
        VALUES ($1, $2, $3, true, $4)
      `, [i + 1, efsId, 'prio-' + (i + 1), pris[i]]);
    }
    console.log('Seeded ExaminationFlowSettings!');
  }

  // ==========================================
  // 3. HOSPITAL QUALITY SETTINGS (/chat-luong-benh-vien)
  // ==========================================
  let hqsId;
  const hqsExist = await client.query('SELECT id FROM hospital_quality_settings LIMIT 1');
  if (hqsExist.rows.length === 0) {
    const res = await client.query(`
      INSERT INTO hospital_quality_settings (
        eyebrow, title, description, show_notice_banner, notice_title, notice_content, notice_align
      ) VALUES (
        'QUẢN LÝ CHẤT LƯỢNG & AN TOÀN NGƯỜI BỆNH',
        'Chất lượng Bệnh viện',
        'Bộ chỉ số đo lường 83 tiêu chí chất lượng, kết quả khảo sát sự hài lòng và các chương trình cải tiến liên tục tại Bệnh viện Đa khoa Khu vực Thới Lai.',
        false,
        'Cam kết chất lượng phục vụ của Bệnh viện Đa khoa Khu vực Thới Lai',
        '• Lấy người bệnh làm trung tâm phục vụ, đảm bảo an toàn và quyền lợi người bệnh.\n• Đánh giá chất lượng định kỳ theo Bộ 83 Tiêu chí của Bộ Y tế.\n• Mọi ý kiến đóng góp được Ban Giám đốc tiếp nhận và cải tiến liên tục.',
        'left'
      ) RETURNING id
    `);
    hqsId = res.rows[0].id;
  } else {
    hqsId = hqsExist.rows[0].id;
  }

  // Stat Cards
  const statCount = await client.query('SELECT count(*) FROM hospital_quality_settings_stat_cards WHERE _parent_id = $1', [hqsId]);
  if (parseInt(statCount.rows[0].count) === 0) {
    const stats = [
      { order: 1, id: 'st-1', value: '4.22', subtext: '/ 5.0', label: 'Điểm chất lượng bệnh viện' },
      { order: 2, id: 'st-2', value: '94.8', subtext: '%', label: 'Tỷ lệ hài lòng chung' },
      { order: 3, id: 'st-3', value: '83', subtext: 'tiêu chí', label: 'Bộ tiêu chí chất lượng Bộ Y tế' },
      { order: 4, id: 'st-4', value: '100', subtext: '%', label: 'Bảo đảm an toàn người bệnh' }
    ];
    for (const s of stats) {
      await client.query(`
        INSERT INTO hospital_quality_settings_stat_cards (_order, _parent_id, id, enabled, value, label, subtext)
        VALUES ($1, $2, $3, true, $4, $5, $6)
      `, [s.order, hqsId, s.id, s.value, s.label, s.subtext]);
    }
  }

  // Dimensions
  const dimCount = await client.query('SELECT count(*) FROM hospital_quality_settings_dimensions WHERE _parent_id = $1', [hqsId]);
  if (parseInt(dimCount.rows[0].count) === 0) {
    const dims = [
      { order: 1, id: 'dim-1', name: 'PHẦN A - Hướng đến người bệnh', score: '4.25', max_score: '/5.0', desc: 'Quy trình tiếp đón niềm nở, chỉ dẫn rõ ràng, giảm thiểu tối đa thời gian chờ đợi và bảo đảm quyền riêng tư, an toàn người bệnh.' },
      { order: 2, id: 'dim-2', name: 'PHẦN B - Phát triển nguồn nhân lực', score: '4.18', max_score: '/5.0', desc: 'Đào tạo liên tục chuyên môn y khoa, bồi dưỡng kỹ năng giao tiếp y đức, cải thiện điều kiện làm việc cho đội ngũ nhân viên y tế.' },
      { order: 3, id: 'dim-3', name: 'PHẦN C - Hoạt động chuyên môn', score: '4.35', max_score: '/5.0', desc: 'Áp dụng phác đồ điều trị chuẩn của Bộ Y tế, kiểm soát nhiễm khuẩn nghiêm ngặt, hội chẩn liên viện và cấp cứu can thiệp kịp thời.' },
      { order: 4, id: 'dim-4', name: 'PHẦN D - Cải tiến chất lượng', score: '4.12', max_score: '/5.0', desc: 'Thiết lập hệ thống báo cáo sự cố y khoa tự nguyện, phân tích nguyên nhân gốc rễ và triển khai các đề án cải tiến chất lượng định kỳ.' },
      { order: 5, id: 'dim-5', name: 'PHẦN E - Tiêu chí đặc thù chuyên khoa', score: '4.20', max_score: '/5.0', desc: 'Đầu tư trang thiết bị cận lâm sàng hiện đại (CT scanner, Nội soi tiêu hóa, Siêu âm màu), phòng mổ vô khuẩn và cấp cứu lưu động.' }
    ];
    for (const d of dims) {
      await client.query(`
        INSERT INTO hospital_quality_settings_dimensions (_order, _parent_id, id, enabled, name, score, max_score, "desc")
        VALUES ($1, $2, $3, true, $4, $5, $6, $7)
      `, [d.order, hqsId, d.id, d.name, d.score, d.max_score, d.desc]);
    }
  }

  // Programs
  const progCount = await client.query('SELECT count(*) FROM hospital_quality_settings_programs WHERE _parent_id = $1', [hqsId]);
  if (parseInt(progCount.rows[0].count) === 0) {
    const progs = [
      { order: 1, id: 'prog-1', icon_type: 'blue', title: 'Ứng dụng Chuyển đổi số Y tế', desc: 'Triển khai bệnh án điện tử (EMR), hệ thống đặt lịch khám trực tuyến Medpro và thanh toán viện phí không dùng tiền mặt (QR Code tĩnh/động).' },
      { order: 2, id: 'prog-2', icon_type: 'green', title: 'An toàn người bệnh & Kiểm soát nhiễm khuẩn', desc: 'Chuẩn hóa quy trình nhận diện người bệnh bằng vòng đeo tay, kiểm soát kê đơn an toàn và tuân thủ vệ sinh tay ngoại khoa 5 thời điểm.' },
      { order: 3, id: 'prog-3', icon_type: 'amber', title: 'Nâng cao Văn hóa giao tiếp & Ứng xử', desc: 'Xây dựng môi trường bệnh viện xanh - sạch - đẹp, phong cách phục vụ văn minh, tận tình hướng dẫn với phương châm "Lương y như từ mẫu".' }
    ];
    for (const p of progs) {
      await client.query(`
        INSERT INTO hospital_quality_settings_programs (_order, _parent_id, id, enabled, title, "desc", icon_type)
        VALUES ($1, $2, $3, true, $4, $5, $6)
      `, [p.order, hqsId, p.id, p.title, p.desc, p.icon_type]);
    }
    console.log('Seeded HospitalQualitySettings!');
  }

  // ==========================================
  // 4. FEEDBACK PAGE SETTINGS (/gop-y)
  // ==========================================
  let fbId;
  const fbExist = await client.query('SELECT id FROM feedback_page_settings LIMIT 1');
  if (fbExist.rows.length === 0) {
    const res = await client.query(`
      INSERT INTO feedback_page_settings (
        eyebrow, title, description, show_notice_banner, notice_title, notice_content, notice_align
      ) VALUES (
        'CHĂM SÓC NGƯỜI BỆNH & TIẾP NHẬN Ý KIẾN',
        'Góp ý – Phản ánh Chất lượng',
        'Bệnh viện Đa khoa Khu vực Thới Lai luôn trân trọng và lắng nghe mọi ý kiến phản ánh, góp ý hoặc khen ngợi của Quý bệnh nhân và thân nhân.',
        false,
        'Quy trình tiếp nhận & Bảo mật thông tin phản ánh',
        '• Mọi thông tin phản ánh được chuyển trực tiếp tới Ban Giám đốc và Tổ Chăm sóc khách hàng.\n• Cam kết bảo mật 100% thông tin cá nhân của người gửi.\n• Thời gian phản hồi trong vòng 24 - 48 giờ làm việc.',
        'left'
      ) RETURNING id
    `);
    fbId = res.rows[0].id;
  } else {
    fbId = fbExist.rows[0].id;
  }

  const fbBoxCount = await client.query('SELECT count(*) FROM feedback_page_settings_info_boxes WHERE _parent_id = $1', [fbId]);
  if (parseInt(fbBoxCount.rows[0].count) === 0) {
    const boxes = [
      { order: 1, id: 'fbb-1', icon: '📞', title: 'Đường dây nóng BV', desc: '0292 3861 234 (Giờ hành chính)', badge: 'Trực 24/7' },
      { order: 2, id: 'fbb-2', icon: '🚑', title: 'Cấp cứu 24/24', desc: '0292 3861 115 (Tiếp nhận khẩn cấp)', badge: 'Khẩn cấp' },
      { order: 3, id: 'fbb-3', icon: '✉️', title: 'Hòm thư điện tử', desc: 'bvdkkvthoilai@cantho.gov.vn', badge: 'Email chính thức' }
    ];
    for (const b of boxes) {
      await client.query(`
        INSERT INTO feedback_page_settings_info_boxes (_order, _parent_id, id, enabled, icon, title, "desc", badge)
        VALUES ($1, $2, $3, true, $4, $5, $6, $7)
      `, [b.order, fbId, b.id, b.icon, b.title, b.desc, b.badge]);
    }
    console.log('Seeded FeedbackPageSettings!');
  }

  // ==========================================
  // 5. SURVEY PAGE SETTINGS (/khao-sat)
  // ==========================================
  let spsId;
  const spsExist = await client.query('SELECT id FROM survey_page_settings LIMIT 1');
  if (spsExist.rows.length === 0) {
    const res = await client.query(`
      INSERT INTO survey_page_settings (
        eyebrow, title, description, show_notice_banner, notice_title, notice_content, notice_align
      ) VALUES (
        'CHĂM SÓC NGƯỜI BỆNH & LẮNG NGHE Ý KIẾN',
        'Khảo sát Ý kiến Người bệnh & Nhân viên',
        'Đánh giá sự hài lòng của người bệnh nội trú, ngoại trú và nhân viên y tế theo chuẩn Bộ tiêu chí chất lượng của Bộ Y tế.',
        false,
        'Khảo sát 100% Ẩn danh & Bảo mật',
        '• Ý kiến đánh giá của bạn là cơ sở quan trọng giúp bệnh viện nâng cao chất lượng khám chữa bệnh.\n• Khảo sát hoàn toàn ẩn danh, không lưu danh tính người trả lời.',
        'left'
      ) RETURNING id
    `);
    spsId = res.rows[0].id;
  } else {
    spsId = spsExist.rows[0].id;
  }

  const spsBoxCount = await client.query('SELECT count(*) FROM survey_page_settings_info_boxes WHERE _parent_id = $1', [spsId]);
  if (parseInt(spsBoxCount.rows[0].count) === 0) {
    const boxes = [
      { order: 1, id: 'spsb-1', icon: '🏥', title: 'Khảo sát Người bệnh Ngoại trú', desc: 'Dành cho người bệnh đến khám và nhận thuốc trong ngày.', badge: 'Mẫu số 01 - BYT' },
      { order: 2, id: 'spsb-2', icon: '🛏️', title: 'Khảo sát Người bệnh Nội trú', desc: 'Dành cho người bệnh và thân nhân điều trị nằm viện.', badge: 'Mẫu số 02 - BYT' },
      { order: 3, id: 'spsb-3', icon: '🩺', title: 'Khảo sát Nhân viên Y tế', desc: 'Đánh giá môi trường làm việc và điều kiện thực thi chuyên môn.', badge: 'Nội bộ viện' }
    ];
    for (const b of boxes) {
      await client.query(`
        INSERT INTO survey_page_settings_info_boxes (_order, _parent_id, id, enabled, icon, title, "desc", badge)
        VALUES ($1, $2, $3, true, $4, $5, $6, $7)
      `, [b.order, spsId, b.id, b.icon, b.title, b.desc, b.badge]);
    }
    console.log('Seeded SurveyPageSettings!');
  }

  // ==========================================
  // 6. FORMS PAGE SETTINGS (/bieu-mau)
  // ==========================================
  let formsId;
  const formsExist = await client.query('SELECT id FROM forms_page_settings LIMIT 1');
  if (formsExist.rows.length === 0) {
    const res = await client.query(`
      INSERT INTO forms_page_settings (
        eyebrow, title, description, show_notice_banner, notice_title, notice_content, notice_align
      ) VALUES (
        'CHĂM SÓC NGƯỜI BỆNH & THỦ TỤC ĐIỆN TỬ',
        'Biểu mẫu Điện tử & Đăng ký',
        'Tải về các biểu mẫu giấy tờ y tế, đơn đăng ký và quy trình thực hiện thủ tục hành chính tại Bệnh viện Đa khoa Khu vực Thới Lai.',
        false,
        'Hướng dẫn nộp hồ sơ & Nhận kết quả',
        '• Người bệnh tải biểu mẫu, điền thông tin và nộp tại Bộ phận Tiếp nhận & Trả kết quả (Sảnh chính tầng trệt).\n• Xuất trình bản gốc CCCD và thẻ BHYT để đối chiếu.',
        'left'
      ) RETURNING id
    `);
    formsId = res.rows[0].id;
  } else {
    formsId = formsExist.rows[0].id;
  }

  const formsBoxCount = await client.query('SELECT count(*) FROM forms_page_settings_info_boxes WHERE _parent_id = $1', [formsId]);
  if (parseInt(formsBoxCount.rows[0].count) === 0) {
    const boxes = [
      { order: 1, id: 'fmb-1', icon: '📄', title: 'Giấy ra viện & Trích sao hồ sơ', desc: 'Thủ tục cấp lại giấy ra viện, bản sao bệnh án cho bảo hiểm hoặc cơ quan chức năng.', badge: '3 ngày làm việc' },
      { order: 2, id: 'fmb-2', icon: '📝', title: 'Giấy chứng nhận thương tích', desc: 'Đơn đề nghị cấp giấy chứng thương theo quy định của pháp luật.', badge: 'Đúng quy chuẩn' },
      { order: 3, id: 'fmb-3', icon: '💳', title: 'Đơn đề nghị miễn giảm viện phí', desc: 'Dành cho bệnh nhân có hoàn cảnh khó khăn, hộ nghèo hoặc gia đình chính sách.', badge: 'Xét duyệt nhanh' }
    ];
    for (const b of boxes) {
      await client.query(`
        INSERT INTO forms_page_settings_info_boxes (_order, _parent_id, id, enabled, icon, title, "desc", badge)
        VALUES ($1, $2, $3, true, $4, $5, $6, $7)
      `, [b.order, formsId, b.id, b.icon, b.title, b.desc, b.badge]);
    }
    console.log('Seeded FormsPageSettings!');
  }

  // ==========================================
  // 7. FAQ PAGE SETTINGS (/hoi-dap)
  // ==========================================
  const faqExist = await client.query('SELECT id FROM faq_page_settings LIMIT 1');
  if (faqExist.rows.length === 0) {
    await client.query(`
      INSERT INTO faq_page_settings (
        eyebrow, title, description, show_notice_banner, notice_title, notice_content, notice_align
      ) VALUES (
        'CHĂM SÓC NGƯỜI BỆNH & GIẢI ĐÁP',
        'Hỏi đáp Y tế & Câu hỏi thường gặp',
        'Tổng hợp giải đáp các câu hỏi thường gặp về khám chữa bệnh BHYT, thủ tục nhập viện, tiêm chủng và chi phí điều trị tại Bệnh viện Đa khoa Khu vực Thới Lai.',
        false,
        'Gửi câu hỏi trực tuyến',
        'Nếu không tìm thấy câu trả lời, Quý vị có thể gửi câu hỏi trực tiếp qua kênh Hỏi đáp để được các Bác sĩ chuyên khoa giải đáp.',
        'left'
      )
    `);
    console.log('Seeded FAQPageSettings!');
  }

  await client.end();
  console.log('All remaining tabs successfully seeded!');
}

seedRemainingTabs().catch(console.error);
