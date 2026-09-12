import { RichText as PayloadRichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'
import { mediaUrl } from '@/lib/media'
import { normalizeNFC } from '@/hooks/normalizeVietnamese'
import { textStateConfig } from '@/editor/textStateConfig'

const NODE_STATE_KEY = '$'

const hyphenToCamel = (value: string) =>
  value.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())

const converters = ({ defaultConverters }: any) => ({
  ...defaultConverters,
  upload: (args: any) => {
    const { node } = args
    const uploadValue = node?.value
    const rawUrl = mediaUrl(uploadValue) || uploadValue?.url || ''
    const altText = uploadValue?.alt || uploadValue?.originalFilename || 'Hình ảnh bài viết'
    const caption = uploadValue?.caption

    if (!rawUrl) return null

    return (
      <figure
        style={{
          margin: '24px auto',
          textAlign: 'center',
          maxWidth: '100%',
          display: 'block',
        }}
      >
        <img
          src={rawUrl}
          alt={altText}
          loading="lazy"
          decoding="async"
          style={{
            maxWidth: '100%',
            width: 'auto',
            height: 'auto',
            maxHeight: '750px',
            display: 'block',
            margin: '0 auto',
            objectFit: 'contain',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.07)',
          }}
        />
        {caption && (
          <figcaption
            style={{
              marginTop: '8px',
              fontSize: '14px',
              color: '#64748b',
              fontStyle: 'italic',
              textAlign: 'center',
            }}
          >
            {caption}
          </figcaption>
        )}
      </figure>
    )
  },
  text: (args: any) => {
    const { node } = args

    let rawText = node?.text || ''
    if (typeof rawText === 'string') {
      rawText = rawText.normalize('NFC')
    }

    let output =
      typeof defaultConverters.text === 'function'
        ? defaultConverters.text({ ...args, node: { ...node, text: rawText } })
        : rawText

    const state = node?.[NODE_STATE_KEY] as Record<string, string> | undefined

    if (state) {
      const style: React.CSSProperties = {}

      for (const [stateKey, stateValue] of Object.entries(state)) {
        let css = (textStateConfig as any)[stateKey]?.[stateValue]?.css

        // Tương thích nội dung đã lưu trước khi ID màu nền được đổi thành duy nhất.
        if (!css && stateKey === 'highlight') {
          const legacyHighlightMap: Record<string, React.CSSProperties> = {
            yellow: { backgroundColor: '#fff3bf' },
            blue: { backgroundColor: '#eaf6ff' },
            green: { backgroundColor: '#eaf7ef' },
            red: { backgroundColor: '#fff0f0' },
          }
          const legacy = legacyHighlightMap[stateValue]
          if (legacy) {
            Object.assign(style, legacy)
            continue
          }
        }

        if (!css) continue

        for (const [property, value] of Object.entries(css)) {
          ;(style as any)[hyphenToCamel(property)] = value
        }
      }

      if (Object.keys(style).length > 0) {
        output = <span style={style}>{output}</span>
      }
    }

    return output
  },
})

export function RichText({ data }: { data: any }) {
  if (!data) return null

  // Chuẩn hóa toàn bộ dữ liệu sang NFC để phòng ngừa dấu tổ hợp khi render
  const safeData = normalizeNFC(data)

  return (
    <div className="richtext">
      <PayloadRichText data={safeData} converters={converters} />
    </div>
  )
}

