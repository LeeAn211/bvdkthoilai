import JSZip from 'jszip'
import type { Workbook } from 'exceljs'

export interface ParsedSurveyQuestion {
  code: string
  question: string
  type: 'rating5' | 'rating10' | 'single' | 'multiple' | 'yesno' | 'text'
  options?: string
  required: boolean
  order: number
}

/**
 * Suy đoán kiểu câu hỏi dựa vào nội dung và danh sách đáp án
 */
/**
 * Suy đoán kiểu câu hỏi dựa vào nội dung và danh sách đáp án
 */
function inferQuestionType(
  rawType: string,
  questionText: string,
  optionsText: string
): 'rating5' | 'rating10' | 'single' | 'multiple' | 'yesno' | 'text' {
  const normType = rawType.trim().toLowerCase()
  if (normType.includes('5') || normType.includes('sao') || normType.includes('rating5')) return 'rating5'
  if (normType.includes('10') || normType.includes('rating10')) return 'rating10'
  if (normType.includes('nhiều') || normType.includes('checkbox') || normType.includes('multiple')) return 'multiple'
  if (normType.includes('1') || normType.includes('đơn') || normType.includes('radio') || normType.includes('single')) return 'single'
  if (normType.includes('đúng') || normType.includes('sai') || normType.includes('yesno') || normType.includes('có/không')) return 'yesno'
  if (normType.includes('chữ') || normType.includes('văn bản') || normType.includes('ý kiến') || normType.includes('text')) return 'text'

  const qLower = questionText.toLowerCase()

  // Kiểm tra nếu danh sách options chứa các mức hài lòng kinh điển
  if (optionsText.trim()) {
    const optLower = optionsText.toLowerCase()
    const isSatisfactionScale =
      (optLower.includes('rất hài lòng') && optLower.includes('hài lòng')) ||
      (optLower.includes('chưa hài lòng') || optLower.includes('không hài lòng')) ||
      (optLower.includes('rất tốt') && optLower.includes('tốt'))
    if (isSatisfactionScale) {
      return 'rating5'
    }

    // Nếu trong câu hỏi có từ khóa "nhiều lựa chọn", "các khoa", "những"
    if (qLower.includes('nhiều') || qLower.includes('các') || qLower.includes('những')) {
      return 'multiple'
    }

    return 'single'
  }

  if (
    qLower.includes('ý kiến') ||
    qLower.includes('góp ý') ||
    qLower.includes('đề xuất') ||
    qLower.includes('kiến nghị') ||
    qLower.includes('lý do') ||
    qLower.includes('cải thiện điều gì') ||
    qLower.includes('điều gì') ||
    qLower.includes('lời cảm ơn') ||
    qLower.includes('hài lòng nhất') ||
    qLower.includes('như thế nào')
  ) {
    return 'text'
  }
  if (qLower.includes('điểm từ 1 đến 10') || qLower.includes('thang điểm 10') || qLower.includes('thang 10')) {
    return 'rating10'
  }
  if (qLower.includes('có hoặc không') || qLower.includes('đúng hay sai')) {
    return 'yesno'
  }
  // Mặc định cho khảo sát bệnh viện: mức độ hài lòng 5 mức
  return 'rating5'
}

/**
 * Tách các lựa chọn (options) từ một dòng văn bản
 * Hỗ trợ các ký tự ô vuông: ☐, ☑, ☒, □, ■, [ ], ( )
 * hoặc phân tách bằng dấu tab \t, nhiều dấu cách
 */
function extractInlineOptions(line: string): string[] {
  const checkboxPattern = /[☐☑☒□■]|\[\s*\]|\(\s*\)/g
  if (checkboxPattern.test(line)) {
    // Cắt chuỗi theo các mốc checkbox
    const parts = line.split(checkboxPattern).map((s) => s.trim()).filter(Boolean)
    if (parts.length > 0) {
      return parts
    }
  }

  // Phân tách bởi tab hoặc 3+ dấu cách nếu các phần trông như đáp án
  if (line.includes('\t') || /\s{3,}/.test(line)) {
    const parts = line.split(/\t+|\s{3,}/).map((s) => s.trim()).filter(Boolean)
    if (parts.length >= 2) {
      return parts
    }
  }

  return []
}

/**
 * Kiểm tra xem một dòng có phải là dòng chấm chấm (viết tay / text area)
 */
