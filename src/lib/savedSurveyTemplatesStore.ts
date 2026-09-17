import fs from 'fs'
import path from 'path'

export interface SavedSurveyTemplate {
  id: string
  title: string
  description?: string
  createdAt: string
  questions: Array<{
    code: string
    type: string
    question: string
    options?: string
    required?: boolean
    order?: number
  }>
}

const DATA_DIR = path.join(process.cwd(), 'src', 'data')
const FILE_PATH = path.join(DATA_DIR, 'savedSurveyTemplates.json')

function ensureDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

export function getSavedSurveyTemplates(): SavedSurveyTemplate[] {
  try {
    ensureDirectory()
    if (!fs.existsSync(FILE_PATH)) {
      return []
    }
    const raw = fs.readFileSync(FILE_PATH, 'utf-8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error('Lỗi khi đọc file savedSurveyTemplates.json:', error)
    return []
  }
}

export function saveSurveyTemplate(data: {
  title: string
  description?: string
  questions: any[]
}): SavedSurveyTemplate {
  ensureDirectory()
  const templates = getSavedSurveyTemplates()
  const newTemplate: SavedSurveyTemplate = {
    id: `custom-tpl-${Date.now()}`,
    title: data.title.trim(),
    description: data.description?.trim() || '',
    createdAt: new Date().toISOString(),
    questions: data.questions || [],
  }

  templates.unshift(newTemplate)
  fs.writeFileSync(FILE_PATH, JSON.stringify(templates, null, 2), 'utf-8')
  return newTemplate
}

export function deleteSavedSurveyTemplate(id: string): boolean {
  ensureDirectory()
  const templates = getSavedSurveyTemplates()
  const filtered = templates.filter((t) => t.id !== id)
  if (filtered.length === templates.length) {
    return false
  }
  fs.writeFileSync(FILE_PATH, JSON.stringify(filtered, null, 2), 'utf-8')
  return true
}
