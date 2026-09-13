import * as migration_20260906_040011 from './20260906_040011';
import * as migration_20260911_113500_add_homepage_font_family from './20260911_113500_add_homepage_font_family';
import * as migration_20260912_102452 from './20260912_102452';
import * as migration_20260912_104426_scientific_activity_groups from './20260912_104426_scientific_activity_groups';

export const migrations = [
  {
    up: migration_20260906_040011.up,
    down: migration_20260906_040011.down,
    name: '20260906_040011',
  },
  {
    up: migration_20260911_113500_add_homepage_font_family.up,
    down: migration_20260911_113500_add_homepage_font_family.down,
    name: '20260911_113500_add_homepage_font_family',
  },
  {
    up: migration_20260912_102452.up,
    down: migration_20260912_102452.down,
    name: '20260912_102452',
  },
  {
    up: migration_20260912_104426_scientific_activity_groups.up,
    down: migration_20260912_104426_scientific_activity_groups.down,
    name: '20260912_104426_scientific_activity_groups',
  },
];
