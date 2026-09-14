import pg from 'pg';
const { Client } = pg;

async function syncDb() {
  const client = new Client({
    connectionString: 'postgresql://postgres:Nguyentanan1707%40@localhost:5432/thoi_lai_hospital'
  });
  await client.connect();

  // 1. Update about_page row
  await client.query(
    'UPDATE about_page SET core_principles_title = $1, core_principles_subtitle = $2, updated_at = NOW() WHERE id = 1',
    [
      'Chức năng & Nhiệm vụ trọng tâm',
      'Thực hiện chức năng khám chữa bệnh đa khoa, cấp cứu và chăm sóc sức khỏe nhân dân toàn diện theo quy chuẩn của Bộ Y tế và Sở Y tế TP. Cần Thơ.'
    ]
  );

  // 2. Delete old duplicate core principles items from about_page_core_principles_items
  await client.query('DELETE FROM about_page_core_principles_items WHERE _parent_id = 1');

  // 3. Insert 4 distinct duty/function items
  const dutyItems = [
    {
      order: 1,
      id: 'duty00000000000000000001',
      icon: '🚑',
      title: 'Cấp cứu & Khám chữa bệnh đa khoa',
      desc: 'Tổ chức tiếp nhận cấp cứu 24/7, khám bệnh ngoại trú, điều trị nội trú đa khoa và phục hồi chức năng cho người dân huyện Thới Lai và khu vực lân cận.'
    },
    {
      order: 2,
      id: 'duty00000000000000000002',
      icon: '🔬',
      title: 'Phát triển kỹ thuật & Phẫu thuật ngoại khoa',
      desc: 'Ứng dụng phẫu thuật nội soi, chẩn đoán hình ảnh kỹ thuật số, xét nghiệm tự động và từng bước phát triển các kỹ thuật chuyên sâu tuyến khu vực.'
    },
    {
      order: 3,
      id: 'duty00000000000000000003',
      icon: '🛡️',
      title: 'Y tế dự phòng & Hỗ trợ chỉ đạo tuyến',
      desc: 'Chủ động phối hợp phòng chống dịch bệnh, giám sát dịch tễ, truyền thông giáo dục sức khỏe và hỗ trợ chuyên môn kỹ thuật cho y tế cơ sở.'
    },
    {
      order: 4,
      id: 'duty00000000000000000004',
      icon: '💻',
      title: 'Chuyển đổi số & Bệnh án điện tử',
      desc: 'Triển khai toàn diện hồ sơ bệnh án điện tử (EMR), lưu trữ hình ảnh PACS không in phim, thanh toán không tiền mặt và đặt lịch khám trực tuyến.'
    }
  ];

  for (const item of dutyItems) {
    await client.query(
      'INSERT INTO about_page_core_principles_items (_order, _parent_id, id, icon, title, "desc") VALUES ($1, 1, $2, $3, $4, $5)',
      [item.order, item.id, item.icon, item.title, item.desc]
    );
  }

  console.log('Database updated successfully for about_page!');
  await client.end();
}

syncDb().catch(console.error);
