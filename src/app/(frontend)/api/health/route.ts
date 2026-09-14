import fs from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { getCMS } from '@/lib/payload'

export const dynamic = 'force-dynamic'

async function storageProbe(): Promise<boolean> {
  const isR2 = Boolean(process.env.R2_BUCKET && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && process.env.R2_ENDPOINT)
  if (isR2 && (process.env.NODE_ENV === 'production' || process.env.MEDIA_STORAGE === 'r2')) {
    return true
  }
  try {
    const mediaDir = path.resolve(process.cwd(), 'media')
    await fs.access(mediaDir)
    return true
  } catch {
    return false
  }
}

export async function GET(req: Request) {
  const checks: { database?: string; storage?: string } = {}
  try {
    const payload = await getCMS()
    await payload.count({ collection: 'users', overrideAccess: true })
    checks.database = 'ok'

    const storageOk = await storageProbe()
    checks.storage = storageOk ? 'ok' : 'degraded'

    const detailKey = process.env.HEALTH_DETAIL_KEY
    const detailed = Boolean(detailKey && req.headers.get('x-health-key') === detailKey)

    return NextResponse.json(
      detailed
        ? { status: 'ok', checks: { database: checks.database, storage: checks.storage }, time: new Date().toISOString() }
        : { status: 'ok', checks },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    )
  } catch (error) {
    console.error('[HealthCheck] Lỗi kiểm tra trạng thái hệ thống:', error)
    return NextResponse.json(
      { status: 'error', checks: { database: checks.database || 'error', storage: checks.storage || 'unknown' } },
      { status: 503, headers: { 'Cache-Control': 'no-store, max-age=0' } }
    )
  }
}

