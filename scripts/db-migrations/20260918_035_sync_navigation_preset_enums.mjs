export const id = '20260918_035_sync_navigation_preset_enums'
export const description = 'Đồng bộ toàn diện các giá trị enum preset cho Menu website (bao gồm Dành cho người bệnh, Quy trình khám, Giờ làm việc, Khảo sát, Góp ý...)'
export const transactional = false

const newPresets = [
  '/chat-luong-benh-vien',
  '/danh-cho-nguoi-benh',
  '/quy-trinh-kham-benh',
  '/lich-lam-viec',
  '/khao-sat',
  '/gop-y',
  '/gop-y/tra-cuu',
  '/hoi-dap',
  '/bieu-mau',
]

const targetEnums = [
  'enum_navigation_items_preset',
  'enum_navigation_items_children_preset',
  'enum__navigation_v_version_items_preset',
  'enum__navigation_v_version_items_children_preset',
]

export async function up({ client }) {
  for (const enumName of targetEnums) {
    for (const val of newPresets) {
      try {
        await client.query(`ALTER TYPE public."${enumName}" ADD VALUE IF NOT EXISTS '${val}';`)
      } catch (err) {
        console.warn(`Không thể thêm giá trị ${val} vào ${enumName}:`, err.message)
      }
    }
  }
}

export async function verify({ client }) {
  const q = await client.query(`
    SELECT enumlabel 
    FROM pg_enum 
    JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
    WHERE typname = 'enum_navigation_items_preset' AND enumlabel = '/danh-cho-nguoi-benh';
  `)
  if (q.rows.length === 0) {
    throw new Error('Chưa tìm thấy giá trị /danh-cho-nguoi-benh trong enum_navigation_items_preset.')
  }
}
