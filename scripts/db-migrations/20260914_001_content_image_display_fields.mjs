export const id = '20260914_001_content_image_display_fields'
export const description = 'Đảm bảo trường căn ảnh cho nội dung và bảng phiên bản'
export const transactional = true

const columns = [
  ['notices', 'cover_fit', 'cover'],
  ['notices', 'cover_position', 'top'],
  ['news', 'cover_fit', 'cover'],
  ['news', 'cover_position', 'top'],
  ['procurement', 'cover_fit', 'cover'],
  ['procurement', 'cover_position', 'top'],
  ['_notices_v', 'version_cover_fit', 'cover'],
  ['_notices_v', 'version_cover_position', 'top'],
  ['_news_v', 'version_cover_fit', 'cover'],
  ['_news_v', 'version_cover_position', 'top'],
  ['_procurement_v', 'version_cover_fit', 'cover'],
  ['_procurement_v', 'version_cover_position', 'top'],
]

export async function up({ client }) {
  for (const [table, column, defaultValue] of columns) {
    await client.query(
      `ALTER TABLE public."${table}" ADD COLUMN IF NOT EXISTS "${column}" varchar DEFAULT '${defaultValue}'`,
    )
  }
}

export async function verify({ client }) {
  const result = await client.query(
    `SELECT table_name, column_name
       FROM information_schema.columns
      WHERE table_schema = 'public'
        AND (table_name, column_name) IN (
          SELECT * FROM unnest($1::text[], $2::text[])
        )`,
    [columns.map(([table]) => table), columns.map(([, column]) => column)],
  )

  if (result.rowCount !== columns.length) {
    throw new Error(`Thiếu trường căn ảnh: tìm thấy ${result.rowCount}/${columns.length}.`)
  }
}
