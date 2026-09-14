import pg from 'pg'

const pool = new pg.Pool({
  connectionString: 'postgresql://postgres:Nguyentanan1707%40@localhost:5432/thoi_lai_hospital',
})

const depts = [
  // Khối Phòng chức năng (office)
  { name: 'Phòng Kế hoạch nghiệp vụ', slug: 'phong-ke-hoach-nghiep-vu', kind: 'office', unit_type: 'office', order: 1 },
  { name: 'Phòng Tổ chức cán bộ - Hành chính quản trị', slug: 'phong-to-chuc-can-bo-hanh-chinh-quan-tri', kind: 'office', unit_type: 'office', order: 2 },
  { name: 'Phòng Tài chính kế toán', slug: 'phong-tai-chinh-ke-toan', kind: 'office', unit_type: 'office', order: 3 },
  { name: 'Phòng Điều dưỡng', slug: 'phong-dieu-duong', kind: 'office', unit_type: 'office', order: 4 },
  { name: 'Phòng Quản lý chất lượng & CNTT', slug: 'phong-quan-ly-chat-luong-cntt', kind: 'office', unit_type: 'office', order: 5 },

  // Khối Lâm sàng (clinical)
  { name: 'Khoa Cấp cứu - Hồi sức tích cực & Chống độc', slug: 'khoa-cap-cuu-hoi-suc-tich-cuc-chong-doc', kind: 'clinical', unit_type: 'clinical', order: 10 },
  { name: 'Khoa Khám bệnh', slug: 'khoa-kham-benh', kind: 'clinical', unit_type: 'clinical', order: 11 },
  { name: 'Khoa Nội tổng hợp', slug: 'khoa-noi-tong-hop', kind: 'clinical', unit_type: 'clinical', order: 12 },
  { name: 'Khoa Ngoại tổng hợp', slug: 'khoa-ngoai-tong-hop', kind: 'clinical', unit_type: 'clinical', order: 13 },
  { name: 'Khoa Phụ sản', slug: 'khoa-phu-san', kind: 'clinical', unit_type: 'clinical', order: 14 },
  { name: 'Khoa Nhi', slug: 'khoa-nhi', kind: 'clinical', unit_type: 'clinical', order: 15 },
  { name: 'Khoa Liên chuyên khoa (Mắt - TMH - RHM)', slug: 'khoa-lien-chuyen-khoa', kind: 'clinical', unit_type: 'clinical', order: 16 },
  { name: 'Khoa Y học cổ truyền - Phục hồi chức năng', slug: 'khoa-y-hoc-co-truyen-phuc-hoi-chuc-nang', kind: 'clinical', unit_type: 'clinical', order: 17 },

  // Khối Cận lâm sàng (paraclinical)
  { name: 'Khoa Xét nghiệm', slug: 'khoa-xet-nghiem', kind: 'paraclinical', unit_type: 'paraclinical', order: 20 },
  { name: 'Khoa Chẩn đoán hình ảnh', slug: 'khoa-chan-doan-hinh-anh', kind: 'paraclinical', unit_type: 'paraclinical', order: 21 },
  { name: 'Khoa Dược', slug: 'khoa-duoc', kind: 'paraclinical', unit_type: 'paraclinical', order: 22 },
  { name: 'Khoa Kiểm soát nhiễm khuẩn', slug: 'khoa-kiem-soat-nhiem-khuan', kind: 'paraclinical', unit_type: 'paraclinical', order: 23 },
]

async function run() {
  for (const d of depts) {
    const chk = await pool.query('SELECT id FROM departments WHERE slug = $1', [d.slug])
    if (chk.rows.length === 0) {
      await pool.query(
        'INSERT INTO departments (name, slug, kind, unit_type, "order", active, _status, updated_at, created_at) VALUES ($1, $2, $3, $4, $5, true, $6, NOW(), NOW())',
        [d.name, d.slug, d.kind, d.unit_type, d.order, 'published']
      )
      console.log('Inserted:', d.name)
    } else {
      console.log('Already exists:', d.name)
    }
  }

  await pool.query("UPDATE doctors SET title = 'Giám đốc' WHERE id = 1 AND title = 'Gián đốc'")
  console.log('Fix title completed.')
  await pool.end()
}

run().catch(console.error)
