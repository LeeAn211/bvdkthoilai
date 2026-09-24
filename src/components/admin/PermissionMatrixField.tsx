'use client'

import { useAllFormFields, useField, useForm } from '@payloadcms/ui'
import React, { useCallback, useMemo } from 'react'

import {
  PERMISSION_ACTION_LABELS,
  PERMISSION_MODULE_GROUPS,
  PERMISSION_MODULE_VALUES,
  type PermissionActionValue,
} from '@/access/permissionCatalog'

import styles from './PermissionMatrixField.module.css'

type PermissionRow = {
  actions?: PermissionActionValue[] | null
  id?: string | null
  module: string
}

type PermissionMatrixFieldProps = {
  label?: string
  path: string
  readOnly?: boolean
  required?: boolean
}

const uniqueActions = (actions: PermissionActionValue[]) => [...new Set(actions)]

const moduleOrderList = Array.from(PERMISSION_MODULE_VALUES)

const generateHexId = () => {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0')
  const randomHex = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
  return `${timestamp}${randomHex}`
}

function extractRowsFromFields(fields: Record<string, any> | undefined, path: string): PermissionRow[] {
  if (!fields) return []

  const rowMap = new Map<number, Partial<PermissionRow>>()
  const prefix = `${path}.`

  for (const [key, fieldState] of Object.entries(fields)) {
    if (key.startsWith(prefix)) {
      const rest = key.slice(prefix.length)
      const dotIndex = rest.indexOf('.')
      if (dotIndex === -1) continue

      const rowIndex = parseInt(rest.slice(0, dotIndex), 10)
      const prop = rest.slice(dotIndex + 1)
      if (Number.isNaN(rowIndex)) continue

      if (!rowMap.has(rowIndex)) {
        rowMap.set(rowIndex, {})
      }
      const row = rowMap.get(rowIndex)!
      if (prop === 'id') {
        row.id = fieldState?.value != null ? String(fieldState.value) : null
      } else if (prop === 'module') {
        row.module = fieldState?.value != null ? String(fieldState.value) : ''
      } else if (prop === 'actions') {
        row.actions = Array.isArray(fieldState?.value) ? (fieldState.value as PermissionActionValue[]) : []
      }
    }
  }

  if (rowMap.size > 0) {
    const sortedIndices = Array.from(rowMap.keys()).sort((a, b) => a - b)
    const result: PermissionRow[] = []
    for (const idx of sortedIndices) {
      const r = rowMap.get(idx)!
      if (r.module) {
        result.push({
          id: r.id || null,
          module: r.module,
          actions: Array.isArray(r.actions) ? r.actions : [],
        })
      }
    }
    return result
  }

  const parentValue = fields[path]?.value
  if (Array.isArray(parentValue)) {
    return parentValue as PermissionRow[]
  }

  return []
}