function isDottedLine(line: string): boolean {
  const cleaned = line.replace(/[\s\.\_\-]+/g, '')
  return cleaned.length === 0 && (/[\.]{3,}/.test(line) || /[_\-]{3,}/.test(line))
}

/**
 * 1. BÓC TÁCH FILE EXCEL (.XLSX)
 * Hỗ trợ các cột linh hoạt:
 * - Cột Mã: "Mã", "Mã câu", "STT", "Code"
 * - Cột Câu hỏi: "Câu hỏi", "Nội dung câu hỏi", "Nội dung", "Question"
 * - Cột Loại: "Loại câu hỏi", "Loại", "Hình thức", "Type"
 * - Cột Đáp án: "Lựa chọn", "Đáp án", "Các lựa chọn", "Options"
 * - Cột Bắt buộc: "Bắt buộc", "Required"
 */
export function parseSurveyFromWorkbook(workbook: Workbook): ParsedSurveyQuestion[] {
  const worksheet = workbook.worksheets[0]
  if (!worksheet) return []

  // Tìm dòng tiêu đề (header)
  let headerRowIndex = -1
  let colCode = -1
  let colQuestion = -1
  let colType = -1
  let colOptions = -1
  let colRequired = -1

  worksheet.eachRow((row, rowNumber) => {
    if (headerRowIndex !== -1) return

    for (let c = 1; c <= Math.max(row.cellCount, 10); c++) {
      const val = row.getCell(c).text?.trim()
      if (!val) continue
      const s = val.toLowerCase()
      if (s === 'mã' || s === 'mã câu' || s === 'stt' || s === 'code') {
        colCode = c
      } else if (s.includes('loại') || s.includes('hình thức') || s === 'type') {
        colType = c
      } else if (s.includes('câu hỏi') || s.includes('nội dung') || s === 'question') {
        colQuestion = c
      } else if (s.includes('lựa chọn') || s.includes('đáp án') || s.includes('options')) {
        colOptions = c
      } else if (s.includes('bắt buộc') || s === 'required') {
        colRequired = c
      }
    }

    if (colQuestion !== -1) {
      headerRowIndex = rowNumber
    }
  })

  // Nếu không tìm thấy header rõ ràng, mặc định cột A=Code, B=Question, C=Type, D=Options, E=Required
  if (headerRowIndex === -1) {
    headerRowIndex = 1
    colCode = 1
    colQuestion = 2
    colType = 3
    colOptions = 4
    colRequired = 5
  }

  const results: ParsedSurveyQuestion[] = []
  let autoIndex = 1

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber <= headerRowIndex) return

    let qVal = colQuestion !== -1 ? row.getCell(colQuestion).text?.trim() : ''
    if (!qVal) return

    // Làm sạch dòng chấm chấm thừa trong câu hỏi nếu có
    qVal = qVal.replace(/[\.]{3,}/g, '').trim()

    let codeVal = colCode !== -1 ? row.getCell(colCode).text?.trim() : ''
    if (!codeVal) {
      codeVal = `C${autoIndex}`
    }

    const typeVal = colType !== -1 ? row.getCell(colType).text?.trim() : ''
    let optionsVal = colOptions !== -1 ? row.getCell(colOptions).text?.trim() : ''

    // Tách options nếu chứa ô vuông hoặc dấu ;
    if (optionsVal) {
      const inlineOpts = extractInlineOptions(optionsVal)
      if (inlineOpts.length > 0) {
        optionsVal = inlineOpts.join('\n')
      } else if (optionsVal.includes(';') && !optionsVal.includes('\n')) {
        optionsVal = optionsVal.split(';').map((s) => s.trim()).filter(Boolean).join('\n')
      }
    }

    const reqVal = colRequired !== -1 ? row.getCell(colRequired).text?.trim().toLowerCase() : ''
    const isRequired = reqVal === 'không' || reqVal === 'false' || reqVal === '0' || reqVal === 'no' ? false : true

    const finalType = inferQuestionType(typeVal, qVal, optionsVal)

    results.push({
      code: codeVal,
      question: qVal,
      type: finalType,
      options: optionsVal || undefined,
      required: isRequired,
      order: autoIndex,
    })

    autoIndex++
  })

  return results
}

