import { NextResponse } from 'next/server'

import { hasModulePermission } from '@/access'
import { getCMS } from '@/lib/payload'

export async function GET(request: Request) {
  const payload = await getCMS()
  const { user } = await payload.auth({ headers: request.headers })

  if (!user || !hasModulePermission(user, 'surveys', 'view')) {
    return NextResponse.json({ error: 'Không có quyền xem thống kê khảo sát.' }, { status: 403 })
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
    overrideAccess: true,
  })
  const scores = result.docs
    .map((item) => Number(item.overallScore))
    .filter((score) => Number.isFinite(score))
  const averageScore = scores.length
    ? scores.reduce((sum, score) => sum + score, 0) / scores.length
    : 0
  const satisfied = scores.filter((score) => score >= 4).length

  return NextResponse.json({
    responses: result.totalDocs,
    averageScore: Number(averageScore.toFixed(2)),
    satisfactionRate: scores.length ? Number(((satisfied * 100) / scores.length).toFixed(2)) : 0,
  })
}
