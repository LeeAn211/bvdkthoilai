export const id = '20260916_014_add_per_post_show_source'
export const description = 'Thêm cột show_source cho từng bài viết riêng biệt trong các collection bài viết và phiên bản tương ứng'
export const transactional = false

const tables = [
  { table: 'news', versionTable: '_news_v', defaultVal: 'true' },
  { table: 'notices', versionTable: '_notices_v', defaultVal: 'true' },
  { table: 'procurement', versionTable: '_procurement_v', defaultVal: 'true' },
  { table: 'custom_posts', versionTable: '_custom_posts_v', defaultVal: 'true' },
  { table: 'recruitment', versionTable: '_recruitment_v', defaultVal: 'true' },
  { table: 'scientific_activities', versionTable: '_scientific_activities_v', defaultVal: 'true' },
  { table: 'advanced_techniques', versionTable: null, defaultVal: 'false' },
]

export async function up({ client }) {
  for (const { table, versionTable, defaultVal } of tables) {
    // 1. Thêm cột vào bảng chính
    await client.query(`
      ALTER TABLE public."${table}"
      ADD COLUMN IF NOT EXISTS "show_source" boolean DEFAULT ${defaultVal};
    `)

    // 2. Thêm cột vào bảng phiên bản (nếu có)
    if (versionTable) {
      await client.query(`
        ALTER TABLE public."${versionTable}"
        ADD COLUMN IF NOT EXISTS "version_show_source" boolean DEFAULT ${defaultVal};
      `)
    }
  }
}

export async function verify({ client }) {
  const result = await client.query(`
    SELECT column_name FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'news' 
      AND column_name = 'show_source';
  `)
  if (result.rowCount === 0) {
    throw new Error('Chưa tìm thấy cột show_source trong bảng news.')
  }
}