/**
 * 2. BÓC TÁCH FILE WORD (.DOCX)
 * Sử dụng JSZip đọc trực tiếp word/document.xml.
 * Hỗ trợ nhận diện thông minh:
 * - Các dòng câu hỏi: "Câu 1: ...", "1. ...", "C1: ...", "Câu hỏi 1: ..."
 * - Các lựa chọn dạng ô vuông inline: "☐ Khám ngoại trú    ☐ Cấp cứu"
 * - Các dòng đáp án con: "- ...", "+ ...", "• ...", "a) ...", "A. ..."
 * - Các dòng chấm chấm viết tay: "......" -> tự động chuyển sang câu trả lời dạng chữ (text)
 */
export async function parseSurveyFromWord(arrayBuffer: ArrayBuffer): Promise<ParsedSurveyQuestion[]> {
  const zip = await JSZip.loadAsync(arrayBuffer)
  const docXmlFile = zip.file('word/document.xml')
  if (!docXmlFile) {
    throw new Error('File không hợp lệ hoặc không phải định dạng Word .docx chuẩn.')
  }

  const xmlContent = await docXmlFile.async('text')

  // Bóc tách toàn bộ đoạn văn bản <w:p>
  const paragraphRegex = /<w:p(?:\s[^>]*)?>([\s\S]*?)<\/w:p>/gi
  const textRegex = /<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/gi

  const lines: string[] = []
  let pMatch: RegExpExecArray | null

  while ((pMatch = paragraphRegex.exec(xmlContent)) !== null) {
    const pContent = pMatch[1]
    let line = ''
    let tMatch: RegExpExecArray | null
    while ((tMatch = textRegex.exec(pContent)) !== null) {
      line += tMatch[1]
    }
    const cleanLine = line.trim()
    if (cleanLine) {
      lines.push(cleanLine)
    }
  }

  if (lines.length === 0) {
    throw new Error('Không tìm thấy nội dung văn bản nào trong file Word.')
  }

  const results: ParsedSurveyQuestion[] = []
  let currentQuestion: {
    code: string
    question: string
    type?: string
    options: string[]
    required: boolean
    hasDottedLines?: boolean
  } | null = null

  let autoNum = 1

  // Regex nhận diện dòng là câu hỏi
  // VD: "Câu 1:", "Câu 01.", "C1.", "1.", "1/", "1 -", "[C1]"
  const questionHeaderRegex = /^(?:câu\s*(\d+|[a-z0-9_]+)[:\.\-]?|c(\d+)[:\.\-]?|(\d+)[\.\)\/:\-]|\[([^\]]+)\])\s*(.*)$/i

  // Regex nhận diện dòng là lựa chọn / đáp án con
  // VD: "a)", "A.", "b.", "- ", "* ", "+ ", "• ", "[ ]", "( )", "☐", "□"
  const optionPrefixRegex = /^(?:[a-dA-D][\.\)]|[\-\+\*\•■□\(\)\[\]☐☑☒])\s*(.*)$/

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) continue

    // Kiểm tra nếu là dòng chấm chấm (khu vực điền tay)
    if (isDottedLine(line)) {
      if (currentQuestion) {
        currentQuestion.hasDottedLines = true
        currentQuestion.type = 'text'
      }
      continue
    }

    // Bỏ qua các dòng lời chào/tiêu đề chung tài liệu nếu ở đầu
    if (results.length === 0 && !currentQuestion) {
      const lower = line.toLowerCase()
      if (
        (lower.includes('phiếu') ||
          lower.includes('khảo sát') ||
          lower.includes('bệnh viện') ||
          lower.includes('cảm ơn') ||
          lower.includes('kính gửi') ||
          lower.includes('cộng hòa xã hội')) &&
        !questionHeaderRegex.test(line)
      ) {
        continue
      }
    }

    const qMatch = line.match(questionHeaderRegex)
    if (qMatch) {
      // Lưu câu hỏi trước đó nếu có
      if (currentQuestion) {
        const optStr = currentQuestion.options.join('\n')
        let qType = currentQuestion.type || ''
        if (currentQuestion.hasDottedLines && !optStr) {
          qType = 'text'
        }
        results.push({
          code: currentQuestion.code,
          question: currentQuestion.question.replace(/[\.]{3,}/g, '').trim(),
          type: inferQuestionType(qType, currentQuestion.question, optStr),
          options: optStr || undefined,
          required: currentQuestion.required,
          order: results.length + 1,
        })
      }

      // Lấy mã câu
      const detectedCode = qMatch[1] || qMatch[2] || qMatch[3] || qMatch[4] || String(autoNum)
      const code = detectedCode.toUpperCase().startsWith('C') ? detectedCode.toUpperCase() : `C${detectedCode}`
      let questionText = qMatch[5]?.trim() || ''

      // Kiểm tra xem trong ngoặc có chỉ định loại không: [5 sao], [10 điểm], [chọn 1], [ý kiến]
      let detectedType = ''
      const typeBracketMatch = questionText.match(/\[(.*?)\]|\((.*?)\)/)
      if (typeBracketMatch) {
        const typeHint = (typeBracketMatch[1] || typeBracketMatch[2] || '').toLowerCase()
        if (typeHint.includes('sao') || typeHint.includes('5')) detectedType = 'rating5'
        else if (typeHint.includes('10')) detectedType = 'rating10'
        else if (typeHint.includes('nhiều')) detectedType = 'multiple'
        else if (typeHint.includes('chọn 1') || typeHint.includes('1 đáp án') || typeHint.includes('radio')) detectedType = 'single'
        else if (typeHint.includes('ý kiến') || typeHint.includes('tự do') || typeHint.includes('text')) detectedType = 'text'
        else if (typeHint.includes('đúng') || typeHint.includes('có/không') || typeHint.includes('yesno')) detectedType = 'yesno'

        if (detectedType) {
          questionText = questionText.replace(typeBracketMatch[0], '').trim()
        }
      }

      // Kiểm tra xem dòng tiêu đề câu hỏi có dính kèm luôn các options inline không (vd: 1. Câu hỏi: ☐ A ☐ B)
      const inlineOpts = extractInlineOptions(questionText)
      let initialOptions: string[] = []
      if (inlineOpts.length > 1) {
        // Phần đầu tiên trước checkbox là tiêu đề câu hỏi
        const firstCheckboxIdx = questionText.search(/[☐☑☒□■]|\[\s*\]|\(\s*\)/)
        if (firstCheckboxIdx !== -1) {
          const actualQ = questionText.slice(0, firstCheckboxIdx).replace(/[:\.\-]$/, '').trim()
          if (actualQ) {
            questionText = actualQ
            initialOptions = inlineOpts
          }
        }
      }

      currentQuestion = {
        code: code,
        question: questionText || line,
        type: detectedType,
        options: initialOptions,
        required: true,
        hasDottedLines: false,
      }
      autoNum++
      continue
    }

    // Nếu đang trong một câu hỏi
    if (currentQuestion) {
      // 1. Kiểm tra xem dòng có chứa nhiều options dạng checkbox inline không: ☐ Option 1   ☐ Option 2
      const inlineOpts = extractInlineOptions(line)
      if (inlineOpts.length > 0) {
        currentQuestion.options.push(...inlineOpts)
        continue
      }

      // 2. Kiểm tra xem có tiền tố bullet đơn lẻ không (-, *, +, a), A., ☐, □)
      const optMatch = line.match(optionPrefixRegex)
      if (optMatch && optMatch[1]?.trim()) {
        currentQuestion.options.push(optMatch[1].trim())
      } else {
        // Nếu không có dấu gạch/bullet nhưng câu trước đó đã có options rồi, hoặc dòng ngắn dạng lựa chọn
        if (currentQuestion.options.length > 0) {
          currentQuestion.options.push(line)
        } else {
          // Nối tiếp vào nội dung câu hỏi
          currentQuestion.question += ' ' + line
        }
      }
    }
  }

  // Đẩy câu hỏi cuối cùng
  if (currentQuestion) {
    const optStr = currentQuestion.options.join('\n')
    let qType = currentQuestion.type || ''
    if (currentQuestion.hasDottedLines && !optStr) {
      qType = 'text'
    }
    results.push({
      code: currentQuestion.code,
      question: currentQuestion.question.replace(/[\.]{3,}/g, '').trim(),
      type: inferQuestionType(qType, currentQuestion.question, optStr),
      options: optStr || undefined,
      required: currentQuestion.required,
      order: results.length + 1,
    })
  }

  return results
}
