import { NextResponse } from 'next/server'
import { getCMS } from '@/lib/payload'
import { SYSTEM_SURVEY_PRESETS } from '@/lib/surveyTemplatePresets'
import {
  getSavedSurveyTemplates,
  saveSurveyTemplate,
  deleteSavedSurveyTemplate,
} from '@/lib/savedSurveyTemplatesStore'

export async function GET(request: Request) {
  try {
    const payload = await getCMS()
    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get('campaignId')
    const templateId = searchParams.get('templateId')

    // 1. Lấy chi tiết mẫu do người dùng tự lưu
    if (templateId) {
      const savedTemplates = getSavedSurveyTemplates()
      const found = savedTemplates.find((t) => t.id === templateId)
      if (!found) {
        return NextResponse.json({ error: 'Không tìm thấy mẫu khảo sát đã lưu.' }, { status: 404 })
      }
      return NextResponse.json({
        ok: true,
        template: found,
        questions: found.questions,
      })
    }

    // 2. Nếu truyền campaignId cụ thể -> trả về chi tiết danh sách câu hỏi của campaign đó để clone
    if (campaignId) {
      const camp = await payload.findByID({
        collection: 'survey-campaigns',
        id: Number(campaignId),
        depth: 2,
        overrideAccess: true,
      })

      if (!camp) {
        return NextResponse.json({ error: 'Không tìm thấy đợt khảo sát.' }, { status: 404 })
      }

      let questions: any[] = []
      if (camp.useCustomQuestions && Array.isArray(camp.customQuestions) && camp.customQuestions.length > 0) {
        questions = camp.customQuestions.map((cq: any, idx: number) => ({
          code: cq.code || `C${idx + 1}`,
          type: cq.type || 'rating5',
          question: cq.question,
          options: cq.options || '',
          required: cq.required !== false,
          order: cq.order || idx + 1,
        }))
      } else if (camp.templateVersion && typeof camp.templateVersion === 'object') {
        const v: any = camp.templateVersion
        questions = (v.questions || []).map((q: any, idx: number) => ({
          code: q.code || `C${idx + 1}`,
          type: q.type || 'rating5',
          question: q.question,
          options: q.options || '',
          required: q.required !== false,
          order: q.order || idx + 1,
        }))
      }

      return NextResponse.json({
        ok: true,
        campaign: {
          id: camp.id,
          title: camp.title,
          publicNote: camp.publicNote,
          showDemographics: camp.showDemographics,
          customOptions: camp.customOptions,
        },
        questions,
      })
    }

    // 3. Lấy danh sách các đợt khảo sát đã có trong hệ thống
    const campaignsResult = await payload.find({
      collection: 'survey-campaigns',
      limit: 100,
      sort: 'id',
      overrideAccess: true,
    })

    const campaigns = campaignsResult.docs.map((c: any) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      active: c.active,
      questionsCount: Array.isArray(c.customQuestions) ? c.customQuestions.length : 0,
      createdAt: c.createdAt,
    }))

    // 4. Lấy danh sách các mẫu tự lưu của người quản trị
    const savedTemplates = getSavedSurveyTemplates()

    return NextResponse.json({
      ok: true,
      presets: SYSTEM_SURVEY_PRESETS.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        type: p.type,
        icon: p.icon,
        questionsCount: p.questions.length,
      })),
      savedTemplates: savedTemplates.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        createdAt: t.createdAt,
        questionsCount: t.questions.length,
      })),
      campaigns,
    })
  } catch (error: any) {
    console.error('API SURVEY TEMPLATES ERROR:', error)
    return NextResponse.json({ error: error?.message || 'Lỗi xử lý danh sách mẫu khảo sát.' }, { status: 500 })
  }
}

// POST: Lưu mẫu khảo sát tái sử dụng mới
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, questions } = body

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Vui lòng nhập tên cho mẫu khảo sát.' }, { status: 400 })
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: 'Danh sách câu hỏi không được để trống.' }, { status: 400 })
    }

    const saved = saveSurveyTemplate({
      title,
      description,
      questions,
    })

    return NextResponse.json({
      ok: true,
      message: 'Lưu mẫu khảo sát tái sử dụng thành công.',
      template: saved,
    })
  } catch (error: any) {
    console.error('API SURVEY TEMPLATES POST ERROR:', error)
    return NextResponse.json({ error: error?.message || 'Lỗi khi lưu mẫu khảo sát.' }, { status: 500 })
  }
}

// DELETE: Xóa mẫu khảo sát đã lỗi thời
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Thiếu mã mẫu cần xóa.' }, { status: 400 })
    }

    const success = deleteSavedSurveyTemplate(id)
    if (!success) {
      return NextResponse.json({ error: 'Không tìm thấy mẫu hoặc mẫu đã bị xóa trước đó.' }, { status: 404 })
    }

    return NextResponse.json({
      ok: true,
      message: 'Đã xóa mẫu khảo sát thành công.',
    })
  } catch (error: any) {
    console.error('API SURVEY TEMPLATES DELETE ERROR:', error)
    return NextResponse.json({ error: error?.message || 'Lỗi khi xóa mẫu khảo sát.' }, { status: 500 })
  }
}
