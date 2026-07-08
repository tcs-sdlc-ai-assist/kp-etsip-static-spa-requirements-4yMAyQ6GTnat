import { SEED_ANCHOR_DATE } from '@/utils/dateUtils'
import { createMulberry32 } from '@/utils/prngUtils'

type SeedSize = 'Small' | 'Standard' | 'Large'

interface Meta {
  schemaVersion: number
  seedVersion: string
  seedAnchorDate: string
  seedSize: SeedSize
  prngSeed: number
  installedAt: string
}

interface ActivePersona {
  personaId: string
}

const CURRENT_SCHEMA_VERSION = 1
const STORAGE_PREFIX = 'etsip:'

class StorageAdapter {
  private changeEventCallbacks: Array<(key: string, data: any) => void> = []
  private validators: Map<string, (data: any[]) => boolean | Promise<boolean>> = new Map()
  private seeded = false

  constructor(private seedSize: SeedSize = 'Standard') {}

  async initialize(): Promise<void> {
    try {
      const meta = await this.getCollection<Meta>('meta')
      if (meta.length === 0 || meta[0].schemaVersion !== CURRENT_SCHEMA_VERSION) {
        await this.seedData()
      } else {
        this.seeded = true
      }
    } catch (error) {
      console.error('StorageAdapter initialization failed:', error)
      await this.seedData()
    }
  }

