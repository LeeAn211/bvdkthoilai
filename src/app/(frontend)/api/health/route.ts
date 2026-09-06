import { NextResponse } from 'next/server'
import { getCMS } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export async function GET(req: Request) {
  try {
    const payload = await getCMS()
    await payload.count({ collection: 'users', overrideAccess: true })
    const detailKey = process.env.HEALTH_DETAIL_KEY
    const detailed = Boolean(detailKey && req.headers.get('x-health-key') === detailKey)
    return NextResponse.json(detailed ? { status: 'ok', database: 'ok', time: new Date().toISOString() } : { status: 'ok' }, { headers: { 'Cache-Control': 'no-store, max-age=0' } })
  } catch {
    return NextResponse.json({ status: 'error' }, { status: 503, headers: { 'Cache-Control': 'no-store, max-age=0' } })
  }
}
