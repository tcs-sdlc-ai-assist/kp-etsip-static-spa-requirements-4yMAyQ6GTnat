import type { AccessLevel, Permission } from './enums';

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  archived: boolean;
}

export interface User extends BaseEntity {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  accessLevel: AccessLevel;
  permissions: Permission[];
}

export interface Role extends BaseEntity {
  name: string;
  description: string;
  permissions: Permission[];
}