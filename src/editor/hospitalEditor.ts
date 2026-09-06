import {
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  TextStateFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { textStateConfig } from './textStateConfig'

export const hospitalEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    FixedToolbarFeature(),
    EXPERIMENTAL_TableFeature(),
    TextStateFeature({
      state: textStateConfig,
    }),
  ],
})
