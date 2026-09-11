// Tệp tương thích cho code cũ. Nguồn quyền chính nằm tại src/access/index.ts.
export {
  loggedIn as isLoggedIn,
  admins as isAdmin,
  publishers as canPublish,
  procurementTeam as procurementAccess,
  adminField as adminFieldAccess,
  hasModulePermission,
  moduleAccess,
  departmentScopedAccess,
} from './index'
