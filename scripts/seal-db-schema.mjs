import { sealSchemaContract } from './db-schema-contract.mjs'

const migrationId = process.argv[2]

try {
  const contract = sealSchemaContract(migrationId)
  console.log(`✓ Đã seal DB schema với migration ${contract.migrationId}`)
  console.log(`  SHA-256: ${contract.schemaSha256}`)
} catch (error) {
  console.error('✗ KHÔNG THỂ SEAL DB SCHEMA')
  console.error(error instanceof Error ? error.message : error)
  console.error('Cách dùng: npm run db:schema:seal -- YYYYMMDD_NNN_ten_migration')
  process.exitCode = 1
}
