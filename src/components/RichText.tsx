import { RichText as PayloadRichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import { textStateConfig } from '@/editor/textStateConfig'

const NODE_STATE_KEY = '$'

const hyphenToCamel = (value: string) =>
  value.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())

const converters = ({ defaultConverters }: any) => ({
  ...defaultConverters,
  text: (args: any) => {
    const { node } = args

    let output =
      typeof defaultConverters.text === 'function'
        ? defaultConverters.text(args)
        : node.text

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

  return (
    <div className="richtext">
      <PayloadRichText data={data} converters={converters} />
    </div>
  )
}
