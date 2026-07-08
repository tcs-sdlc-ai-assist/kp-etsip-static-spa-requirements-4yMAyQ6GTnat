import { storageAdapter } from '@/storage/storageAdapter'
import type { Role } from '@/types/entities'

class RoleRepository {
  async getAll(): Promise<Role[]> {
    return storageAdapter.getCollection<Role>('roles')
  }

  async getById(id: string): Promise<Role | null> {
    const roles = await this.getAll()
    return roles.find(role => role.id === id) ?? null
  }

  async create(role: Role): Promise<void> {
    const roles = await this.getAll()
    roles.push(role)
    await storageAdapter.saveCollection('roles', roles)
  }

  async update(role: Role): Promise<void> {
    const roles = await this.getAll()
    const index = roles.findIndex(r => r.id === role.id)
    if (index !== -1) {
      roles[index] = role
      await storageAdapter.saveCollection('roles', roles)
    }
  }

  async delete(id: string): Promise<void> {
    const roles = await this.getAll()
    const filtered = roles.filter(role => role.id !== id)
    await storageAdapter.saveCollection('roles', filtered)
  }
}

export const roleRepository = new RoleRepository()