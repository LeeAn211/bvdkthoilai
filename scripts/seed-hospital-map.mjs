import fs from 'fs';
import { Client } from 'pg';

const env = fs.readFileSync('.env', 'utf8');
let conn = '';
for (const line of env.split('\n')) {
  if (line.startsWith('DATABASE_URL=')) conn = line.replace('DATABASE_URL=', '').trim();
}

const client = new Client({ connectionString: conn });

async function seed() {
  await client.connect();
  
  const existing = await client.query('SELECT id FROM hospital_map_settings LIMIT 1');
  let mapId;
  if (existing.rows.length === 0) {
    const res = await client.query(`
      INSERT INTO hospital_map_settings (
        eyebrow, title, description, show_notice_banner, notice_title, notice_content, notice_align
      ) VALUES (
        'CHỈ DẪN TIẾP ĐÓN TIỆN ÍCH',
        'Sơ đồ Chỉ dẫn Khoa / Phòng & Tiện ích',
        'Bản đồ chỉ dẫn phân tầng các khoa phòng chuyên môn, phòng khám chức năng và các khu vực dịch vụ công cộng tại Bệnh viện Đa khoa Khu vực Thới Lai.',
        true,
        'Bàn Hướng dẫn & Hỗ trợ người bệnh di chuyển',
        '• Tại sảnh chính Tầng trệt có Tổ Chăm sóc khách hàng trực tiếp chỉ dẫn và xe lăn hỗ trợ người già, người khuyết tật.\n• Thang máy vận chuyển ưu tiên người bệnh nội trú và xe cáng cấp cứu.',
        'left'
      ) RETURNING id
    `);
    mapId = res.rows[0].id;
    console.log('Created hospital_map_settings id:', mapId);
  } else {
    mapId = existing.rows[0].id;
    console.log('Found hospital_map_settings id:', mapId);
  }

  // Seed floors nếu trống
  const flCount = await client.query('SELECT count(*) FROM hospital_map_settings_floors WHERE _parent_id = $1', [mapId]);
  if (parseInt(flCount.rows[0].count) === 0) {
    const floors = [
      {
        order: 1,
        id: 'floor-0',
        floor_name: 'Tầng Trệt (Khu Tiếp đón & Cấp cứu)',
        overview: 'Khu vực tiếp đón ban đầu, khám bệnh đa khoa ngoại trú, cấp cứu khẩn cấp và nhà thuốc.',
        rooms: '• Quầy Tiếp nhận BHYT & Phát số tự động (Cửa số 1 – 4)\n• Quầy Thu viện phí & Viện phí Ngoại trú\n• Khoa Cấp cứu 24/24 & Phòng Hồi sức Cấp cứu chống sốc\n• Khoa Khám bệnh (Các phòng khám: Nội, Ngoại, Sản, Nhi, Mắt, Tai Mũi Họng, Răng Hàm Mặt, Y học cổ truyền)\n• Nhà thuốc Bệnh viện đạt chuẩn GPP & Quầy Phát thuốc Ngoại trú BHYT\n• Bàn Tổ Chăm sóc khách hàng & Chỉ dẫn di chuyển xe lăn'
      },
      {
        order: 2,
        id: 'floor-1',
        floor_name: 'Tầng 1 (Khu Cận lâm sàng & Chẩn đoán hình ảnh)',
        overview: 'Khu kỹ thuật xét nghiệm y học, chẩn đoán hình ảnh và thăm dò chức năng.',
        rooms: '• Phòng Xét nghiệm Huyết học – Sinh hóa – Vi sinh\n• Phòng Chụp X-Quang kỹ thuật số & Chụp CT-Scanner\n• Phòng Siêu âm Doppler màu (Tổng quát, Tim mạch, Sản phụ khoa)\n• Phòng Đo điện tim (ECG) & Đo chức năng hô hấp\n• Phòng Nội soi tiêu hóa (Dạ dày – Tá tràng – Đại trực tràng)\n• Khu vực ghế chờ lấy máu và trả kết quả cận lâm sàng'
      },
      {
        order: 3,
        id: 'floor-2',
        floor_name: 'Tầng 2 (Khu Điều trị Nội trú 1 & Phẫu thuật)',
        overview: 'Các khoa điều trị nội trú hệ Ngoại, Sản và cụm phòng mổ vô khuẩn.',
        rooms: '• Khoa Ngoại Tổng hợp (Buồng bệnh nội trú Ngoại khoa)\n• Khoa Phụ sản & Phòng sinh vô khuẩn\n• Cụm Phẫu thuật – Gây mê hồi sức (Phòng mổ áp lực dương)\n• Phòng Hồi tỉnh & Phòng Chăm sóc hậu phẫu tích cực\n• Phòng Điều dưỡng trưởng khoa & Trực ban Bác sĩ'
      },
      {
        order: 4,
        id: 'floor-3',
        floor_name: 'Tầng 3 (Khu Điều trị Nội trú 2 & Ban Giám đốc)',
        overview: 'Các khoa điều trị nội trú hệ Nội, Nhi, YHCT và văn phòng hành chính.',
        rooms: '• Khoa Nội Tổng hợp & Khoa Nhi\n• Khoa Y học Cổ truyền – Phục hồi chức năng\n• Khoa Hồi sức tích cực – Chống độc (ICU)\n• Hội trường giao ban chuyên môn & Phòng Đào tạo\n• Văn phòng Ban Giám đốc & Các phòng chức năng (Kế hoạch tổng hợp, Tổ chức cán bộ, Tài chính kế toán)'
      }
    ];

    for (const f of floors) {
      await client.query(`
        INSERT INTO hospital_map_settings_floors (
          _order, _parent_id, id, enabled, floor_name, overview, rooms, level, name, departments
        ) VALUES (
          $1, $2, $3, true, $4, $5, $6::text, $4, $4, $6::varchar
        )
      `, [f.order, mapId, f.id, f.floor_name, f.overview, f.rooms]);
    }
    console.log('Seeded 4 floors!');
  }

  // Seed facilities nếu trống
  const facCount = await client.query('SELECT count(*) FROM hospital_map_settings_facilities WHERE _parent_id = $1', [mapId]);
  if (parseInt(facCount.rows[0].count) === 0) {
    const facilities = [
      {
        order: 1,
        id: 'fac-1',
        icon: '💊',
        name: 'Nhà thuốc Bệnh viện GPP',
        location: 'Sảnh chính Tầng trệt (cạnh quầy tiếp đón)',
        hours: '06:00 – 21:00 hàng ngày',
        desc: 'Cung ứng đầy đủ thuốc điều trị chính hãng, vắc xin và vật tư y tế theo giá niêm yết của Bộ Y tế.'
      },
      {
        order: 2,
        id: 'fac-2',
        icon: '🚑',
        name: 'Cổng Cấp cứu 24/24',
        location: 'Cổng số 2 (Đường chuyên dụng xe cứu thương)',
        hours: 'Thường trực 24/7/365',
        desc: 'Đường tiếp cận riêng biệt, bằng phẳng, có mái che phục vụ tiếp nhận xe cấp cứu và ca bệnh nguy kịch.'
      },
      {
        order: 3,
        id: 'fac-3',
        icon: '🍵',
        name: 'Căn tin & Suất ăn Dinh dưỡng',
        location: 'Khuôn viên phía sau Tầng trệt',
        hours: '05:30 – 20:00 hàng ngày',
        desc: 'Phục vụ bữa ăn dinh dưỡng, nước giải khát hợp vệ sinh cho thân nhân và cung cấp suất ăn bệnh lý theo chỉ định.'
      },
      {
        order: 4,
        id: 'fac-4',
        icon: '🏧',
        name: 'Cây rút tiền ATM & Điểm thanh toán số',
        location: 'Cổng chính sảnh tiếp đón',
        hours: '24/24',
        desc: 'Cung cấp cây ATM rút tiền mặt và hỗ trợ quét mã VietQR tĩnh/động tại tất cả các quầy thu viện phí.'
      },
      {
        order: 5,
        id: 'fac-5',
        icon: '🛵',
        name: 'Bãi giữ xe 2 bánh & Ô tô',
        location: 'Hai bên cổng chính vào viện',
        hours: '24/24',
        desc: 'Khuôn viên có mái che, hệ thống camera an ninh giám sát và bảo vệ túc trực hỗ trợ người dân.'
      },
      {
        order: 6,
        id: 'fac-6',
        icon: '♿',
        name: 'Khu cấp phát Xe lăn & Xe cáng miễn phí',
        location: 'Tại Bàn Hướng dẫn CSKH (Sảnh chính)',
        hours: '24/24',
        desc: 'Hỗ trợ ngay lập tức người già yếu, bệnh nhân khó đi lại và phụ nữ chuyển dạ.'
      }
    ];

    for (const fa of facilities) {
      await client.query(`
        INSERT INTO hospital_map_settings_facilities (
          _order, _parent_id, id, enabled, icon, name, location, hours, "desc"
        ) VALUES (
          $1, $2, $3, true, $4, $5, $6, $7, $8
        )
      `, [fa.order, mapId, fa.id, fa.icon, fa.name, fa.location, fa.hours, fa.desc]);
    }
    console.log('Seeded 6 facilities!');
  }

  await client.end();
}

seed().catch(console.error);
