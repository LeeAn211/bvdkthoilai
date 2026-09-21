import { NextRequest, NextResponse } from 'next/server'
import { getCMS } from '@/lib/payload'

// Cache đếm người đang online (hoạt động trong 5 phút gần nhất)
// Key: visitorId/IP hash, Value: timestamp
const activeSessions = new Map<string, number>()
const ONLINE_WINDOW_MS = 5 * 60 * 1000 // 5 phút

function cleanOldSessions() {
  const cutoff = Date.now() - ONLINE_WINDOW_MS
  for (const [key, ts] of activeSessions.entries()) {
    if (ts < cutoff) {
      activeSessions.delete(key)
    }
  }
}

export async function GET(req: NextRequest) {
  try {
    const payload = await getCMS()
    cleanOldSessions()

    // 1. Tính số người đang online
    const onlineCount = Math.max(1, activeSessions.size)

    // 2. Lấy ngày hôm nay định dạng YYYY-MM-DD
    const todayStr = new Date().toISOString().slice(0, 10)
    const currentMonthPrefix = todayStr.slice(0, 7) // YYYY-MM

    // 3. Truy vấn thống kê từ DB
    const [summaryRes, todayRes, monthRes, historyRes, topContentRes] = await Promise.all([
      payload.db.drizzle.execute(
        `SELECT total_views, total_visits, initial_offset FROM public."site_visits_summary" WHERE id = 1 LIMIT 1;`
      ).catch(() => ({ rows: [] })),
      payload.db.drizzle.execute(
        `SELECT views, unique_visits FROM public."site_visits_daily" WHERE date = '${todayStr}' LIMIT 1;`
      ).catch(() => ({ rows: [] })),
      payload.db.drizzle.execute(
        `SELECT COALESCE(SUM(views), 0)::bigint AS month_views, COALESCE(SUM(unique_visits), 0)::bigint AS month_visits 
         FROM public."site_visits_daily" WHERE date LIKE '${currentMonthPrefix}%';`
      ).catch(() => ({ rows: [] })),
      // Lấy 14 ngày gần nhất để vẽ biểu đồ đường xu hướng
      payload.db.drizzle.execute(
        `SELECT date, views, unique_visits 
         FROM public."site_visits_daily" 
         ORDER BY date DESC LIMIT 14;`
      ).catch(() => ({ rows: [] })),
      // Lấy top 10 bài viết xem nhiều nhất từ News và Notices
      payload.db.drizzle.execute(
        `SELECT id, title, slug, 'news' AS type, 'Tin tức' AS type_label, COALESCE(views, 0)::int AS views, updated_at
         FROM public."news" WHERE _status = 'published'
         UNION ALL
         SELECT id, title, slug, 'notices' AS type, 'Thông báo' AS type_label, COALESCE(views, 0)::int AS views, updated_at
         FROM public."notices" WHERE _status = 'published'
         UNION ALL
         SELECT id, title, slug, 'clinical-protocols' AS type, 'Phác đồ' AS type_label, COALESCE(views, 0)::int AS views, updated_at
         FROM public."clinical_protocols"
         ORDER BY views DESC, updated_at DESC
         LIMIT 10;`
      ).catch(() => ({ rows: [] })),
    ])

    const summary = summaryRes.rows?.[0] as any || {}
    const today = todayRes.rows?.[0] as any || {}
    const month = monthRes.rows?.[0] as any || {}
    const historyRows = (historyRes.rows as any[] || []).reverse()
    const topContentRows = (topContentRes.rows as any[] || [])

    const initialOffset = Number(summary.initial_offset || 0)
    const totalViews = Number(summary.total_views || 0) + initialOffset
    const totalVisits = Number(summary.total_visits || 0) + initialOffset
    const todayViews = Number(today.views || 0)
    const todayVisits = Number(today.unique_visits || 0)
    const monthViews = Number(month.month_views || 0)
    const monthVisits = Number(month.month_visits || 0)

    return NextResponse.json({
      success: true,
      data: {
        online: onlineCount,
        today: {
          views: todayViews,
          visits: todayVisits,
        },
        month: {
          views: monthViews,
          visits: monthVisits,
        },
        total: {
          views: totalViews,
          visits: totalVisits,
        },
        history: historyRows.map((r) => ({
          date: r.date,
          views: Number(r.views || 0),
          visits: Number(r.unique_visits || 0),
        })),
        topContent: topContentRows.map((r) => ({
          id: r.id,
          title: r.title,
          slug: r.slug,
          type: r.type,
          typeLabel: r.type_label,
          views: Number(r.views || 0),
          updatedAt: r.updated_at,
          href: r.type === 'news' ? `/tin-tuc/${r.slug}` : r.type === 'notices' ? `/thong-bao/${r.slug}` : `/phac-do-dieu-tri/${r.slug}`,
        })),
      },
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getCMS()
    const now = Date.now()

    let body: any = {}
    try {
      body = await req.json().catch(() => ({}))
    } catch {}

    const { collection, slug } = body || {}

    // 1. Nhận diện visitor (từ cookie hoặc IP header)
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     '127.0.0.1'
    const userAgent = req.headers.get('user-agent') || 'unknown'
    const visitorId = `${clientIp}_${userAgent.slice(0, 30)}`

    // Đánh dấu online
    const isNewVisitorSession = !activeSessions.has(visitorId)
    activeSessions.set(visitorId, now)
    cleanOldSessions()

    const todayStr = new Date().toISOString().slice(0, 10)

    // 2. Cập nhật bảng site_visits_summary
    await payload.db.drizzle.execute(`
      INSERT INTO public."site_visits_summary" ("id", "total_views", "total_visits", "initial_offset", "updated_at")
      VALUES (1, 1, ${isNewVisitorSession ? 1 : 0}, 0, now())
      ON CONFLICT ("id") DO UPDATE
      SET total_views = public."site_visits_summary".total_views + 1,
          total_visits = public."site_visits_summary".total_visits + ${isNewVisitorSession ? 1 : 0},
          updated_at = now();
    `)

    // 3. Cập nhật bảng site_visits_daily
    await payload.db.drizzle.execute(`
      INSERT INTO public."site_visits_daily" ("date", "views", "unique_visits", "updated_at")
      VALUES ('${todayStr}', 1, ${isNewVisitorSession ? 1 : 0}, now())
      ON CONFLICT ("date") DO UPDATE
      SET views = public."site_visits_daily".views + 1,
          unique_visits = public."site_visits_daily".unique_visits + ${isNewVisitorSession ? 1 : 0},
          updated_at = now();
    `)

    // 4. Nếu có truyền thông tin bài viết cụ thể (news, notices, clinical-protocols) -> Tăng views của bài đó
    if (collection && slug) {
      const allowedCollections = ['news', 'notices', 'clinical-protocols']
      if (allowedCollections.includes(collection)) {
        const tableName = collection === 'clinical-protocols' ? 'clinical_protocols' : collection
        await payload.db.drizzle.execute(`
          UPDATE public."${tableName}"
          SET views = COALESCE(views, 0) + 1
          WHERE slug = '${slug}';
        `).catch(() => {})
      }
    }

    return NextResponse.json({
      success: true,
      online: activeSessions.size,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
