export const id = '20260916_011_sync_all_cover_fit_and_image_fit_enums'
export const description = 'Đồng bộ toàn diện các giá trị enum cover_fit, image_fit và cover_position cho tất cả các bảng nội dung và bảng phiên bản'
export const transactional = false

const fitValues = ['contain', 'cover', 'cover-top', 'cover-center', 'cover-bottom', 'fill']
const positionValues = ['top', 'center', 'bottom']

const explicitFitEnums = [
  'enum_news_cover_fit',
  'enum__news_v_version_cover_fit',
  'enum_notices_cover_fit',
  'enum__notices_v_version_cover_fit',
  'enum_procurement_cover_fit',
  'enum__procurement_v_version_cover_fit',
  'enum_recruitment_cover_fit',
  'enum__recruitment_v_version_cover_fit',
  'enum_scientific_activities_cover_fit',
  'enum__scientific_activities_v_version_cover_fit',
  'enum_specialties_cover_fit',
  'enum__specialties_v_version_cover_fit',
  'enum_specialties_cover_fit_home',
  'enum__specialties_v_version_cover_fit_home',
  'enum_specialties_cover_fit_detail',
  'enum__specialties_v_version_cover_fit_detail',
  'enum_our_experts_image_fit',
  'enum__our_experts_v_version_image_fit',
  'enum_advanced_techniques_image_fit',
  'enum__advanced_techniques_v_version_image_fit',
  'enum_expert_items_image_fit',
  'enum__expert_items_v_image_fit',
  'enum_tech_items_image_fit',
  'enum__tech_items_v_image_fit',
]

const explicitPositionEnums = [
  'enum_news_cover_position',
  'enum__news_v_version_cover_position',
  'enum_notices_cover_position',
  'enum__notices_v_version_cover_position',
  'enum_procurement_cover_position',
  'enum__procurement_v_version_cover_position',
  'enum_scientific_activities_cover_position',
  'enum__scientific_activities_v_version_cover_position',
  'enum_specialties_cover_position',
  'enum__specialties_v_version_cover_position',
]

async function ensureEnum(client, enumName, values) {
  const check = await client.query(`SELECT 1 FROM pg_type WHERE typname = $1`, [enumName])
  if (check.rowCount === 0) {
    const formattedValues = values.map((v) => `'${v}'`).join(', ')
    await client.query(`CREATE TYPE public."${enumName}" AS ENUM (${formattedValues});`)
  } else {
    for (const val of values) {
      try {
        await client.query(`ALTER TYPE public."${enumName}" ADD VALUE IF NOT EXISTS '${val}';`)
      } catch (err) {
        // Ignored if already exists
      }
    }
  }
}

async function safeAddColumn(client, table, column, defaultValue) {
  const tableExists = await client.query(`
    SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1;
  `, [table])
  if (tableExists.rowCount > 0) {
    await client.query(`
      ALTER TABLE public."${table}" ADD COLUMN IF NOT EXISTS "${column}" varchar DEFAULT '${defaultValue}';
    `)
  }
}

export async function up({ client }) {
  // 1. Cập nhật các enum tường minh
  for (const enumName of explicitFitEnums) {
    await ensureEnum(client, enumName, fitValues)
  }

  for (const enumName of explicitPositionEnums) {
    await ensureEnum(client, enumName, positionValues)
  }

  // 2. Quét động tất cả các enum khác trong DB có liên quan đến fit hoặc position
  const dynamicFitEnums = await client.query(`
    SELECT typname FROM pg_type 
    WHERE typtype = 'e' AND (typname LIKE '%cover_fit%' OR typname LIKE '%image_fit%');
  `)
  for (const row of dynamicFitEnums.rows) {
    for (const val of fitValues) {
      try {
        await client.query(`ALTER TYPE public."${row.typname}" ADD VALUE IF NOT EXISTS '${val}';`)
      } catch (e) {}
    }
  }

  const dynamicPosEnums = await client.query(`
    SELECT typname FROM pg_type 
    WHERE typtype = 'e' AND (typname LIKE '%cover_position%');
  `)
  for (const row of dynamicPosEnums.rows) {
    for (const val of positionValues) {
      try {
        await client.query(`ALTER TYPE public."${row.typname}" ADD VALUE IF NOT EXISTS '${val}';`)
      } catch (e) {}
    }
  }

  // 3. Đảm bảo tất cả cột tồn tại trên bảng chính và bảng phiên bản (_v)
  const columns = [
    ['news', 'cover_fit', 'cover'],
    ['news', 'cover_position', 'top'],
    ['_news_v', 'version_cover_fit', 'cover'],
    ['_news_v', 'version_cover_position', 'top'],
    ['notices', 'cover_fit', 'cover'],
    ['notices', 'cover_position', 'top'],
    ['_notices_v', 'version_cover_fit', 'cover'],
    ['_notices_v', 'version_cover_position', 'top'],
    ['procurement', 'cover_fit', 'cover'],
    ['procurement', 'cover_position', 'top'],
    ['_procurement_v', 'version_cover_fit', 'cover'],
    ['_procurement_v', 'version_cover_position', 'top'],
    ['recruitment', 'cover_fit', 'cover'],
    ['_recruitment_v', 'version_cover_fit', 'cover'],
    ['scientific_activities', 'cover_fit', 'cover'],
    ['scientific_activities', 'cover_position', 'top'],
    ['_scientific_activities_v', 'version_cover_fit', 'cover'],
    ['_scientific_activities_v', 'version_cover_position', 'top'],
    ['specialties', 'cover_fit', 'cover'],
    ['specialties', 'cover_position', 'top'],
    ['specialties', 'cover_fit_home', 'cover-top'],
    ['specialties', 'cover_fit_detail', 'contain'],
    ['_specialties_v', 'version_cover_fit', 'cover'],
    ['_specialties_v', 'version_cover_position', 'top'],
    ['_specialties_v', 'version_cover_fit_home', 'cover-top'],
    ['_specialties_v', 'version_cover_fit_detail', 'contain'],
    ['our_experts', 'image_fit', 'contain'],
    ['_our_experts_v', 'version_image_fit', 'contain'],
    ['advanced_techniques', 'image_fit', 'contain'],
    ['_advanced_techniques_v', 'version_image_fit', 'contain'],
  ]

  for (const [table, col, defVal] of columns) {
    await safeAddColumn(client, table, col, defVal)
  }
}

export async function verify({ client }) {
  // Kiểm tra enum_news_cover_fit có đủ giá trị cover-bottom
  const res = await client.query(`
    SELECT e.enumlabel 
    FROM pg_type t 
    JOIN pg_enum e ON t.oid = e.enumtypid 
    WHERE t.typname = 'enum_news_cover_fit' AND e.enumlabel = 'cover-bottom';
  `)
  if (res.rowCount === 0) {
    throw new Error('Chưa tìm thấy giá trị cover-bottom trong enum_news_cover_fit.')
  }

  // Kiểm tra enum_procurement_cover_fit có cover-bottom
  const procRes = await client.query(`
    SELECT e.enumlabel 
    FROM pg_type t 
    JOIN pg_enum e ON t.oid = e.enumtypid 
    WHERE t.typname = 'enum_procurement_cover_fit' AND e.enumlabel = 'cover-bottom';
  `)
  if (procRes.rowCount === 0) {
    throw new Error('Chưa tìm thấy giá trị cover-bottom trong enum_procurement_cover_fit.')
  }
}
