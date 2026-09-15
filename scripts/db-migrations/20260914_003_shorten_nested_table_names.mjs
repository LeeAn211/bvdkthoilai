export const id = '20260914_003_shorten_nested_table_names'
export const description = 'Rút gọn tên bảng mảng lồng nhau để không vượt giới hạn PostgreSQL 63 ký tự'
export const transactional = true

const tableRenames = [
  ['site_settings_website_assistant_quick_topics', 'site_assistant_topics'],
  ['_site_settings_v_version_website_assistant_quick_topics', '_site_assistant_topics_v'],
  ['site_settings_website_assistant_custom_answers', 'site_assistant_answers'],
  ['_site_settings_v_version_website_assistant_custom_answers', '_site_assistant_answers_v'],
  ['homepage_sections_vaccination_tab_order', 'homepage_vax_tabs'],
  ['_homepage_v_version_sections_vaccination_tab_order', '_homepage_vax_tabs_v'],
  ['hospital_history_core_values_values_list', 'history_core_values'],
  ['_hospital_history_v_version_core_values_values_list', '_history_core_values_v'],
]

const typeRenames = [
  ['enum_homepage_sections_vaccination_tab_order_tab', 'enum_homepage_vax_tabs_tab'],
  ['enum__homepage_v_version_sections_vaccination_tab_order_tab', 'enum__homepage_vax_tabs_v_tab'],
]

function identifier(value) {
  if (!/^[a-z0-9_]+$/.test(value) || value.length > 63) {
    throw new Error(`Identifier PostgreSQL không hợp lệ: ${value}`)
  }
  return `"${value}"`
}

async function relationOid(client, name) {
  const result = await client.query('SELECT to_regclass($1) AS oid', [`public.${name}`])
  return result.rows[0]?.oid || null
}

async function typeOid(client, name) {
  const result = await client.query('SELECT to_regtype($1) AS oid', [`public.${name}`])
  return result.rows[0]?.oid || null
}

async function renameTableIfNeeded(client, oldName, newName) {
  const [oldOid, newOid] = await Promise.all([
    relationOid(client, oldName),
    relationOid(client, newName),
  ])

  if (oldOid && newOid && oldOid !== newOid) {
    throw new Error(`Cả bảng cũ ${oldName} và bảng mới ${newName} đều tồn tại; dừng để tránh mất dữ liệu.`)
  }
  if (!oldOid && !newOid) {
    throw new Error(`Không tìm thấy bảng ${oldName} hoặc ${newName}; cần kiểm tra baseline database.`)
  }
  if (oldOid && !newOid) {
    await client.query(
      `ALTER TABLE public.${identifier(oldName)} RENAME TO ${identifier(newName)}`,
    )
  }
}

async function renameConstraint(client, tableName, currentName, expectedName) {
  if (!currentName || currentName === expectedName) return

  const conflict = await client.query(
    `SELECT 1
       FROM pg_constraint
      WHERE conrelid = $1::regclass
        AND conname = $2`,
    [`public.${tableName}`, expectedName],
  )
  if (conflict.rowCount) {
    throw new Error(`Constraint ${expectedName} đã tồn tại trên ${tableName}.`)
  }

  await client.query(
    `ALTER TABLE public.${identifier(tableName)} RENAME CONSTRAINT ${identifier(currentName)} TO ${identifier(expectedName)}`,
  )
}

async function renameIndex(client, currentName, expectedName) {
  if (!currentName || currentName === expectedName) return

  const conflict = await relationOid(client, expectedName)
  if (conflict) {
    throw new Error(`Index ${expectedName} đã tồn tại.`)
  }

  await client.query(
    `ALTER INDEX public.${identifier(currentName)} RENAME TO ${identifier(expectedName)}`,
  )
}

