import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

export const CONTRACT_VERSION = 1
export const DEFAULT_CONTRACT_PATH = 'scripts/db-schema-contract.json'
export const DEFAULT_SCHEMA_PATH = 'src/payload-generated-schema.ts'
export const DEFAULT_MIGRATION_DIRECTORY = 'scripts/db-migrations'

function normalizedFileChecksum(filePath) {
  const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n')
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex')
}

export function listMigrationIDs(root = process.cwd()) {
  const directory = path.resolve(root, DEFAULT_MIGRATION_DIRECTORY)
  if (!fs.existsSync(directory)) throw new Error(`Không tìm thấy thư mục migration: ${directory}`)

  return fs.readdirSync(directory)
    .filter((fileName) => /^\d{8}_\d{3}_[a-z0-9_]+\.mjs$/.test(fileName))
    .sort()
    .map((fileName) => fileName.slice(0, -4))
}

export function currentSchemaChecksum(root = process.cwd()) {
  const schemaPath = path.resolve(root, DEFAULT_SCHEMA_PATH)
  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Không tìm thấy Payload schema đã sinh: ${schemaPath}`)
  }
  return normalizedFileChecksum(schemaPath)
}

export function readSchemaContract(root = process.cwd()) {
  const contractPath = path.resolve(root, DEFAULT_CONTRACT_PATH)
  if (!fs.existsSync(contractPath)) {
    throw new Error(`Thiếu ${DEFAULT_CONTRACT_PATH}. Hãy tạo migration và seal schema trước khi deploy.`)
  }

  let contract
  try {
    contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'))
  } catch {
    throw new Error(`${DEFAULT_CONTRACT_PATH} không phải JSON hợp lệ.`)
  }

  if (contract.version !== CONTRACT_VERSION) {
    throw new Error(`Schema contract version phải là ${CONTRACT_VERSION}.`)
  }
  if (!/^\d{8}_\d{3}_[a-z0-9_]+$/.test(contract.migrationId || '')) {
    throw new Error('Schema contract có migrationId không hợp lệ.')
  }
  if (!/^[a-f0-9]{64}$/.test(contract.schemaSha256 || '')) {
    throw new Error('Schema contract có schemaSha256 không hợp lệ.')
  }
  return contract
}

export function assertSchemaContract({ root = process.cwd(), migrationIds } = {}) {
  const ids = migrationIds || listMigrationIDs(root)
  if (ids.length === 0) throw new Error('Không có migration để đối chiếu schema contract.')

  const contract = readSchemaContract(root)
  const latestMigrationId = ids.at(-1)
  if (contract.migrationId !== latestMigrationId) {
    throw new Error(
      `Schema contract đang gắn với ${contract.migrationId}, nhưng migration mới nhất là ${latestMigrationId}. ` +
      `Hãy chạy generate:db-schema rồi db:schema:seal sau khi hoàn tất migration mới.`,
    )
  }

  const actualChecksum = currentSchemaChecksum(root)
  if (contract.schemaSha256 !== actualChecksum) {
    throw new Error(
      'Payload schema đã thay đổi nhưng chưa có migration được seal. ' +
      'Không được bật PAYLOAD_DB_PUSH trên production; hãy tạo migration mới, sinh lại DB schema và seal contract.',
    )
  }

  return { ...contract, latestMigrationId }
}

export function sealSchemaContract(migrationId, root = process.cwd()) {
  const ids = listMigrationIDs(root)
  const latestMigrationId = ids.at(-1)
  if (!migrationId || migrationId !== latestMigrationId) {
    throw new Error(`Chỉ được seal migration mới nhất: ${latestMigrationId || '(không có)'}.`)
  }

  const schemaSha256 = currentSchemaChecksum(root)
  let previous = null
  try {
    previous = readSchemaContract(root)
  } catch (error) {
    if (!String(error?.message || error).startsWith('Thiếu ')) throw error
  }

  if (previous?.migrationId === migrationId && previous.schemaSha256 !== schemaSha256) {
    throw new Error(
      `Không được dùng lại migration ${migrationId} cho schema đã thay đổi. Hãy tạo một migration ID mới.`,
    )
  }
  if (previous?.migrationId && migrationId < previous.migrationId) {
    throw new Error(`Không được seal lùi từ ${previous.migrationId} về ${migrationId}.`)
  }

  const contract = {
    version: CONTRACT_VERSION,
    migrationId,
    schemaSha256,
  }
  fs.writeFileSync(
    path.resolve(root, DEFAULT_CONTRACT_PATH),
    `${JSON.stringify(contract, null, 2)}\n`,
    'utf8',
  )
  return contract
}
