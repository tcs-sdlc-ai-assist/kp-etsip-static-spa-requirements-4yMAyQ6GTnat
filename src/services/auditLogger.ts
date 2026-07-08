import { auditLogRepository } from '@/repositories/auditLogRepository'
import { storageAdapter } from '@/storage/storageAdapter'
import { eventBus } from '@/utils/eventBus'

interface AuditLogEntry {
  id: string
  actor: string
  action: string
  targetType: string
  targetId: string
  timestamp: string
  detail?: string
}

interface AuditLogFilter {
  action?: string | string[]
  actor?: string | string[]
  targetType?: string | string[]
  targetId?: string | string[]
  timestampFrom?: string
  timestampTo?: string
  sort?: { field: keyof AuditLogEntry; dir: 'asc' | 'desc' }[]
  limit?: number
}

class AuditLogger {
  constructor(
    private auditLogRepo: typeof auditLogRepository,
    private storageAdapter: typeof storageAdapter,
    private eventBus: typeof eventBus
  ) {}

  async logAction(params: {
    actor: string
    action: string
    targetType: string
    targetId: string
    detail?: string
    relatedEntityType?: string
    relatedEntityId?: string
  }): Promise<string> {
    const id = `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const entry: AuditLogEntry = {
      id,
      actor: params.actor,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId,
      timestamp: new Date().toISOString(),
      detail: params.detail ?? undefined
    }
    
    await this.auditLogRepo.create(entry)
    this.eventBus.emit('auditLog:created', entry)
    return id
  }

  async getLogs(filter?: AuditLogFilter): Promise<AuditLogEntry[]> {
    const allLogs = await this.auditLogRepo.getAll()
    let filtered = allLogs

    if (filter) {
      if (filter.action) {
        const actions = Array.isArray(filter.action) ? filter.action : [filter.action]
        filtered = filtered.filter(log => actions.includes(log.action))
      }
      if (filter.actor) {
        const actors = Array.isArray(filter.actor) ? filter.actor : [filter.actor]
        filtered = filtered.filter(log => actors.includes(log.actor))
      }
      if (filter.targetType) {
        const targetTypes = Array.isArray(filter.targetType) ? filter.targetType : [filter.targetType]
        filtered = filtered.filter(log => targetTypes.includes(log.targetType))
      }
      if (filter.targetId) {
        const targetIds = Array.isArray(filter.targetId) ? filter.targetId : [filter.targetId]
        filtered = filtered.filter(log => targetIds.includes(log.targetId))
      }
      if (filter.timestampFrom) {
        const from = new Date(filter.timestampFrom)
        filtered = filtered.filter(log => new Date(log.timestamp) >= from)
      }
      if (filter.timestampTo) {
        const to = new Date(filter.timestampTo)
        filtered = filtered.filter(log => new Date(log.timestamp) <= to)
      }
      if (filter.sort) {
        for (const sortClause of filter.sort) {
          const { field, dir } = sortClause
          filtered.sort((a, b) => {
            const aVal = a[field]
            const bVal = b[field]
            if (aVal < bVal) return dir === 'asc' ? -1 : 1
            if (aVal > bVal) return dir === 'asc' ? 1 : -1
            return 0
          })
        }
      }
      if (filter.limit !== undefined) {
        filtered = filtered.slice(0, filter.limit)
      }
    }

    return filtered
  }

  async clearLogs(): Promise<void> {
    await this.storageAdapter.saveCollection('auditLog', [])
    this.eventBus.emit('auditLog:cleared')
  }
}

export const auditLogger = new AuditLogger(auditLogRepository, storageAdapter, eventBus)