export default function PermissionMatrixField({
  label = 'Ma trận phân quyền',
  path,
  readOnly = false,
  required = false,
}: PermissionMatrixFieldProps) {
  const [fields, dispatchFields] = useAllFormFields()
  const { setModified } = useForm()
  const { value: useCustomPermissions } = useField<boolean>({ path: 'useCustomPermissions' })

  const rows = useMemo(() => extractRowsFromFields(fields, path), [fields, path])

  const knownRows = useMemo(
    () => new Map(rows.filter((row) => PERMISSION_MODULE_VALUES.has(row.module)).map((row) => [row.module, row])),
    [rows],
  )
  const unknownRows = useMemo(
    () => rows.filter((row) => !PERMISSION_MODULE_VALUES.has(row.module)),
    [rows],
  )

  const syncRowsToForm = useCallback(
    (nextRows: PermissionRow[]) => {
      if (readOnly) return

      // Sắp xếp thứ tự modules nhất quán theo catalog
      nextRows.sort((a, b) => {
        const indexA = moduleOrderList.indexOf(a.module)
        const indexB = moduleOrderList.indexOf(b.module)
        if (indexA !== -1 && indexB !== -1) return indexA - indexB
        if (indexA !== -1) return -1
        if (indexB !== -1) return 1
        return a.module.localeCompare(b.module)
      })

      const prefix = `${path}.`
      const nextState: Record<string, any> = {}

      // Giữ lại tất cả các trường không thuộc array path này
      for (const [key, val] of Object.entries(fields || {})) {
        if (!key.startsWith(prefix) && key !== path) {
          nextState[key] = val
        }
      }

      if (nextRows.length === 0) {
        // Khi không còn quyền nào được chọn:
        // Đặt disableFormData: false và value: [] để Payload submit permissions: [] lên API
        nextState[path] = {
          ...(fields?.[path] || {}),
          disableFormData: false,
          rows: [],
          value: [],
          valid: true,
          passesCondition: true,
        }
      } else {
        const rowMetadata = nextRows.map((row, index) => {
          const rowId = row.id || generateHexId()
          const rowPath = `${path}.${index}`

          nextState[`${rowPath}.id`] = {
            value: rowId,
            initialValue: rowId,
            valid: true,
            passesCondition: true,
          }
          nextState[`${rowPath}.module`] = {
            value: row.module,
            initialValue: row.module,
            valid: true,
            passesCondition: true,
          }
          nextState[`${rowPath}.actions`] = {
            value: row.actions || [],
            initialValue: row.actions || [],
            valid: true,
            passesCondition: true,
          }

          return {
            id: rowId,
            isLoading: false,
          }
        })

        nextState[path] = {
          ...(fields?.[path] || {}),
          disableFormData: true,
          rows: rowMetadata,
          value: nextRows.length,
          valid: true,
          passesCondition: true,
        }
      }

      dispatchFields({
        type: 'REPLACE_STATE',
        state: nextState,
      })

      if (typeof setModified === 'function') {
        setModified(true)
      }
    },
    [dispatchFields, fields, path, readOnly, setModified],
  )

  const updateModule = useCallback(
    (moduleName: string, actions: PermissionActionValue[]) => {
      if (readOnly) return

      const normalizedActions = uniqueActions(actions)
      const existingRow = rows.find((row) => row.module === moduleName)
      const otherRows = rows.filter((row) => row.module !== moduleName)

      let nextRows: PermissionRow[]
      if (normalizedActions.length === 0) {
        nextRows = otherRows
      } else {
        nextRows = [
          ...otherRows,
          {
            ...(existingRow?.id ? { id: existingRow.id } : {}),
            module: moduleName,
            actions: normalizedActions,
          },
        ]
      }

      syncRowsToForm(nextRows)
    },
    [readOnly, rows, syncRowsToForm],
  )

  const toggleAction = useCallback(
    (moduleName: string, action: PermissionActionValue, checked: boolean) => {
      const currentActions = knownRows.get(moduleName)?.actions ?? []

      if (action === 'view' && !checked) {
        updateModule(moduleName, [])
        return
      }

      const nextActions = checked
        ? uniqueActions(['view', ...currentActions, action])
        : currentActions.filter((currentAction) => currentAction !== action)

      updateModule(moduleName, nextActions)
    },
    [knownRows, updateModule],
  )

  const selectedModuleCount = knownRows.size
  const selectedActionCount = [...knownRows.values()].reduce(
    (total, row) => total + (row.actions?.length ?? 0),
    0,
  )

  return (
    <div className={styles.field}>
      <div className={styles.heading}>
        <div>
          <label className={styles.label}>
            {label}
            {required ? <span className={styles.required}> *</span> : null}
          </label>
          <p className={styles.description}>
            Chọn mục quản trị và các thao tác người dùng được phép thực hiện. Bỏ chọn “Truy cập / xem” sẽ thu hồi toàn bộ quyền trong mục đó.
          </p>
        </div>
        <div className={styles.summary} aria-live="polite">
          <strong>{selectedModuleCount}</strong> mục · <strong>{selectedActionCount}</strong> quyền
        </div>
      </div>

      <div className={useCustomPermissions ? styles.modeExact : styles.modeSupplemental}>
        <strong>{useCustomPermissions ? 'Chế độ quyền tùy chỉnh đang bật' : 'Chế độ quyền bổ sung'}</strong>
        <span>
          {useCustomPermissions
            ? 'Người dùng chỉ có các quyền được tích bên dưới.'
            : 'Các ô được tích sẽ bổ sung vào quyền mặc định của vai trò.'}
        </span>
      </div>

      {PERMISSION_MODULE_GROUPS.map((group) => (
        <section className={styles.group} key={group.label}>
          <h3 className={styles.groupTitle}>{group.label}</h3>
          <div className={styles.grid}>
            {group.modules.map((moduleDefinition) => {
              const selectedActions = knownRows.get(moduleDefinition.value)?.actions ?? []
              const enabled = selectedActions.includes('view')
              const allSelected = moduleDefinition.actions.every((action) => selectedActions.includes(action))

              return (
                <article className={`${styles.card} ${enabled ? styles.cardEnabled : ''}`} key={moduleDefinition.value}>
                  <div className={styles.cardHeader}>
                    <label className={styles.moduleToggle}>
                      <input
                        checked={enabled}
                        disabled={readOnly}
                        onChange={(event) => toggleAction(moduleDefinition.value, 'view', event.target.checked)}
                        type="checkbox"
                      />
                      <span>
                        <strong>{moduleDefinition.label}</strong>
                        {moduleDefinition.description ? <small>{moduleDefinition.description}</small> : null}
                      </span>
                    </label>
                    {!readOnly ? (
                      <button
                        className={styles.selectAll}
                        onClick={() =>
                          updateModule(moduleDefinition.value, allSelected ? [] : moduleDefinition.actions)
                        }
                        type="button"
                      >
                        {allSelected ? 'Bỏ chọn' : 'Chọn tất cả'}
                      </button>
                    ) : null}
                  </div>

                  <div className={styles.actions}>
                    {moduleDefinition.actions.map((action) => (
                      <label className={styles.action} key={action}>
                        <input
                          checked={selectedActions.includes(action)}
                          disabled={readOnly || (action !== 'view' && !enabled)}
                          onChange={(event) => toggleAction(moduleDefinition.value, action, event.target.checked)}
                          type="checkbox"
                        />
                        <span>{PERMISSION_ACTION_LABELS[action]}</span>
                      </label>
                    ))}
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      ))}

      {unknownRows.length > 0 ? (
        <div className={styles.legacy}>
          <strong>Quyền cũ chưa nhận diện</strong>
          <p>
            Các mã sau vẫn được giữ nguyên để tránh mất dữ liệu: {unknownRows.map((row) => row.module).join(', ')}.
          </p>
        </div>
      ) : null}
    </div>
  )
}
