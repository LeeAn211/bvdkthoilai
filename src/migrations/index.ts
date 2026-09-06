import * as migration_20260906_040011 from './20260906_040011';

export const migrations = [
  {
    up: migration_20260906_040011.up,
    down: migration_20260906_040011.down,
    name: '20260906_040011'
  },
];
