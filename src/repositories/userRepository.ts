import { storageAdapter } from '@/storage/storageAdapter'
import type { User } from '@/types/entities'

class UserRepository {
  async getAll(): Promise<User[]> {
    return storageAdapter.getCollection<User>('users')
  }

  async getById(id: string): Promise<User | null> {
    const users = await this.getAll()
    return users.find(user => user.id === id) ?? null
  }

  async create(user: User): Promise<void> {
    const users = await this.getAll()
    users.push(user)
    await storageAdapter.saveCollection('users', users)
  }

  async update(user: User): Promise<void> {
    const users = await this.getAll()
    const index = users.findIndex(u => u.id === user.id)
    if (index !== -1) {
      users[index] = user
      await storageAdapter.saveCollection('users', users)
    }
  }

  async delete(id: string): Promise<void> {
    const users = await this.getAll()
    const filtered = users.filter(user => user.id !== id)
    await storageAdapter.saveCollection('users', filtered)
  }
}

export const userRepository = new UserRepository()