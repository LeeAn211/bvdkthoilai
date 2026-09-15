# Database migrations

## Quy tắc

- Tên file: `YYYYMMDD_NNN_ten_migration.mjs`.
- `id` phải trùng tên file không gồm `.mjs`.
- Mỗi file export `id`, `description`, `up`, `verify`.
- Mặc định migration chạy trong một transaction.
- Không sửa/xóa migration đã áp dụng; runner kiểm tra SHA-256 checksum.
- Chỉ dùng câu lệnh additive/idempotent. Không `DROP`, `TRUNCATE`, reset hay seed phá dữ liệu.
- Nếu thêm enum và PostgreSQL không hỗ trợ trong transaction, export `transactional = false`.
- Tên bảng, cột, index và constraint phải ngắn hơn 63 ký tự.
- Sau khi sinh `payload-generated-schema.ts` và tạo migration mới, phải seal schema contract bằng đúng ID migration mới nhất.
- Trên Neon, migration dùng `DATABASE_MIGRATION_URL` Direct; không dùng hostname `-pooler`.

## Mẫu migration

```js
export const id = '20260915_001_example_field'
export const description = 'Thêm trường ví dụ'
export const transactional = true

export async function up({ client }) {
  await client.query(`
    ALTER TABLE public.example
    ADD COLUMN IF NOT EXISTS example_field varchar
  `)
}

export async function verify({ client }) {
  const result = await client.query(`
    SELECT data_type
      FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = 'example'
       AND column_name = 'example_field'
  `)

  if (result.rows[0]?.data_type !== 'character varying') {
    throw new Error('example.example_field chưa đồng bộ đúng kiểu.')
  }
}
```

## Lệnh

```bash
npm run db:migrate:dry-run
npm run db:migrate:deploy
npm run db:migrate:status
npm run db:migrate:verify
npm run generate:db-schema
npm run db:schema:seal -- YYYYMMDD_NNN_ten_migration
npm run db:schema:check
```