async function normalizeTableObjectNames(client, tableName) {
  const constraints = await client.query(
    `SELECT c.conname,
            c.contype,
            COALESCE(array_agg(a.attname::text ORDER BY key_column.ordinality)
              FILTER (WHERE a.attname IS NOT NULL), '{}'::text[]) AS columns
       FROM pg_constraint c
       LEFT JOIN LATERAL unnest(c.conkey) WITH ORDINALITY
         AS key_column(attnum, ordinality) ON TRUE
       LEFT JOIN pg_attribute a
         ON a.attrelid = c.conrelid
        AND a.attnum = key_column.attnum
      WHERE c.conrelid = $1::regclass
      GROUP BY c.conname, c.contype`,
    [`public.${tableName}`],
  )

  const primaryKey = constraints.rows.find((item) => item.contype === 'p')
  const parentForeignKey = constraints.rows.find(
    (item) => item.contype === 'f' && item.columns?.length === 1 && item.columns[0] === '_parent_id',
  )

  await renameConstraint(client, tableName, primaryKey?.conname, `${tableName}_pkey`)
  await renameConstraint(client, tableName, parentForeignKey?.conname, `${tableName}_parent_id_fk`)

  const indexes = await client.query(
    `SELECT index_class.relname AS index_name,
            index_data.indisprimary,
            COALESCE(array_agg(attribute.attname::text ORDER BY key_column.ordinality)
              FILTER (WHERE attribute.attname IS NOT NULL), '{}'::text[]) AS columns
       FROM pg_class table_class
       JOIN pg_namespace namespace ON namespace.oid = table_class.relnamespace
       JOIN pg_index index_data ON index_data.indrelid = table_class.oid
       JOIN pg_class index_class ON index_class.oid = index_data.indexrelid
       LEFT JOIN LATERAL unnest(index_data.indkey) WITH ORDINALITY
         AS key_column(attnum, ordinality) ON TRUE
       LEFT JOIN pg_attribute attribute
         ON attribute.attrelid = table_class.oid
        AND attribute.attnum = key_column.attnum
      WHERE namespace.nspname = 'public'
        AND table_class.relname = $1
      GROUP BY index_class.relname, index_data.indisprimary`,
    [tableName],
  )

  for (const index of indexes.rows) {
    if (index.indisprimary || index.columns?.length !== 1) continue
    const column = index.columns[0]
    const suffix = column === '_order'
      ? 'order_idx'
      : column === '_parent_id'
        ? 'parent_id_idx'
        : column === 'custom_icon_id'
          ? 'custom_icon_idx'
          : null
    if (suffix) await renameIndex(client, index.index_name, `${tableName}_${suffix}`)
  }
}

async function renameTypeIfNeeded(client, oldName, newName) {
  const [oldOid, newOid] = await Promise.all([
    typeOid(client, oldName),
    typeOid(client, newName),
  ])

  if (oldOid && newOid && oldOid !== newOid) {
    throw new Error(`Cả enum cũ ${oldName} và enum mới ${newName} đều tồn tại; dừng để kiểm tra.`)
  }
  if (!oldOid && !newOid) {
    throw new Error(`Không tìm thấy enum ${oldName} hoặc ${newName}.`)
  }
  if (oldOid && !newOid) {
    await client.query(
      `ALTER TYPE public.${identifier(oldName)} RENAME TO ${identifier(newName)}`,
    )
  }
}

export async function up({ client }) {
  for (const [oldName, newName] of tableRenames) {
    await renameTableIfNeeded(client, oldName, newName)
    await normalizeTableObjectNames(client, newName)
  }

  for (const [oldName, newName] of typeRenames) {
    await renameTypeIfNeeded(client, oldName, newName)
  }
}

export async function verify({ client }) {
  for (const [oldName, newName] of tableRenames) {
    const [oldOid, newOid] = await Promise.all([
      relationOid(client, oldName),
      relationOid(client, newName),
    ])
    if (oldOid || !newOid) {
      throw new Error(`Bảng ${oldName} chưa được chuyển an toàn sang ${newName}.`)
    }

    const expectedObjects = [
      `${newName}_pkey`,
      `${newName}_parent_id_fk`,
      `${newName}_order_idx`,
      `${newName}_parent_id_idx`,
    ]
    const objects = await client.query(
      `SELECT conname AS name
         FROM pg_constraint
        WHERE conrelid = $1::regclass
       UNION ALL
       SELECT index_class.relname AS name
         FROM pg_index index_data
         JOIN pg_class index_class ON index_class.oid = index_data.indexrelid
        WHERE index_data.indrelid = $1::regclass`,
      [`public.${newName}`],
    )
    const names = new Set(objects.rows.map((item) => item.name))
    const missing = expectedObjects.filter((name) => !names.has(name))
    if (missing.length) {
      throw new Error(`Thiếu object sau khi đổi tên bảng ${newName}: ${missing.join(', ')}`)
    }
  }

  for (const [oldName, newName] of typeRenames) {
    const [oldOid, newOid] = await Promise.all([
      typeOid(client, oldName),
      typeOid(client, newName),
    ])
    if (oldOid || !newOid) {
      throw new Error(`Enum ${oldName} chưa được chuyển an toàn sang ${newName}.`)
    }
  }
}
