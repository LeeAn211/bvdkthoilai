import { assertSchemaContract } from './db-schema-contract.mjs'

try {
  const contract = assertSchemaContract()
  console.log(`✓ DB schema contract hợp lệ: ${contract.migrationId}`)
} catch (error) {
  console.error('✗ DB SCHEMA CONTRACT FAILED')
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}
