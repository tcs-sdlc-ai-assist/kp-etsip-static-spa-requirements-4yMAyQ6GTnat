export enum AccessLevel {
  Guest = 1,
  Viewer,
  Reporter,
  Contributor,
  Editor,
  Moderator,
  Publisher,
  Administrator,
  SuperAdministrator,
  Root
}

export enum Permission {
  Read = "READ",
  Write = "WRITE",
  Delete = "DELETE",
  Execute = "EXECUTE",
  Admin = "ADMIN",
  Export = "EXPORT",
  Import = "IMPORT",
  Configure = "CONFIGURE",
  ManageUsers = "MANAGE_USERS",
  ManageSettings = "MANAGE_SETTINGS"
}