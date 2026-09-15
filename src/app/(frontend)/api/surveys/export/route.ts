import { NextResponse } from 'next/server'

import { hasModulePermission } from '@/access'
import { getCMS } from '@/lib/payload'

export async function GET(request: Request) {
  const payload = await getCMS()
  const { user } = await payload.auth({ headers: request.headers })

  if (!user || !hasModulePermission(user, 'surveys', 'export')) {
    return NextResponse.json({ error: 'Không có quyền xuất dữ liệu khảo sát.' }, { status: 403 })
  }

  const campaign = new URL(request.url).searchParams.get('campaign')
  if (!campaign) return NextResponse.json({ error: 'Thiếu campaign' }, { status: 400 })

  const campaignId = Number(campaign)
  if (!Number.isFinite(campaignId)) {
    return NextResponse.json({ error: 'Campaign không hợp lệ' }, { status: 400 })
  }

  const result = await payload.find({
    collection: 'survey-responses',
    where: { campaign: { equals: campaignId } },
    limit: 10000,
    sort: 'submittedAt',
    overrideAccess: true,
  })
  const escapeCell = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`
  const rows = [
    ['Mã phản hồi', 'Thời gian', 'Điểm TB', 'Ý kiến'],
    ...result.docs.map((item) => [item.responseCode, item.submittedAt, item.overallScore ?? '', item.comment ?? '']),
  ]
  const csv = `\uFEFF${rows.map((row) => row.map(escapeCell).join(',')).join('\r\n')}`

  return new NextResponse(csv, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': 'attachment; filename="khao-sat.csv"',
    },
  })
}
