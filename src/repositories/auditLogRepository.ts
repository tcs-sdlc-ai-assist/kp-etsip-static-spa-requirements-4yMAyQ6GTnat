import { storageAdapter } from '@/storage/storageAdapter'

interface AuditLogEntry {
  id: string
  actor: string
  action: string
  targetType: string
  targetId: string
  timestamp: string
  detail?: string
}

class AuditLogRepository {
  async getAll(): Promise<AuditLogEntry[]> {
    return storageAdapter.getCollection<AuditLogEntry>('auditLog')
  }

  async getById(id: string): Promise<AuditLogEntry | null> {
    const auditLogs = await this.getAll()
    return auditLogs.find(log => log.id === id) ?? null
  }

  async create(auditLogEntry: AuditLogEntry): Promise<void> {
    const auditLogs = await this.getAll()
    auditLogs.push(auditLogEntry)
    await storageAdapter.saveCollection('auditLog', auditLogs)
  }
}

export const auditLogRepository = new AuditLogRepository()