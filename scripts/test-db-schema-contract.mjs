import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { assertSchemaContract, sealSchemaContract } from './db-schema-contract.mjs'

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'bvdk-schema-contract-'))

function expectFailure(label, action, messagePart) {
  try {
    action()
    throw new Error(`${label}: lẽ ra phải thất bại.`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (message.startsWith(`${label}:`) || !message.includes(messagePart)) throw error
    console.log(`PASS - ${label}`)
  }
}

try {
  fs.mkdirSync(path.join(tempRoot, 'scripts/db-migrations'), { recursive: true })
  fs.mkdirSync(path.join(tempRoot, 'src'), { recursive: true })
  fs.writeFileSync(
    path.join(tempRoot, 'scripts/db-migrations/20260915_001_initial.mjs'),
    "export const id = '20260915_001_initial'\n",
  )
  fs.writeFileSync(path.join(tempRoot, 'src/payload-generated-schema.ts'), 'schema-version-a\n')

  sealSchemaContract('20260915_001_initial', tempRoot)
  assertSchemaContract({ root: tempRoot })
  console.log('PASS - Contract hợp lệ cho schema đã seal')

  fs.writeFileSync(path.join(tempRoot, 'src/payload-generated-schema.ts'), 'schema-version-b\n')
  expectFailure(
    'Schema đổi nhưng thiếu migration bị chặn',
    () => assertSchemaContract({ root: tempRoot }),
    'Payload schema đã thay đổi',
  )
  expectFailure(
    'Không thể dùng lại migration cũ để seal schema mới',
    () => sealSchemaContract('20260915_001_initial', tempRoot),
    'Không được dùng lại migration',
  )

  fs.writeFileSync(
    path.join(tempRoot, 'scripts/db-migrations/20260915_002_schema_b.mjs'),
    "export const id = '20260915_002_schema_b'\n",
  )
  sealSchemaContract('20260915_002_schema_b', tempRoot)
  assertSchemaContract({ root: tempRoot })
  console.log('PASS - Migration mới cho phép seal và deploy schema mới')
  console.log('\nDB schema contract behavior: 4/4 PASS')
} finally {
  const resolvedTempRoot = path.resolve(tempRoot)
  const resolvedSystemTemp = path.resolve(os.tmpdir())
  if (resolvedTempRoot.startsWith(`${resolvedSystemTemp}${path.sep}`)) {
    fs.rmSync(resolvedTempRoot, { recursive: true, force: true })
  }
}
