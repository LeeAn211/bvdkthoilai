'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useForm } from '@payloadcms/ui'
import { ParsedSurveyQuestion, parseSurveyFromWorkbook, parseSurveyFromWord } from '@/lib/surveyFileParser'
import { SYSTEM_SURVEY_PRESETS } from '@/lib/surveyTemplatePresets'

export default function SurveyFileImportHelper() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [fileType, setFileType] = useState<'excel' | 'word' | null>(null)
  const [busy, setBusy] = useState(false)
  const [questions, setQuestions] = useState<ParsedSurveyQuestion[] | null>(null)
  const [error, setError] = useState('')
  const [applied, setApplied] = useState(false)

  // Danh sách các đợt khảo sát đã tạo để clone
  const [existingCampaigns, setExistingCampaigns] = useState<Array<{ id: number; title: string; questionsCount: number }>>([])
  // Danh sách các mẫu tự lưu của người quản trị
  const [savedCustomTemplates, setSavedCustomTemplates] = useState<Array<{ id: string; title: string; questionsCount: number; createdAt?: string }>>([])
  const [selectedTemplateSource, setSelectedTemplateSource] = useState<string>('')
  const [loadingTemplate, setLoadingTemplate] = useState(false)

  // State cho popup Lưu mẫu sử dụng lại
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [saveTemplateTitle, setSaveTemplateTitle] = useState('')
  const [saveTemplateDesc, setSaveTemplateDesc] = useState('')
  const [savingTemplate, setSavingTemplate] = useState(false)
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('')

  const { dispatchFields } = useForm()

  // Tải danh sách các đợt khảo sát & các mẫu đã lưu để người dùng lựa chọn clone / sử dụng lại
  const loadTemplatesData = async () => {
    try {
      const res = await fetch('/api/surveys/templates')
      if (res.ok) {
        const data = await res.json()
        if (data.campaigns) {
          setExistingCampaigns(data.campaigns)
        }
        if (data.savedTemplates) {
          setSavedCustomTemplates(data.savedTemplates)
        }
      }
    } catch (err) {
      console.warn('Không thể tải danh sách mẫu khảo sát:', err)
    }
  }

  useEffect(() => {
    loadTemplatesData()
  }, [])

  const handleSelectPresetOrCampaign = async (sourceKey: string) => {
    setSelectedTemplateSource(sourceKey)
    if (!sourceKey) return

    setError('')
    setApplied(false)

    // Trường hợp 1: Chọn mẫu chuẩn hệ thống Bộ Y tế
    if (sourceKey.startsWith('preset:')) {
      const presetId = sourceKey.replace('preset:', '')
      const preset = SYSTEM_SURVEY_PRESETS.find((p) => p.id === presetId)
      if (preset) {
        const mapped: ParsedSurveyQuestion[] = preset.questions.map((q) => ({
          code: q.code,
          type: q.type,
          question: q.question,
          options: q.options || '',
          required: q.required !== false,
          order: q.order || 0,
        }))
        setQuestions(mapped)
        setFileType(null)
        setFile(null)
      }
      return
    }

    // Trường hợp 2: Chọn từ mẫu tự lưu của người quản trị
    if (sourceKey.startsWith('custom:')) {
      const tplId = sourceKey.replace('custom:', '')
      setLoadingTemplate(true)
      try {
        const res = await fetch(`/api/surveys/templates?templateId=${tplId}`)
        const data = await res.json()
        if (!res.ok || !data.ok) {
          throw new Error(data.error || 'Không thể nạp mẫu khảo sát đã lưu.')
        }

        if (!data.questions || data.questions.length === 0) {
          throw new Error('Mẫu này chưa có danh sách câu hỏi.')
        }

        const mapped: ParsedSurveyQuestion[] = data.questions.map((q: any, idx: number) => ({
          code: q.code || `C${idx + 1}`,
          type: q.type || 'rating5',
          question: q.question,
          options: q.options || '',
          required: q.required !== false,
          order: q.order || idx + 1,
        }))

        setQuestions(mapped)
        setFileType(null)
        setFile(null)
      } catch (err: any) {
        console.error('Lỗi khi nạp mẫu tự lưu:', err)
        setError(err.message || 'Không thể nạp mẫu câu hỏi.')
      } finally {
        setLoadingTemplate(false)
      }
      return
    }

    // Trường hợp 3: Chọn từ một đợt khảo sát đã tạo trước đó
    if (sourceKey.startsWith('campaign:')) {
      const campId = sourceKey.replace('campaign:', '')
      setLoadingTemplate(true)
      try {
        const res = await fetch(`/api/surveys/templates?campaignId=${campId}`)
        const data = await res.json()
        if (!res.ok || !data.ok) {
          throw new Error(data.error || 'Không thể lấy dữ liệu câu hỏi của đợt khảo sát đã chọn.')
        }

        if (!data.questions || data.questions.length === 0) {
          throw new Error('Đợt khảo sát này chưa có danh sách câu hỏi để sao chép.')
        }

        const mapped: ParsedSurveyQuestion[] = data.questions.map((q: any, idx: number) => ({
          code: q.code || `C${idx + 1}`,
          type: q.type || 'rating5',
          question: q.question,
          options: q.options || '',
          required: q.required !== false,
          order: q.order || idx + 1,
        }))

        setQuestions(mapped)
        setFileType(null)
        setFile(null)
      } catch (err: any) {
        console.error('Lỗi khi nạp mẫu từ đợt khảo sát cũ:', err)
        setError(err.message || 'Không thể nạp mẫu câu hỏi.')
      } finally {
        setLoadingTemplate(false)
      }
    }
  }

  // Xóa mẫu đã lưu (nếu đã lỗi thời)
  const handleDeleteTemplate = async (templateId: string, templateTitle: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa mẫu "${templateTitle}" không?\nMẫu đã xóa sẽ không thể phục hồi.`)
    if (!confirmDelete) return

    try {
      const res = await fetch(`/api/surveys/templates?id=${templateId}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Không thể xóa mẫu.')
      }
      // Nếu đang chọn chính mẫu vừa xóa thì reset
      if (selectedTemplateSource === `custom:${templateId}`) {
        setSelectedTemplateSource('')
      }
      await loadTemplatesData()
      alert('Đã xóa mẫu khảo sát thành công!')
    } catch (err: any) {
      alert(`Lỗi khi xóa mẫu: ${err.message}`)
    }
  }

  // Lưu danh sách câu hỏi hiện tại thành mẫu mới
  const handleSaveAsTemplate = async () => {
    if (!questions || questions.length === 0) {
      alert('Không có câu hỏi nào để lưu thành mẫu.')
      return
    }
    if (!saveTemplateTitle.trim()) {
      alert('Vui lòng nhập Tên mẫu khảo sát.')
      return
    }

    setSavingTemplate(true)
    try {
      const res = await fetch('/api/surveys/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: saveTemplateTitle,
          description: saveTemplateDesc,
          questions,
        }),
      })
      const text = await res.text()
      let data: any = {}
      try {
        data = text ? JSON.parse(text) : {}
      } catch {
        data = { error: text || 'Phản hồi không hợp lệ từ máy chủ.' }
      }

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Lỗi khi lưu mẫu.')
      }

      setSaveSuccessMsg('Đã lưu mẫu thành công!')
      await loadTemplatesData()
      setTimeout(() => {
        setShowSaveModal(false)
        setSaveTemplateTitle('')
        setSaveTemplateDesc('')
        setSaveSuccessMsg('')
      }, 1200)
    } catch (err: any) {
      alert(`Lỗi: ${err.message}`)
    } finally {
      setSavingTemplate(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null
    setFile(selected)
    setError('')
    setQuestions(null)
    setApplied(false)
    setSelectedTemplateSource('')

    if (selected) {
      const name = selected.name.toLowerCase()
      if (name.endsWith('.xlsx')) {
        setFileType('excel')
      } else if (name.endsWith('.docx')) {
        setFileType('word')
      } else {
        setFileType(null)
        setError('Định dạng file chưa được hỗ trợ. Vui lòng chọn file Excel (.xlsx) hoặc file Word (.docx).')
      }
    } else {
      setFileType(null)
    }
  }

  const handleParse = async () => {
    if (!file || busy) return
    setBusy(true)
    setError('')
    setQuestions(null)
    setApplied(false)

    try {
      const buffer = await file.arrayBuffer()
      let parsed: ParsedSurveyQuestion[] = []

      if (file.name.toLowerCase().endsWith('.docx')) {
        parsed = await parseSurveyFromWord(buffer)
      } else {
        const { Workbook } = await import('exceljs')
        const workbook = new Workbook()
        await workbook.xlsx.load(buffer as any)
        parsed = parseSurveyFromWorkbook(workbook)
      }

      if (!parsed || parsed.length === 0) {
        throw new Error('Không tìm thấy nội dung câu hỏi nào trong file. Vui lòng tải file mẫu để xem hướng dẫn soạn thảo.')
      }

      setQuestions(parsed)
    } catch (err: any) {
      console.error('Lỗi khi đọc file câu hỏi khảo sát:', err)
      setError(err?.message || 'Không thể xử lý file. Vui lòng kiểm tra định dạng nội dung.')
    } finally {
      setBusy(false)
    }
  }

  const handleApply = () => {
    if (!questions || !dispatchFields) return

    // 1. Kích hoạt cờ useCustomQuestions = true
    dispatchFields({
      type: 'UPDATE',
      path: 'useCustomQuestions',
      value: true,
    })

    // 2. Điền mảng câu hỏi customQuestions
    dispatchFields({
      type: 'UPDATE',
      path: 'customQuestions',
      value: questions.map((q, idx) => ({
        code: q.code || `C${idx + 1}`,
        type: q.type || 'rating5',
        question: q.question,
        options: q.options || '',
        required: q.required !== false,
        order: idx + 1,
      })),
    })

    setApplied(true)
  }

  const handleUpdateType = (index: number, newType: 'rating5' | 'rating10' | 'single' | 'multiple' | 'yesno' | 'text') => {
    if (!questions) return
    const updated = [...questions]
    updated[index] = { ...updated[index], type: newType }
    setQuestions(updated)
    setApplied(false)
  }

  const handleToggleRequired = (index: number) => {
    if (!questions) return
    const updated = [...questions]
    updated[index] = { ...updated[index], required: !updated[index].required }
    setQuestions(updated)
    setApplied(false)
  }

  return (
    <div style={{ margin: '14px 0 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* ── KHỐI 1: TÁI SỬ DỤNG MẪU CÓ SẴN HOẶC SAO CHÉP TỪ ĐỢT CŨ ── */}
      <div
        style={{
          padding: '16px 20px',
          border: '1.5px solid #38bdf8',
          borderRadius: 12,
          background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          boxShadow: '0 2px 10px rgba(2, 132, 199, 0.07)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #059669, #0284c7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 22,
                boxShadow: '0 3px 8px rgba(5, 150, 105, 0.25)',
              }}
            >
              🔄
            </div>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 900, letterSpacing: '0.8px', color: '#0369a1', textTransform: 'uppercase' }}>
                CÁCH 1: TÁI SỬ DỤNG MẪU CÓ SẴN HOẶC CLONE TỪ ĐỢT KHẢO SÁT CŨ
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                Nạp nhanh 1-Click: Tiết kiệm tối đa thời gian, không cần tạo lại từ đầu
              </div>
            </div>
          </div>

          {/* Quick buttons: 3 mẫu chuẩn BYT */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleSelectPresetOrCampaign('preset:preset-outpatient')}
              style={{
                padding: '6px 12px',
                borderRadius: 7,
                border: selectedTemplateSource === 'preset:preset-outpatient' ? '2px solid #0284c7' : '1px solid #93c5fd',
                background: selectedTemplateSource === 'preset:preset-outpatient' ? '#e0f2fe' : '#ffffff',
                color: '#0369a1',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              🩺 Ngoại trú (22 câu)
            </button>
            <button
              type="button"
              onClick={() => handleSelectPresetOrCampaign('preset:preset-inpatient')}
              style={{
                padding: '6px 12px',
                borderRadius: 7,
                border: selectedTemplateSource === 'preset:preset-inpatient' ? '2px solid #0284c7' : '1px solid #93c5fd',
                background: selectedTemplateSource === 'preset:preset-inpatient' ? '#e0f2fe' : '#ffffff',
                color: '#0369a1',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              🏥 Nội trú (23 câu)
            </button>
            <button
              type="button"
              onClick={() => handleSelectPresetOrCampaign('preset:preset-staff')}
              style={{
                padding: '6px 12px',
                borderRadius: 7,
                border: selectedTemplateSource === 'preset:preset-staff' ? '2px solid #0284c7' : '1px solid #93c5fd',
                background: selectedTemplateSource === 'preset:preset-staff' ? '#e0f2fe' : '#ffffff',
                color: '#0369a1',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              👨‍⚕️ Nhân viên Y tế (22 câu)
            </button>
          </div>
        </div>

        {/* Danh sách Mẫu do Quản trị viên tự tạo & đã lưu */}
        {savedCustomTemplates.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 10, borderTop: '1px dashed #bae6fd' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12.5, fontWeight: 800, color: '#0369a1' }}>
                💾 Mẫu khảo sát bạn đã lưu ({savedCustomTemplates.length} mẫu):
              </span>
              <span style={{ fontSize: 11, color: '#64748b' }}>
                (Bấm vào tên để nạp câu hỏi, hoặc bấm biểu tượng thùng rác 🗑️ để xóa mẫu lỗi thời)
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {savedCustomTemplates.map((tpl) => {
                const isSelected = selectedTemplateSource === `custom:${tpl.id}`
                return (
                  <div
                    key={tpl.id}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      background: isSelected ? '#ecfdf5' : '#ffffff',
                      border: isSelected ? '2px solid #059669' : '1.5px solid #cbd5e1',
                      borderRadius: 8,
                      overflow: 'hidden',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectPresetOrCampaign(`custom:${tpl.id}`)}
                      style={{
                        padding: '6px 12px',
                        border: 0,
                        background: 'transparent',
                        color: isSelected ? '#047857' : '#1e293b',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                      title="Bấm để nạp mẫu câu hỏi này vào form"
                    >
                      <span>📑 {tpl.title}</span>
                      <span style={{ fontSize: 10.5, padding: '1px 6px', borderRadius: 10, background: isSelected ? '#a7f3d0' : '#e2e8f0', color: '#0f172a' }}>
                        {tpl.questionsCount} câu
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteTemplate(tpl.id, tpl.title, e)}
                      style={{
                        padding: '6px 10px',
                        border: 0,
                        borderLeft: '1px solid #e2e8f0',
                        background: '#fff1f2',
                        color: '#e11d48',
                        fontSize: 12,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title="Xóa mẫu này nếu đã lỗi thời"
                    >
                      🗑️
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Dropdown chọn đợt khảo sát cũ để sao chép */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', paddingTop: 8, borderTop: '1px dashed #bae6fd' }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: '#334155' }}>
            Hoặc sao chép nguyên trạng từ đợt khảo sát đã tạo:
          </span>
          <select
            value={selectedTemplateSource}
            onChange={(e) => handleSelectPresetOrCampaign(e.target.value)}
            disabled={loadingTemplate}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: '1.5px solid #0284c7',
              background: '#fff',
              fontSize: 12.5,
              fontWeight: 600,
              color: '#0f172a',
              minWidth: 280,
              cursor: 'pointer',
            }}
          >
            <option value="">-- Bấm chọn đợt khảo sát cũ để nạp câu hỏi --</option>
            {savedCustomTemplates.length > 0 && (
              <optgroup label="💾 Các Mẫu Do Quản Trị Viên Đã Lưu:">
                {savedCustomTemplates.map((t) => (
                  <option key={t.id} value={`custom:${t.id}`}>
                    📑 {t.title} ({t.questionsCount} câu hỏi)
                  </option>
                ))}
              </optgroup>
            )}
            <optgroup label="📋 Các Mẫu Chuẩn Bộ Y Tế:">
              {SYSTEM_SURVEY_PRESETS.map((p) => (
                <option key={p.id} value={`preset:${p.id}`}>
                  {p.icon} {p.title}
                </option>
              ))}
            </optgroup>
            {existingCampaigns.length > 0 && (
              <optgroup label="📁 Các Đợt Khảo Sát Đã Tạo Trước Đó:">
                {existingCampaigns.map((c) => (
                  <option key={c.id} value={`campaign:${c.id}`}>
                    🔹 #{c.id} - {c.title} ({c.questionsCount} câu hỏi)
                  </option>
                ))}
              </optgroup>
            )}
          </select>
          {loadingTemplate && <span style={{ fontSize: 12, color: '#0284c7', fontWeight: 700 }}>⏳ Đang nạp mẫu...</span>}
        </div>
      </div>

      {/* ── KHỐI 2: TỰ SOẠN MỚI HOẶC IMPORT TỪ FILE WORD / EXCEL ── */}
      <div
        style={{
          padding: '16px 20px',
          border: '1.5px solid #bae6fd',
          borderRadius: 12,
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          boxShadow: '0 2px 8px rgba(2, 132, 199, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 280 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              flexShrink: 0,
              background: 'linear-gradient(135deg, #0284c7, #0369a1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 22,
              boxShadow: '0 3px 8px rgba(2, 132, 199, 0.2)',
            }}
          >
            📋
          </div>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 900, letterSpacing: '0.8px', color: '#0284c7', textTransform: 'uppercase', marginBottom: 2 }}>
              CÁCH 2: TỰ TẠO ĐỢT MỚI TỪ FILE WORD (.DOCX) HOẶC EXCEL (.XLSX)
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>
              Tải file câu hỏi soạn sẵn lên hệ thống để tự động nhận diện
            </div>
            <div style={{ fontSize: 12, color: '#475569' }}>
              Hệ thống tự động nhận diện ô vuông [ ], thang điểm 1-5 sao, thang điểm 1-10 và các câu hỏi trắc nghiệm.
            </div>
          </div>
        </div>

        {/* Action buttons: Tải mẫu Word & Excel */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
          <a
            href="/templates/mau-khao-sat-cau-hoi.docx"
            download="mau-khao-sat-cau-hoi.docx"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 8,
              background: '#2b579a',
              color: '#fff',
              fontSize: 12,
              fontWeight: 800,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 6px rgba(43, 87, 154, 0.25)',
            }}
          >
            📄 Tải file mẫu Word (.docx)
          </a>

          <a
            href="/templates/mau-khao-sat-cau-hoi.xlsx"
            download="mau-khao-sat-cau-hoi.xlsx"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 8,
              background: '#107c41',
              color: '#fff',
              fontSize: 12,
              fontWeight: 800,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 6px rgba(16, 124, 65, 0.25)',
            }}
          >
            📊 Tải file mẫu Excel (.xlsx)
          </a>
        </div>
      </div>

      {/* Khu vực Chọn File & Nút đọc */}
      <div
        style={{
          padding: '12px 18px',
          border: '1.5px dashed #7dd3fc',
          borderRadius: 10,
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 260 }}>
          <span style={{ fontSize: 18 }}>📂</span>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: '#1e293b' }}>
            <b>Upload file câu hỏi</b> (Chọn file <b>.docx</b> của Word hoặc <b>.xlsx</b> của Excel)
          </span>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.docx"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '7px 16px',
            borderRadius: 7,
            border: '1.5px dashed #0284c7',
            background: '#fff',
            color: '#0284c7',
            fontSize: 12,
            fontWeight: 700,
            cursor: 'pointer',
            maxWidth: 260,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {file ? (
            <span>
              {fileType === 'word' ? '📄 Word: ' : '📊 Excel: '}
              {file.name}
            </span>
          ) : (
            'Chọn file Word / Excel từ máy tính'
          )}
        </button>

        <button
          type="button"
          disabled={!file || busy}
          onClick={handleParse}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '7px 18px',
            borderRadius: 7,
            border: 0,
            background: file && !busy ? 'linear-gradient(135deg, #0284c7, #0369a1)' : '#e2e8f0',
            color: file && !busy ? '#fff' : '#94a3b8',
            fontSize: 12,
            fontWeight: 800,
            cursor: file && !busy ? 'pointer' : 'not-allowed',
            whiteSpace: 'nowrap',
            boxShadow: file && !busy ? '0 2px 6px rgba(2, 132, 199, 0.2)' : 'none',
          }}
        >
          {busy ? '⏳ Đang phân tích...' : '🔍 Đọc & Phân tích câu hỏi'}
        </button>
      </div>

      {/* Thông báo Lỗi nếu có */}
      {error && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            color: '#b91c1c',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Preview kết quả bóc tách được từ file HOẶC nạp từ mẫu */}
      {questions && questions.length > 0 && (
        <div style={{ border: '1.5px solid #7dd3fc', borderRadius: 10, overflow: 'hidden', background: '#f0f9ff' }}>
          <div
            style={{
              padding: '12px 16px',
              background: 'linear-gradient(135deg, #0284c7, #0369a1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ color: '#fff' }}>
              <div style={{ fontSize: 13, fontWeight: 800 }}>
                ✅ Đã sẵn sàng danh sách gồm {questions.length} câu hỏi khảo sát!
              </div>
              <div style={{ fontSize: 11, opacity: 0.9 }}>
                Bấm nút <strong>&quot;Nạp danh sách câu hỏi này vào form&quot;</strong> bên phải để áp dụng ngay.
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setShowSaveModal(true)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 7,
                  border: '1.5px solid #0284c7',
                  background: '#f0f9ff',
                  color: '#0284c7',
                  fontSize: 12.5,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                }}
                title="Lưu danh sách câu hỏi này thành Mẫu dùng lại cho các lần khảo sát tiếp theo"
              >
                💾 Lưu thành mẫu cho lần sau
              </button>

              {!applied ? (
                <button
                  type="button"
                  onClick={handleApply}
                  style={{
                    padding: '8px 20px',
                    borderRadius: 7,
                    border: 0,
                    background: '#16a34a',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(22, 163, 74, 0.35)',
                  }}
                >
                  📥 Nạp danh sách câu hỏi này vào form →
                </button>
              ) : (
                <span
                  style={{
                    background: '#dcfce7',
                    color: '#15803d',
                    fontSize: 12,
                    fontWeight: 800,
                    padding: '6px 14px',
                    borderRadius: 6,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  }}
                >
                  ✓ Đã điền xong vào danh sách câu hỏi!
                </span>
              )}
            </div>
          </div>

          <div style={{ maxHeight: 280, overflowY: 'auto', padding: '10px 14px', fontSize: 11.5, background: '#fff' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid #bae6fd', textAlign: 'left', color: '#0369a1', fontWeight: 800 }}>
                  <th style={{ padding: '6px 8px', width: 60 }}>Mã</th>
                  <th style={{ padding: '6px 8px', width: 140 }}>Loại</th>
                  <th style={{ padding: '6px 8px' }}>Nội dung câu hỏi</th>
                  <th style={{ padding: '6px 8px', width: 220 }}>Đáp án con</th>
                  <th style={{ padding: '6px 8px', width: 70, textAlign: 'center' }}>Bắt buộc</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '6px 8px', fontWeight: 700, color: '#0284c7' }}>{q.code}</td>
                    <td style={{ padding: '6px 8px', color: '#334155' }}>
                      <select
                        value={q.type}
                        onChange={(e) => handleUpdateType(idx, e.target.value as any)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: 6,
                          border: '1.5px solid #0284c7',
                          background: '#f0f9ff',
                          fontSize: 11.5,
                          fontWeight: 700,
                          color: '#0369a1',
                          cursor: 'pointer',
                          outline: 'none',
                        }}
                        title="Bấm để thay đổi hình thức câu hỏi theo ý muốn"
                      >
                        <option value="rating5">⭐ 1-5 Sao / Mức độ hài lòng</option>
                        <option value="rating10">🎯 Thang điểm 1-10</option>
                        <option value="single">🔘 Trắc nghiệm chọn 1 đáp án</option>
                        <option value="multiple">☑️ Chọn nhiều đáp án</option>
                        <option value="yesno">⚖️ Đúng / Sai (Có / Không)</option>
                        <option value="text">✍️ Ý kiến tự do (Nhập chữ)</option>
                      </select>
                    </td>
                    <td style={{ padding: '6px 8px', fontWeight: 600, color: '#0f172a' }}>{q.question}</td>
                    <td style={{ padding: '6px 8px', color: '#64748b', fontSize: 11 }}>
                      {q.options ? (
                        <div style={{ whiteSpace: 'pre-line', lineHeight: 1.3 }}>
                          {q.options.split('\n').map((opt, oIdx) => (
                            <div key={oIdx}>• {opt}</div>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: '#cbd5e1' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleToggleRequired(idx)}
                        style={{
                          background: q.required ? '#dcfce7' : '#f1f5f9',
                          border: `1px solid ${q.required ? '#86efac' : '#cbd5e1'}`,
                          color: q.required ? '#16a34a' : '#64748b',
                          padding: '3px 8px',
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                        title="Bấm để bật/tắt tính bắt buộc"
                      >
                        {q.required ? '✓ Bắt buộc' : 'Tùy chọn'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL LƯU MẪU SỬ DỤNG LẠI */}
      {showSaveModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: 16,
          }}
          onClick={() => !savingTemplate && setShowSaveModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 14,
              padding: '24px 28px',
              maxWidth: 520,
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              border: '1.5px solid #38bdf8',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>💾</span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
                  Lưu mẫu khảo sát cho lần sau
                </div>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  Mẫu này sẽ được lưu trữ và hiển thị tại danh sách mẫu dùng lại để áp dụng nhanh cho các đợt tiếp theo.
                </div>
              </div>
            </div>

            {saveSuccessMsg ? (
              <div
                style={{
                  padding: '16px',
                  borderRadius: 8,
                  background: '#dcfce7',
                  border: '1.5px solid #86efac',
                  color: '#15803d',
                  fontSize: 14,
                  fontWeight: 700,
                  textAlign: 'center',
                }}
              >
                🎉 {saveSuccessMsg}
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#1e293b' }}>
                    Tên mẫu khảo sát <span style={{ color: '#e11d48' }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Mẫu khảo sát nhanh Khoa Cấp Cứu 2026..."
                    value={saveTemplateTitle}
                    onChange={(e) => setSaveTemplateTitle(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1.5px solid #cbd5e1',
                      fontSize: 13,
                      outline: 'none',
                    }}
                    autoFocus
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 700, color: '#1e293b' }}>
                    Ghi chú / Mô tả ngắn (không bắt buộc)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ghi chú về đối tượng hoặc mục đích của mẫu câu hỏi này..."
                    value={saveTemplateDesc}
                    onChange={(e) => setSaveTemplateDesc(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 8,
                      border: '1.5px solid #cbd5e1',
                      fontSize: 13,
                      outline: 'none',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <div style={{ fontSize: 11.5, color: '#475569', background: '#f8fafc', padding: '8px 12px', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                  ℹ️ Mẫu sẽ lưu toàn bộ <b>{questions?.length || 0} câu hỏi</b> hiện tại bao gồm cả các loại câu hỏi và tùy chọn trả lời.
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
                  <button
                    type="button"
                    disabled={savingTemplate}
                    onClick={() => setShowSaveModal(false)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 7,
                      border: '1px solid #cbd5e1',
                      background: '#fff',
                      color: '#475569',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    disabled={savingTemplate || !saveTemplateTitle.trim()}
                    onClick={handleSaveAsTemplate}
                    style={{
                      padding: '8px 20px',
                      borderRadius: 7,
                      border: 0,
                      background: savingTemplate || !saveTemplateTitle.trim() ? '#94a3b8' : 'linear-gradient(135deg, #0284c7, #0369a1)',
                      color: '#fff',
                      fontSize: 13,
                      fontWeight: 800,
                      cursor: savingTemplate || !saveTemplateTitle.trim() ? 'not-allowed' : 'pointer',
                      boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)',
                    }}
                  >
                    {savingTemplate ? '⏳ Đang lưu...' : '💾 Lưu mẫu ngay'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
