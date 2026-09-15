'use client'

import { useField } from '@payloadcms/ui'
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

export default function PermissionMatrixField({
  label = 'Ma trận phân quyền',
  path,
  readOnly = false,
  required = false,
}: PermissionMatrixFieldProps) {
  const { setValue, value } = useField<PermissionRow[]>({ path, hasRows: true })
  const { value: useCustomPermissions } = useField<boolean>({ path: 'useCustomPermissions' })

  const rows = useMemo(() => (Array.isArray(value) ? value : []), [value])
  const knownRows = useMemo(
    () => new Map(rows.filter((row) => PERMISSION_MODULE_VALUES.has(row.module)).map((row) => [row.module, row])),
    [rows],
  )
  const unknownRows = useMemo(
    () => rows.filter((row) => !PERMISSION_MODULE_VALUES.has(row.module)),
    [rows],
  )

  const updateModule = useCallback(
    (moduleName: string, actions: PermissionActionValue[]) => {
      if (readOnly) return

      const normalizedActions = uniqueActions(actions)
      const existingRow = rows.find((row) => row.module === moduleName)
      const otherRows = rows.filter((row) => row.module !== moduleName)

      if (normalizedActions.length === 0) {
        setValue(otherRows)
        return
      }

      setValue([
        ...otherRows,
        {
          ...(existingRow?.id ? { id: existingRow.id } : {}),
          module: moduleName,
          actions: normalizedActions,
        },
      ])
    },
    [readOnly, rows, setValue],
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
