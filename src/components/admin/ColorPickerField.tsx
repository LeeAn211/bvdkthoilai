'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useField } from '@payloadcms/ui'

// Bảng màu gợi ý nhanh (preset palette)
const PRESET_COLORS = [
  // Xanh dương / brand
  '#0878D1', '#064A83', '#1E40AF', '#1D4ED8', '#3B82F6', '#60A5FA', '#93C5FD',
  // Xanh lá
  '#15803D', '#16A34A', '#22C55E', '#4ADE80', '#86EFAC',
  // Đỏ / cam / vàng
  '#B91C1C', '#DC2626', '#EF4444', '#F97316', '#FB923C', '#FBBF24', '#FCD34D',
  // Tím / hồng
  '#7C3AED', '#8B5CF6', '#A78BFA', '#EC4899', '#F472B6',
  // Neutral / xám trắng đen
  '#FFFFFF', '#F8FAFC', '#F1F5F9', '#E2E8F0', '#CBD5E1', '#94A3B8',
  '#64748B', '#475569', '#334155', '#1E293B', '#0F172A', '#000000',
  // Pastel / đặc biệt
  '#EFFBF3', '#EFF6FF', '#FEF9C3', '#FFF7ED', '#FDF2F8',
]

// ColorPickerField: custom Field component cho Payload v3
// Được dùng bởi: admin.components.Field trong field definition
// Props theo chuẩn Payload v3 TextFieldClientComponent
export default function ColorPickerField(props: any) {
  const { path, label, readOnly, required } = props

  const { value, setValue } = useField<string>({ path })
  const [inputVal, setInputVal] = useState<string>((value as string) || '')
  const [showPicker, setShowPicker] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Sync từ ngoài vào
  useEffect(() => {
    setInputVal((value as string) || '')
  }, [value])

  // Đóng picker khi click ngoài
  useEffect(() => {
    if (!showPicker) return
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node) &&
          containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowPicker(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showPicker])

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setInputVal(v)
    setValue(v || null)
  }, [setValue])

  const handleNativeColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setInputVal(v)
    setValue(v)
    setShowPicker(false)
  }, [setValue])

  const handlePresetClick = useCallback((color: string) => {
    setInputVal(color)
    setValue(color)
    setShowPicker(false)
  }, [setValue])

  const handleClear = useCallback(() => {
    setInputVal('')
    setValue(null)
  }, [setValue])

  const currentVal = inputVal || ''
  const isValidHex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(currentVal)
  const isValidColor = /^(#[0-9a-fA-F]{3,8}|rgba?\(|hsla?\(|[a-z]+)/.test(currentVal)
  const previewColor = isValidColor ? currentVal : 'transparent'

  return (
    <div
      ref={containerRef}
      style={{ marginBottom: '12px', position: 'relative' }}
      className="field-type color-picker-field"
    >
      {/* Label */}
      {label && (
        <label
          htmlFor={`field-${path?.replace(/\./g, '__')}`}
          style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--theme-text, #334155)',
            marginBottom: '6px',
          }}
        >
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: '3px' }}>*</span>}
        </label>
      )}

      {/* Input row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Color swatch - clicks to open picker */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div
            onClick={() => !readOnly && setShowPicker((p) => !p)}
            title="Mở bảng màu"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: '2px solid var(--theme-border-color, #e2e8f0)',
              background: isValidColor
                ? previewColor
                : 'repeating-conic-gradient(#ddd 0% 25%, #fff 0% 50%) 0 0 / 10px 10px',
              cursor: readOnly ? 'default' : 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'transform 0.15s',
            }}
            aria-label="Swatch màu"
          />
          {/* Native color input (for hex picker) */}
          {!readOnly && (
            <input
              type="color"
              value={isValidHex ? currentVal : '#000000'}
              onChange={handleNativeColorChange}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0,
                width: '100%',
                height: '100%',
                cursor: 'pointer',
                padding: 0,
                border: 'none',
              }}
              title="Bộ chọn màu hệ thống"
            />
          )}
        </div>

        {/* Text input */}
        <input
          id={`field-${path?.replace(/\./g, '__')}`}
          type="text"
          value={currentVal}
          onChange={handleTextChange}
          readOnly={readOnly}
          placeholder="#rrggbb"
          style={{
            flex: 1,
            height: '36px',
            padding: '0 10px',
            borderRadius: '8px',
            border: `2px solid ${currentVal && !isValidColor ? '#ef4444' : 'var(--theme-border-color, #e2e8f0)'}`,
            fontSize: '13px',
            fontFamily: 'monospace',
            color: 'var(--theme-text, #1e293b)',
            background: 'var(--theme-input-bg, #fff)',
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
        />

        {/* Palette button */}
        {!readOnly && (
          <button
            type="button"
            onClick={() => setShowPicker((p) => !p)}
            title="Bảng màu gợi ý"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: '2px solid var(--theme-border-color, #e2e8f0)',
              background: showPicker ? 'var(--theme-elevation-50, #f1f5f9)' : 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              flexShrink: 0,
              transition: 'background 0.15s',
            }}
          >
            🎨
          </button>
        )}

        {/* Clear */}
        {currentVal && !readOnly && (
          <button
            type="button"
            onClick={handleClear}
            title="Xóa màu"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              border: '1px solid var(--theme-border-color, #e2e8f0)',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '13px',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Preset palette dropdown */}
      {showPicker && !readOnly && (
        <div
          ref={pickerRef}
          style={{
            position: 'absolute',
            zIndex: 9999,
            marginTop: '6px',
            left: 0,
            background: 'var(--theme-elevation-0, #fff)',
            border: '1px solid var(--theme-border-color, #e2e8f0)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            padding: '14px',
            width: '262px',
          }}
        >
          <div style={{
            fontSize: '11px',
            fontWeight: '700',
            color: '#94a3b8',
            marginBottom: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            Màu gợi ý nhanh
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '5px',
          }}>
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                title={color}
                onClick={() => handlePresetClick(color)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '5px',
                  border: currentVal.toUpperCase() === color.toUpperCase()
                    ? '2px solid #0878d1'
                    : '1.5px solid rgba(0,0,0,0.12)',
                  background: color,
                  cursor: 'pointer',
                  transition: 'transform 0.1s',
                  boxShadow: currentVal.toUpperCase() === color.toUpperCase()
                    ? '0 0 0 2px #60a5fa'
                    : 'none',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.18)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
              />
            ))}
          </div>
          <div style={{
            borderTop: '1px solid var(--theme-border-color, #e2e8f0)',
            marginTop: '10px',
            paddingTop: '10px',
          }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Chọn từ bộ màu hệ thống
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="color"
                value={isValidHex ? currentVal : '#000000'}
                onChange={(e) => {
                  setInputVal(e.target.value)
                  setValue(e.target.value)
                }}
                style={{
                  width: '40px',
                  height: '34px',
                  padding: '2px',
                  borderRadius: '6px',
                  border: '1.5px solid var(--theme-border-color, #e2e8f0)',
                  cursor: 'pointer',
                  background: 'transparent',
                }}
              />
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                {currentVal || 'Chưa chọn màu'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
