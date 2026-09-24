export const id = '20260924_073_add_work_schedule_preset_to_navigation_enums'
export const description = 'Bổ sung giá trị /lich-lam-viec vào các enum preset của Navigation và _navigation_v'
export const transactional = false

export async function up({ client }) {
  const enums = [
    'enum_navigation_items_children_preset',
    'enum_navigation_items_preset',
    'enum__navigation_v_version_items_children_preset',
    'enum__navigation_v_version_items_preset',
  ]

  for (const enumName of enums) {
    try {
      await client.query(`ALTER TYPE "${enumName}" ADD VALUE IF NOT EXISTS '/lich-lam-viec';`)
    } catch (err) {
      console.warn(`Lưu ý khi thêm /lich-lam-viec vào ${enumName}:`, err.message)
    }
  }
}

export async function verify({ client }) {
  const enums = [
    'enum_navigation_items_children_preset',
    'enum_navigation_items_preset',
    'enum__navigation_v_version_items_children_preset',
    'enum__navigation_v_version_items_preset',
  ]

  for (const enumName of enums) {
    const res = await client.query(`
      SELECT 1 FROM pg_enum
      WHERE enumtypid = '${enumName}'::regtype
        AND enumlabel = '/lich-lam-viec';
    `)
    if (!res.rows?.length) {
      throw new Error(`Chưa tìm thấy enum value /lich-lam-viec trong ${enumName}`)
    }
  }
}
