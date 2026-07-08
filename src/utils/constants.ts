export const ID_PREFIXES = {
  User: 'USR-',
  Role: 'ROL-'
} as const;

export const ENTITY_NAMES = {
  User: 'users',
  Role: 'roles'
} as const;

import type { Permission } from '@/types/enums';

export const DEFAULT_SEED_ROLES = [
  {
    id: 'ROL-00000000-0000-0000-0000-000000000001',
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-01T00:00:00.000Z'),
    archived: false,
    name: 'Guest',
    description: 'Can only view public content.',
    permissions: [Permission.Read]
  },
  {
    id: 'ROL-00000000-0000-0000-0000-000000000002',
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-01T00:00:00.000Z'),
    archived: false,
    name: 'Administrator',
    description: 'Full access to all features.',
    permissions: [
      Permission.Read,
      Permission.Write,
      Permission.Delete,
      Permission.Execute,
      Permission.Admin,
      Permission.Export,
      Permission.Import,
      Permission.Configure,
      Permission.ManageUsers,
      Permission.ManageSettings
    ]
  }
] as const;