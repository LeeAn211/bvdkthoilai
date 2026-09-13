import pg from 'pg';
const { Client } = pg;

async function syncMenuColumns() {
  const client = new Client({
    connectionString: 'postgresql://postgres:Nguyentanan1707%40@localhost:5432/thoi_lai_hospital'
  });
  await client.connect();

  console.log('Connecting to database...');

  // 1. Check existing columns in site_settings
  const colRes = await client.query(`
    SELECT column_name FROM information_schema.columns WHERE table_name = 'site_settings';
  `);
  const existingCols = new Set(colRes.rows.map(r => r.column_name));

  // 2. Define menu fields to add
  const menuCols = [
    { name: 'header_menu_appearance_font_size', type: 'numeric' },
    { name: 'header_menu_appearance_font_weight', type: 'varchar' },
    { name: 'header_menu_appearance_text_transform', type: 'varchar' },
    { name: 'header_menu_appearance_font_family', type: 'varchar' },
    { name: 'header_menu_appearance_letter_spacing', type: 'numeric' },
    { name: 'header_menu_appearance_height', type: 'numeric' },
    { name: 'header_menu_appearance_justify_content', type: 'varchar' },
    { name: 'header_menu_appearance_item_spacing', type: 'numeric' },
    { name: 'header_menu_appearance_border_radius', type: 'numeric' },
    { name: 'header_menu_appearance_item_border_radius', type: 'numeric' },
    { name: 'header_menu_appearance_background', type: 'varchar' },
    { name: 'header_menu_appearance_gradient_end', type: 'varchar' },
    { name: 'header_menu_appearance_text_color', type: 'varchar' },
    { name: 'header_menu_appearance_hover_text_color', type: 'varchar' },
    { name: 'header_menu_appearance_hover_background', type: 'varchar' },
    { name: 'header_menu_appearance_active_indicator_color', type: 'varchar' },
    { name: 'header_menu_appearance_dropdown_width', type: 'numeric' },
    { name: 'header_menu_appearance_dropdown_font_size', type: 'numeric' },
    { name: 'header_menu_appearance_dropdown_border_radius', type: 'numeric' },
    { name: 'header_menu_appearance_dropdown_background', type: 'varchar' },
    { name: 'header_menu_appearance_dropdown_text_color', type: 'varchar' },
    { name: 'header_menu_appearance_dropdown_border_color', type: 'varchar' },
    { name: 'header_menu_appearance_dropdown_hover_background', type: 'varchar' },
    { name: 'header_menu_appearance_dropdown_hover_text_color', type: 'varchar' },
    { name: 'header_menu_appearance_dropdown_arrow_color', type: 'varchar' },
    { name: 'header_menu_appearance_animation_style', type: 'varchar' },
    { name: 'header_menu_appearance_animation_speed', type: 'varchar' },
  ];

  // Add to site_settings
  for (const col of menuCols) {
    if (!existingCols.has(col.name)) {
      console.log(`Adding column ${col.name} to site_settings...`);
      await client.query(`ALTER TABLE site_settings ADD COLUMN "${col.name}" ${col.type};`);
    }
  }

  // 3. Check and add to _site_settings_v
  const colVRes = await client.query(`
    SELECT column_name FROM information_schema.columns WHERE table_name = '_site_settings_v';
  `);
  const existingVCols = new Set(colVRes.rows.map(r => r.column_name));

  for (const col of menuCols) {
    const vName = `version_${col.name}`;
    if (!existingVCols.has(vName)) {
      console.log(`Adding column ${vName} to _site_settings_v...`);
      await client.query(`ALTER TABLE _site_settings_v ADD COLUMN "${vName}" ${col.type};`);
    }
  }

  // 4. Update default values for site_settings row 1 if null
  await client.query(`
    UPDATE site_settings
    SET
      header_menu_appearance_font_size = COALESCE(header_menu_appearance_font_size, 14),
      header_menu_appearance_font_weight = COALESCE(header_menu_appearance_font_weight, '700'),
      header_menu_appearance_text_transform = COALESCE(header_menu_appearance_text_transform, 'uppercase'),
      header_menu_appearance_font_family = COALESCE(header_menu_appearance_font_family, 'inherit'),
      header_menu_appearance_letter_spacing = COALESCE(header_menu_appearance_letter_spacing, 0),
      header_menu_appearance_height = COALESCE(header_menu_appearance_height, 56),
      header_menu_appearance_justify_content = COALESCE(header_menu_appearance_justify_content, 'space-between'),
      header_menu_appearance_item_spacing = COALESCE(header_menu_appearance_item_spacing, 8),
      header_menu_appearance_border_radius = COALESCE(header_menu_appearance_border_radius, 0),
      header_menu_appearance_item_border_radius = COALESCE(header_menu_appearance_item_border_radius, 6),
      header_menu_appearance_background = COALESCE(header_menu_appearance_background, '#075db8'),
      header_menu_appearance_gradient_end = COALESCE(header_menu_appearance_gradient_end, '#006bc7'),
      header_menu_appearance_text_color = COALESCE(header_menu_appearance_text_color, '#FFFFFF'),
      header_menu_appearance_hover_text_color = COALESCE(header_menu_appearance_hover_text_color, '#FFE272'),
      header_menu_appearance_hover_background = COALESCE(header_menu_appearance_hover_background, 'rgba(255,255,255,0.1)'),
      header_menu_appearance_active_indicator_color = COALESCE(header_menu_appearance_active_indicator_color, '#FFD24D'),
      header_menu_appearance_dropdown_width = COALESCE(header_menu_appearance_dropdown_width, 250),
      header_menu_appearance_dropdown_font_size = COALESCE(header_menu_appearance_dropdown_font_size, 14),
      header_menu_appearance_dropdown_border_radius = COALESCE(header_menu_appearance_dropdown_border_radius, 12),
      header_menu_appearance_dropdown_background = COALESCE(header_menu_appearance_dropdown_background, '#FFFFFF'),
      header_menu_appearance_dropdown_text_color = COALESCE(header_menu_appearance_dropdown_text_color, '#1e3a5f'),
      header_menu_appearance_dropdown_border_color = COALESCE(header_menu_appearance_dropdown_border_color, '#e2e8f0'),
      header_menu_appearance_dropdown_hover_background = COALESCE(header_menu_appearance_dropdown_hover_background, '#f0f7ff'),
      header_menu_appearance_dropdown_hover_text_color = COALESCE(header_menu_appearance_dropdown_hover_text_color, '#075db8'),
      header_menu_appearance_dropdown_arrow_color = COALESCE(header_menu_appearance_dropdown_arrow_color, '#94a3b8'),
      header_menu_appearance_animation_style = COALESCE(header_menu_appearance_animation_style, 'slide-down'),
      header_menu_appearance_animation_speed = COALESCE(header_menu_appearance_animation_speed, '0.22s'),
      updated_at = NOW()
    WHERE id = 1;
  `);

  console.log('Database migration for headerMenuAppearance completed successfully!');
  await client.end();
}

syncMenuColumns().catch(console.error);
