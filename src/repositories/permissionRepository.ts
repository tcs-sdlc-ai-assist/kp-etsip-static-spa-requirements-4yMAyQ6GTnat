import { storageAdapter } from '@/storage/storageAdapter'
import type { BaseEntity } from '@/types/entities'

interface PermissionEntity extends BaseEntity {
  name: string
  description: string
}

class PermissionRepository {
  async getAll(): Promise<PermissionEntity[]> {
    return storageAdapter.getCollection<PermissionEntity>('permissions')
  }

  async getById(id: string): Promise<PermissionEntity | null> {
    const permissions = await this.getAll()
    return permissions.find(p => p.id === id) ?? null
  }

  async create(permission: PermissionEntity): Promise<void> {
    const permissions = await this.getAll()
    permissions.push(permission)
    await storageAdapter.saveCollection('permissions', permissions)
  }

  async update(permission: PermissionEntity): Promise<void> {
    const permissions = await this.getAll()
    const index = permissions.findIndex(p => p.id === permission.id)
    if (index !== -1) {
      permissions[index] = permission
      await storageAdapter.saveCollection('permissions', permissions)
    }
  }

  async delete(id: string): Promise<void> {
    const permissions = await this.getAll()
    const filtered = permissions.filter(p => p.id !== id)
    await storageAdapter.saveCollection('permissions', filtered)
  }
}

export const permissionRepository = new PermissionRepository()