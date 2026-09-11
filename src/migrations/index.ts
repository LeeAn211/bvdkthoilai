import * as migration_20260906_040011 from './20260906_040011';
import * as migration_20260911_113500 from './20260911_113500_add_homepage_font_family';

export const migrations = [
  {
    up: migration_20260906_040011.up,
    down: migration_20260906_040011.down,
    name: '20260906_040011'
  },
  {
    up: migration_20260911_113500.up,
    down: migration_20260911_113500.down,
    name: '20260911_113500_add_homepage_font_family'
  },
];
