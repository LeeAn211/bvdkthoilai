import type { CollectionConfig, GlobalConfig, PayloadRequest } from 'payload'
import { normalizeNFC } from '@/hooks/normalizeVietnamese'

const SENSITIVE_KEYS = new Set([
  'password', 'salt', 'hash', 'token', 'secret', 'apiKey', 'api_key',
  'resetPasswordToken', 'resetPasswordExpiration', 'verificationToken',
])

const compactValue = (key: string, value: unknown): unknown => {
  if (SENSITIVE_KEYS.has(key)) return '[REDACTED]'
  if (value == null || typeof value === 'number' || typeof value === 'boolean') return value
  if (typeof value === 'string') return value.length > 500 ? `${value.slice(0, 500)}…` : value
  if (Array.isArray(value)) return `[Array(${value.length})]`
  if (typeof value === 'object') {
    const objectValue = value as Record<string, unknown>
    if ('id' in objectValue) return { id: objectValue.id }
    return '[Object]'
  }
  return String(value)
}

const diffTopLevel = (previousDoc: any, doc: any) => {
  const before = previousDoc || {}
  const after = doc || {}
  const keys = new Set([...Object.keys(before), ...Object.keys(after)])
  const changes: Record<string, { before: unknown; after: unknown }> = {}
  for (const key of keys) {
    if (['updatedAt', 'createdAt'].includes(key)) continue
    const beforeValue = compactValue(key, before[key])
    const afterValue = compactValue(key, after[key])
    if (JSON.stringify(beforeValue) !== JSON.stringify(afterValue)) {
      changes[key] = { before: beforeValue, after: afterValue }
    }
  }
  return changes
}

const getIP = (req: PayloadRequest) => {
  const forwarded = req.headers?.get?.('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim()
  return req.headers?.get?.('x-real-ip') || undefined
}

async function writeAudit(
  req: PayloadRequest,
  input: {
    action: 'create' | 'update' | 'delete' | 'global-update' | 'login' | 'other'
    resource: string
    documentId?: string | number | null
    previousDoc?: any
    doc?: any
    metadata?: Record<string, unknown>
  },
) {
  const user = req.user as any
  // Chỉ audit thao tác có người dùng xác thực. Public form/chatbot được lưu ở collection nghiệp vụ riêng.
  if (!user?.id || input.resource === 'audit-logs') return

  const summary = `${input.action.toUpperCase()} ${input.resource}${input.documentId != null ? ` #${input.documentId}` : ''}`
  try {
    await req.payload.create({
      collection: 'audit-logs' as any,
      overrideAccess: true,
      data: {
        summary,
        action: input.action,
        resource: input.resource,
        documentId: input.documentId != null ? String(input.documentId) : undefined,
        actor: user.id,
        actorEmail: user.email,
        actorRole: user.role,
        ip: getIP(req),
        userAgent: req.headers?.get?.('user-agent') || undefined,
        changedFields: diffTopLevel(input.previousDoc, input.doc),
        metadata: input.metadata,
      } as any,
    })
  } catch (error) {
    // Không làm hỏng thao tác nghiệp vụ sau khi DB đã thay đổi, nhưng ghi rõ lỗi server để giám sát.
    req.payload.logger.error({ err: error, msg: 'Không ghi được Audit Log' })
  }
}

export const withAudit = (config: CollectionConfig): CollectionConfig => {
  if (config.slug === 'audit-logs') return config
  const original = config.hooks || {}
  return {
    ...config,
    hooks: {
      ...original,
      beforeChange: [
        ({ data }: any) => (data ? normalizeNFC(data) : data),
        ...(original.beforeChange || []),
      ],
      afterChange: [
        ...(original.afterChange || []),
        async ({ doc, previousDoc, operation, req }) => {
          await writeAudit(req, {
            action: operation === 'create' ? 'create' : 'update',
            resource: config.slug,
            documentId: (doc as any)?.id,
            previousDoc,
            doc,
          })
          return doc
        },
      ],
      afterDelete: [
        ...(original.afterDelete || []),
        async ({ doc, req }) => {
          await writeAudit(req, {
            action: 'delete',
            resource: config.slug,
            documentId: (doc as any)?.id,
            previousDoc: doc,
          })
          return doc
        },
      ],
    },
  }
}

export const withGlobalAudit = (config: GlobalConfig): GlobalConfig => {
  const original = config.hooks || {}
  return {
    ...config,
    hooks: {
      ...original,
      beforeChange: [
        ({ data }: any) => (data ? normalizeNFC(data) : data),
        ...(original.beforeChange || []),
      ],
      afterChange: [
        ...(original.afterChange || []),
        async ({ doc, previousDoc, req }) => {
          await writeAudit(req, {
            action: 'global-update',
            resource: `global:${config.slug}`,
            previousDoc,
            doc,
          })
          return doc
        },
      ],
    },
  }
}
