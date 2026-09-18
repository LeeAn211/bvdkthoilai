import fs from 'fs';
import { Client } from 'pg';

const env = fs.readFileSync('.env', 'utf8');
let conn = '';
for (const line of env.split('\n')) {
  if (line.startsWith('DATABASE_URL=')) conn = line.replace('DATABASE_URL=', '').trim();
}
const client = new Client({ connectionString: conn });

async function seedAll() {
  await client.connect();

  // 1. Check checkup_packages_settings
  const chkExisting = await client.query('SELECT id FROM checkup_packages_settings LIMIT 1');
  let chkId;
  if (chkExisting.rows.length === 0) {
    const res = await client.query(`
      INSERT INTO checkup_packages_settings (eyebrow, title, description, show_notice_banner, notice_title, notice_content, notice_align)
      VALUES (
        'CHỦ ĐỘNG BẢO VỆ SỨC KHỎE',
        'Gói Khám Sức khỏe & Tầm soát Bệnh lý',
        'Các gói khám sức khỏe tổng quát, tầm soát bệnh lý mạn tính và khám cấp giấy chứng nhận sức khỏe với chi phí minh bạch, chuẩn y tế tại Bệnh viện Đa khoa Khu vực Thới Lai.',
        true,
        'Ưu đãi & Hướng dẫn đăng ký gói khám',
        '• Đăng ký hẹn trước qua Hotline hoặc Cổng dịch vụ trực tuyến để được giảm 5% và ưu tiên phục vụ không phải chờ đợi.\n• Người bệnh vui lòng nhịn ăn sáng tối thiểu 6-8 tiếng đối với các gói có chỉ định xét nghiệm đường máu và mỡ máu.',
        'left'
      ) RETURNING id
    `);
    chkId = res.rows[0].id;
  } else {
    chkId = chkExisting.rows[0].id;
  }

  const pkgCount = await client.query('SELECT count(*) FROM checkup_packages_settings_packages WHERE _parent_id = $1', [chkId]);
  if (parseInt(pkgCount.rows[0].count) === 0) {
    const pkgs = [
      {
        order: 1, id: 'pkg-1', is_popular: true, badge: 'Phổ biến nhất',
        title: 'Gói Khám Sức khỏe Tổng quát Định kỳ', target_user: 'Người lớn từ 18 tuổi trở lên, người lao động, cán bộ hưu trí',
        price_text: '850.000 đ',
        desc: 'Kiểm tra toàn diện các chỉ số sinh hiệu, chức năng gan, thận, mỡ máu, đường huyết và phát hiện sớm các bệnh lý chuyển hóa.',
        features: '• Khám lâm sàng toàn diện: Nội, Ngoại, Mắt, Tai Mũi Họng, Răng Hàm Mặt\n• Xét nghiệm máu: Công thức máu 18 thông số, Đường huyết đói (Glucose)\n• Đánh giá chức năng gan (AST/GOT, ALT/GPT) & Chức năng thận (Ure, Creatinin)\n• Xét nghiệm mỡ máu toàn phần (Cholesterol, Triglycerid)\n• Tổng phân tích nước tiểu 10 thông số\n• Chụp X-Quang ngực thẳng kỹ thuật số\n• Siêu âm màu ổ bụng tổng quát & Đo điện tâm đồ (ECG)\n• Bác sĩ chuyên khoa kết luận và tư vấn chế độ ăn uống, sinh hoạt'
      },
      {
        order: 2, id: 'pkg-2', is_popular: false, badge: 'Chuyên sâu',
        title: 'Gói Tầm soát Bệnh lý Tim mạch & Huyết áp', target_user: 'Người trên 40 tuổi, người có tiền sử tăng huyết áp, đái tháo đường hoặc gia đình có bệnh tim',
        price_text: '1.250.000 đ',
        desc: 'Đánh giá nguy cơ xơ vữa động mạch, suy tim, bệnh mạch vành và các biến chứng tim mạch sớm.',
        features: '• Khám chuyên khoa Tim mạch cùng Bác sĩ Chuyên khoa I / II\n• Đo điện tâm đồ 12 chuyển đạo (ECG)\n• Siêu âm tim Doppler màu khảo sát cấu trúc van tim và co bóp cơ tim\n• Xét nghiệm bộ lipid máu nâng cao (HDL-C, LDL-C, Triglycerid, Cholesterol)\n• Xét nghiệm đường huyết & HbA1c (đánh giá đường huyết trung bình 3 tháng)\n• Đo chức năng thận & Axit Uric máu\n• Chụp X-Quang tim phổi thẳng\n• Tư vấn phác đồ phòng ngừa nhồi máu cơ tim & đột quỵ'
      },
      {
        order: 3, id: 'pkg-3', is_popular: false, badge: 'Đúng quy chuẩn',
        title: 'Gói Khám Cấp Giấy phép Lái xe (Hạng A1, B1, B2, C...)', target_user: 'Người học lái xe mới hoặc gia hạn, đổi bằng lái xe các hạng',
        price_text: '360.000 đ',
        desc: 'Khám và cấp Giấy chứng nhận sức khỏe lái xe theo đúng Thông tư liên tịch của Bộ Y tế và Bộ Giao thông Vận tải.',
        features: '• Khám thể lực: Chiều cao, cân nặng, vòng ngực, huyết áp, mạch\n• Khám Mắt: Thị lực, sắc giác (khả năng nhận biết màu sắc tín hiệu giao thông)\n• Khám Tai - Mũi - Họng, Răng - Hàm - Mặt, Cơ - Xương - Khớp\n• Khám Tâm thần & Thần kinh chuyên sâu\n• Xét nghiệm 4 loại chất gây nghiện (Morphin/Heroin, Amphetamin, Methamphetamin, Cần sa)\n• Xét nghiệm nồng độ cồn trong máu hoặc hơi thở\n• Trả kết quả nhanh chóng trong ngày, liên thông dữ liệu Cổng dịch vụ công quốc gia'
      }
    ];

    for (const p of pkgs) {
      await client.query(`
        INSERT INTO checkup_packages_settings_packages (
          _order, _parent_id, id, enabled, is_popular, badge, title, name, target_user, target, price_text, price, "desc", features
        ) VALUES (
          $1, $2, $3, true, $4, $5, $6, $6, $7, $7, $8, $8, $9, $10
        )
      `, [p.order, chkId, p.id, p.is_popular, p.badge, p.title, p.target_user, p.price_text, p.desc, p.features]);
    }
    console.log('Seeded checkup packages!');
  }

  // 2. Check inpatient_guide_settings
  const ipExisting = await client.query('SELECT id FROM inpatient_guide_settings LIMIT 1');
  let ipId;
  if (ipExisting.rows.length === 0) {
    const res = await client.query(`
      INSERT INTO inpatient_guide_settings (eyebrow, title, description, show_notice_banner, notice_title, notice_content, notice_align)
      VALUES (
        'CHĂM SÓC TOÀN DIỆN & TẬN TÂM',
        'Hướng dẫn Điều trị Nội trú',
        'Thông tin chi tiết về thủ tục nhập viện, đồ dùng cần chuẩn bị, quy định buồng bệnh, giờ thăm bệnh và chế độ dinh dưỡng tại Bệnh viện Đa khoa Khu vực Thới Lai.',
        true,
        'Lưu ý quan trọng dành cho thân nhân người bệnh',
        '• Mỗi người bệnh chỉ được tối đa 01 người nhà nuôi bệnh ở lại qua đêm để đảm bảo an ninh trật tự và chống nhiễm khuẩn bệnh viện.\n• Không mang các thiết bị đun nấu bằng điện hoặc chất dễ cháy nổ vào khu vực buồng bệnh.',
        'left'
      ) RETURNING id
    `);
    ipId = res.rows[0].id;
  } else {
    ipId = ipExisting.rows[0].id;
  }

  const stepCount = await client.query('SELECT count(*) FROM inpatient_guide_settings_admission_steps WHERE _parent_id = $1', [ipId]);
  if (parseInt(stepCount.rows[0].count) === 0) {
    const steps = [
      { step: 1, title: 'Tiếp nhận chỉ định Nhập viện', location: 'Phòng khám ban đầu hoặc Khoa Cấp cứu', desc: 'Khi có kết luận điều trị nội trú từ Bác sĩ khám, người bệnh nhận Giấy vào viện và được nhân viên y tế hướng dẫn hoàn thiện thủ tục.', note: 'Người bệnh hoặc người nhà kiểm tra kỹ thông tin hành chính trên Giấy vào viện.' },
      { step: 2, title: 'Nộp hồ sơ & Tạm ứng Viện phí', location: 'Quầy Thu viện phí Nội trú (Khu tiếp đón)', desc: 'Người nhà xuất trình Thẻ BHYT, CCCD gắn chip (hoặc ứng dụng VNeID/VssID) và nộp khoản tạm ứng viện phí theo quy định của bệnh viện.', note: 'Bệnh viện chấp nhận thanh toán quét mã QR qua ứng dụng ngân hàng hoặc tiền mặt.' },
      { step: 3, title: 'Nhận buồng bệnh & Tiếp đón ban đầu', location: 'Khoa Lâm sàng tương ứng (Nội, Ngoại, Sản, Nhi...)', desc: 'Điều dưỡng khoa tiếp đón, hướng dẫn người bệnh nhận giường bệnh, cấp phát trang phục bệnh nhân, vòng đeo tay nhận diện và dặn dò nội quy khoa.', note: 'Người bệnh phải đeo vòng nhận diện trong suốt thời gian điều trị để đảm bảo an toàn y tế.' },
      { step: 4, title: 'Bác sĩ điều trị thăm khám & Lên phác đồ', location: 'Tại giường bệnh', desc: 'Bác sĩ điều trị thăm khám lâm sàng toàn diện, giải thích tình trạng bệnh tật, phác đồ điều trị dự kiến và chế độ dinh dưỡng phù hợp.', note: 'Mọi thắc mắc của người bệnh hoặc thân nhân sẽ được Bác sĩ và Điều dưỡng trưởng giải đáp tận tình.' }
    ];
    for (let i = 0; i < steps.length; i++) {
      const s = steps[i];
      await client.query(`
        INSERT INTO inpatient_guide_settings_admission_steps (_order, _parent_id, id, enabled, step, title, location, "desc", note)
        VALUES ($1, $2, $3, true, $4, $5, $6, $7, $8)
      `, [i + 1, ipId, 'step-' + (i + 1), s.step, s.title, s.location, s.desc, s.note]);
    }

    const hours = [
      { session: 'Buổi sáng', time_range: '06:00 – 07:00', note: 'Trước giờ bác sĩ đi buồng thăm khám' },
      { session: 'Buổi trưa', time_range: '11:30 – 13:00', note: 'Giờ nghỉ ngơi và ăn trưa của người bệnh' },
      { session: 'Buổi chiều tối', time_range: '17:00 – 21:00', note: 'Sau giờ làm việc hành chính của khoa' }
    ];
    for (let i = 0; i < hours.length; i++) {
      const h = hours[i];
      await client.query(`
        INSERT INTO inpatient_guide_settings_visiting_hours (_order, _parent_id, id, enabled, session, time_range, note)
        VALUES ($1, $2, $3, true, $4, $5, $6)
      `, [i + 1, ipId, 'hour-' + (i + 1), h.session, h.time_range, h.note]);
    }

    const checklist = [
      { icon: '🪪', category: 'Người bệnh chuẩn bị mang theo', title: 'Giấy tờ tùy thân & Thẻ BHYT', desc: 'Bản gốc CCCD gắn chip hoặc ứng dụng VNeID mức 2 tích hợp thẻ BHYT, giấy chuyển tuyến hoặc giấy hẹn tái khám (nếu có).' },
      { icon: '📋', category: 'Người bệnh chuẩn bị mang theo', title: 'Hồ sơ bệnh án cũ & Đơn thuốc đang dùng', desc: 'Sổ khám bệnh, kết quả xét nghiệm, phim X-quang/CT và toàn bộ các loại thuốc điều trị bệnh mạn tính đang sử dụng tại nhà.' },
      { icon: '🧴', category: 'Người bệnh chuẩn bị mang theo', title: 'Vật dụng sinh hoạt cá nhân', desc: 'Khăn mặt, bàn chải đánh răng, cốc uống nước và dép đi trong phòng (bệnh viện cung cấp trang phục bệnh nhân và chăn ga gối).' },
      { icon: '❌', category: 'Những đồ vật KHÔNG được mang vào', title: 'Thiết bị đun nấu & Đồ dùng dễ cháy nổ', desc: 'Bếp điện, ấm siêu tốc, bếp từ, nồi cơm điện và các thiết bị phát nhiệt công suất cao.' },
      { icon: '❌', category: 'Những đồ vật KHÔNG được mang vào', title: 'Tài sản có giá trị lớn & Tiền mặt nhiều', desc: 'Hạn chế mang theo trang sức vàng bạc, đá quý và lượng lớn tiền mặt. Bệnh viện không chịu trách nhiệm bảo quản tài sản cá nhân trong buồng bệnh.' }
    ];
    for (let i = 0; i < checklist.length; i++) {
      const c = checklist[i];
      await client.query(`
        INSERT INTO inpatient_guide_settings_belongings_checklist (_order, _parent_id, id, enabled, icon, category, title, "desc")
        VALUES ($1, $2, $3, true, $4, $5, $6, $7)
      `, [i + 1, ipId, 'item-' + (i + 1), c.icon, c.category, c.title, c.desc]);
    }
    console.log('Seeded inpatient guide steps, hours, checklist!');
  }

  await client.end();
}

seedAll().catch(console.error);