  async getCollection<T>(name: string): Promise<T[]> {
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${name}`)
      return raw ? JSON.parse(raw) : []
    } catch (error) {
      console.error(`Failed to parse collection ${name}:`, error)
      return []
    }
  }

  async saveCollection<T>(name: string, data: T[]): Promise<void> {
    try {
      const validator = this.validators.get(name)
      if (validator) {
        const isValid = await validator(data)
        if (!isValid) {
          throw new Error(`Referential integrity violation for collection ${name}`)
        }
      }
      localStorage.setItem(`${STORAGE_PREFIX}${name}`, JSON.stringify(data))
      this.emitChangeEvent(name, data)
    } catch (error) {
      console.error(`Failed to save collection ${name}:`, error)
      throw error
    }
  }

  onChange(callback: (key: string, data: any) => void): () => void {
    this.changeEventCallbacks.push(callback)
    return () => {
      const index = this.changeEventCallbacks.indexOf(callback)
      if (index >= 0) {
        this.changeEventCallbacks.splice(index, 1)
      }
    }
  }

  setValidator(name: string, validator: (data: any[]) => boolean | Promise<boolean>): void {
    this.validators.set(name, validator)
  }

  async seedData(): Promise<void> {
    if (this.seeded) return
    
    const prng = createMulberry32(Date.now())
    
    try {
      await this.saveCollection('meta', [{
        schemaVersion: CURRENT_SCHEMA_VERSION,
        seedVersion: '1.0',
        seedAnchorDate: SEED_ANCHOR_DATE.toISOString(),
        seedSize: this.seedSize,
        prngSeed: Date.now(),
        installedAt: new Date().toISOString()
      }])
      
      await this.saveCollection('activePersona', [{ personaId: 'ROL-guest' }])
      
      await this.seedRoles()
      await this.seedUsers()
      await this.seedPortfolios()
      await this.seedApplications()
      await this.seedReleases()
      await this.seedTestSuites()
      await this.seedTestCases()
      await this.seedTestExecutions()
      await this.seedDefects()
      await this.seedEnvironments()
      await this.seedTestData()
      await this.seedQualityGateDefs()
      await this.seedQualityGateResults()
      await this.seedGovernanceProcedures()
      await this.seedComplianceRecords()
      await this.seedApprovals()
      await this.seedWaivers()
      await this.seedEvidence()
      await this.seedIntegrations()
      await this.seedNotifications()
      await this.seedAIRecommendations()
      await this.seedDemands()
      await this.seedSchedules()
      await this.seedPostDeploymentEvents()
      await this.seedAuditLog()
      await this.seedUsageEvents()
      await this.seedFeatureFlags()
      
      this.seeded = true
    } catch (error) {
      console.error('Seeding failed:', error)
      throw error
    }
  }

  private seedRoles(): Promise<void> {
    return this.saveCollection('roles', [
      {
        id: 'ROL-guest',
        name: 'Guest',
        description: 'Can only view public content.',
        permissions: ['READ'],
        createdAt: SEED_ANCHOR_DATE.toISOString(),
        updatedAt: SEED_ANCHOR_DATE.toISOString(),
        archived: false
      },
      {
        id: 'ROL-admin',
        name: 'Administrator',
        description: 'Full access to all features.',
        permissions: ['READ', 'WRITE', 'DELETE', 'EXECUTE', 'ADMIN', 'EXPORT', 'IMPORT', 'CONFIGURE', 'MANAGE_USERS', 'MANAGE_SETTINGS'],
        createdAt: SEED_ANCHOR_DATE.toISOString(),
        updatedAt: SEED_ANCHOR_DATE.toISOString(),
        archived: false
      }
    ])
  }

  private seedUsers(): Promise<void> {
    return this.saveCollection('users', [
      {
        id: 'USR-00000000-0000-0000-0000-000000000001',
        username: 'exec-leader',
        email: 'exec@kp-etsip.demo',
        firstName: 'Executive',
        lastName: 'Leader',
        accessLevel: 8,
        permissions: ['READ', 'EXPORT'],
        createdAt: SEED_ANCHOR_DATE.toISOString(),
        updatedAt: SEED_ANCHOR_DATE.toISOString(),
        archived: false
      }
    ])
  }

  private seedPortfolios(): Promise<void> {
    return this.saveCollection('portfolios', [])
  }

  private seedApplications(): Promise<void> {
    return this.saveCollection('applications', [])
  }

  private seedReleases(): Promise<void> {
    return this.saveCollection('releases', [])
  }

  private seedTestSuites(): Promise<void> {
    return this.saveCollection('testSuites', [])
  }

  private seedTestCases(): Promise<void> {
    return this.saveCollection('testCases', [])
  }

  private seedTestExecutions(): Promise<void> {
    return this.saveCollection('testExecutions', [])
  }

  private seedDefects(): Promise<void> {
    return this.saveCollection('defects', [])
  }

  private seedEnvironments(): Promise<void> {
    return this.saveCollection('environments', [])
  }

  private seedTestData(): Promise<void> {
    return this.saveCollection('testData', [])
  }

  private seedQualityGateDefs(): Promise<void> {
    return this.saveCollection('qualityGateDefs', [])
  }

  private seedQualityGateResults(): Promise<void> {
    return this.saveCollection('qualityGateResults', [])
  }

  private seedGovernanceProcedures(): Promise<void> {
    return this.saveCollection('governanceProcedures', [])
  }

  private seedComplianceRecords(): Promise<void> {
    return this.saveCollection('complianceRecords', [])
  }

  private seedApprovals(): Promise<void> {
    return this.saveCollection('approvals', [])
  }

  private seedWaivers(): Promise<void> {
    return this.saveCollection('waivers', [])
  }

  private seedEvidence(): Promise<void> {
    return this.saveCollection('evidence', [])
  }

  private seedIntegrations(): Promise<void> {
    return this.saveCollection('integrations', [])
  }

  private seedNotifications(): Promise<void> {
    return this.saveCollection('notifications', [])
  }

  private seedAIRecommendations(): Promise<void> {
    return this.saveCollection('aiRecommendations', [])
  }

  private seedDemands(): Promise<void> {
    return this.saveCollection('demands', [])
  }

  private seedSchedules(): Promise<void> {
    return this.saveCollection('schedules', [])
  }

  private seedPostDeploymentEvents(): Promise<void> {
    return this.saveCollection('postDeploymentEvents', [])
  }

  private seedAuditLog(): Promise<void> {
    return this.saveCollection('auditLog', [])
  }

  private seedUsageEvents(): Promise<void> {
    return this.saveCollection('usageEvents', [])
  }

  private seedFeatureFlags(): Promise<void> {
    return this.saveCollection('featureFlags', [])
  }

  private emitChangeEvent(name: string, data: any): void {
    Promise.resolve().then(() => {
      this.changeEventCallbacks.forEach(callback => callback(name, data))
    })
  }

  async exportAllData(): Promise<Blob> {
    const data: Record<string, any[]> = {}
    const keys = Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .map(key => key.substring(STORAGE_PREFIX.length))
    
    for (const key of keys) {
      data[key] = await this.getCollection(key)
    }
    
    return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  }

  async importData(jsonBlob: Blob): Promise<void> {
    const text = await jsonBlob.text()
    const data = JSON.parse(text)
    
    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value)) {
        await this.saveCollection(key, value)
      }
    }
  }

  async clearAllData(): Promise<void> {
    const keys = Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_PREFIX))
    
    for (const key of keys) {
      localStorage.removeItem(key)
    }
    
    this.seeded = false
    this.changeEventCallbacks = []
    this.validators = new Map()
  }

  async resetToDefaults(): Promise<void> {
    await this.clearAllData()
    await this.seedData()
  }
}

export const storageAdapter = new StorageAdapter()