import { activePersonaRepository } from '@/repositories/activePersonaRepository'
import { userRepository } from '@/repositories/userRepository'
import { roleRepository } from '@/repositories/roleRepository'
import { auditLogRepository } from '@/repositories/auditLogRepository'
import { AccessLevel, Permission } from '@/types/enums'
import type { User } from '@/types/entities'
import type { Role } from '@/types/entities'

class AccessControlService {
  private async getCurrentUser(): Promise<User | null> {
    const personaId = await activePersonaRepository.getActivePersona()
    if (!personaId) return null
    return userRepository.getById(personaId)
  }

  private async getUserRoles(userId: string): Promise<Role[]> {
    const user = await userRepository.getById(userId)
    if (!user) return []
    // Assuming user has roleIds property (not in current entity but expected per design)
    const roleIds = (user as any).roleIds || []
    const roles = await Promise.all(
      roleIds.map(id => roleRepository.getById(id))
    )
    return roles.filter((role): role is Role => role !== null)
  }

  async getCurrentPersona(): Promise<{
    id: string
    name: string
    email: string
    roleIds: string[]
    persona: string
    permissionLevel: number
  } | null> {
    const user = await this.getCurrentUser()
    if (!user) return null
    
    // Assuming user has persona and roleIds properties per design
    const roleIds = (user as any).roleIds || []
    const persona = (user as any).persona || `${user.firstName} ${user.lastName}`
    
    // Calculate permissionLevel as minimum access level from roles (1=highest)
    const roles = await this.getUserRoles(user.id)
    let permissionLevel = AccessLevel.Root // Start with highest numerical value
    for (const role of roles) {
      // Convert role permissions to access level approximation
      const roleAccessLevel = this.permissionsToAccessLevel(role.permissions)
      if (roleAccessLevel < permissionLevel) {
        permissionLevel = roleAccessLevel
      }
    }
    
    return {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      roleIds,
      persona,
      permissionLevel: permissionLevel as number
    }
  }

  async getCurrentAccessLevel(): Promise<AccessLevel> {
    const persona = await this.getCurrentPersona()
    return persona?.permissionLevel ?? AccessLevel.Guest
  }

  async switchPersona(personaId: string): Promise<void> {
    // Validate persona exists
    const user = await userRepository.getById(personaId)
    if (!user) {
      throw new Error(`Persona not found: ${personaId}`)
    }
    
    // Log audit entry
    const currentUser = await this.getCurrentUser()
    await auditLogRepository.create({
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actor: currentUser?.id ?? 'SYSTEM',
      action: 'switchPersona',
      targetType: 'user',
      targetId: personaId,
      timestamp: new Date().toISOString(),
      detail: JSON.stringify({
        from: currentUser?.id ?? 'unknown',
        to: personaId
      })
    })
    
    // Update active persona
    await activePersonaRepository.setActivePersona(personaId)
  }

  hasPermission = async (action: 
    | 'View' 
    | 'Create' 
    | 'Edit' 
    | 'Delete' 
    | 'Approve' 
    | 'Waive' 
    | 'Export' 
    | 'Configure' 
    | 'Execute' 
    | 'Administer'): Promise<boolean> => {
    const persona = await this.getCurrentPersona()
    if (!persona) return false
    
    // Map action to permission string
    const permissionMap: Record<string, Permission> = {
      View: Permission.Read,
      Create: Permission.Write,
      Edit: Permission.Write,
      Delete: Permission.Delete,
      Approve: Permission.Execute, // Map to Execute as closest match
      Waive: Permission.Execute,   // Map to Execute as closest match
      Export: Permission.Export,
      Configure: Permission.Configure,
      Execute: Permission.Execute,
      Administer: Permission.Admin
    }
    
    const permission = permissionMap[action]
    if (!permission) return false
    
    // Get user's roles and check if any role has the permission
    const user = await userRepository.getById(persona.id)
    if (!user) return false
    
    const roleIds = (user as any).roleIds || []
    const roles = await Promise.all(
      roleIds.map(id => roleRepository.getById(id))
    )
    
    return roles.some(role => 
      role !== null && 
      role.permissions.includes(permission as Permission)
    )
  }

  isNavSectionVisible = async (sectionId: 
    | 'executive' 
    | 'demands' 
    | 'portfolios' 
    | 'applications' 
    | 'releases' 
    | 'test' 
    | 'release' 
    | 'governance' 
    | 'administration' 
    | 'myProfile'): Promise<boolean> => {
    const persona = await this.getCurrentPersona()
    if (!persona) return false
    
    // Define section visibility rules based on access level
    const visibilityMap: Record<string, AccessLevel[]> = {
      executive: [AccessLevel.Administrator, AccessLevel.SuperAdministrator, AccessLevel.Root],
      demands: [AccessLevel.Viewer, AccessLevel.Reporter, AccessLevel.Contributor, AccessLevel.Editor, AccessLevel.Moderator, AccessLevel.Publisher, AccessLevel.Administrator, AccessLevel.SuperAdministrator, AccessLevel.Root],
      portfolios: [AccessLevel.Editor, AccessLevel.Moderator, AccessLevel.Publisher, AccessLevel.Administrator, AccessLevel.SuperAdministrator, AccessLevel.Root],
      applications: [AccessLevel.Editor, AccessLevel.Moderator, AccessLevel.Publisher, AccessLevel.Administrator, AccessLevel.SuperAdministrator, AccessLevel.Root],
      releases: [AccessLevel.Editor, AccessLevel.Moderator, AccessLevel.Publisher, AccessLevel.Administrator, AccessLevel.SuperAdministrator, AccessLevel.Root],
      test: [AccessLevel.Viewer, AccessLevel.Reporter, AccessLevel.Contributor, AccessLevel.Editor, AccessLevel.Moderator, AccessLevel.Publisher, AccessLevel.Administrator, AccessLevel.SuperAdministrator, AccessLevel.Root],
      release: [AccessLevel.Editor, AccessLevel.Moderator, AccessLevel.Publisher, AccessLevel.Administrator, AccessLevel.SuperAdministrator, AccessLevel.Root],
      governance: [AccessLevel.Moderator, AccessLevel.Publisher, AccessLevel.Administrator, AccessLevel.SuperAdministrator, AccessLevel.Root],
      administration: [AccessLevel.Administrator, AccessLevel.SuperAdministrator, AccessLevel.Root],
      myProfile: [AccessLevel.Guest, AccessLevel.Viewer, AccessLevel.Reporter, AccessLevel.Contributor, AccessLevel.Editor, AccessLevel.Moderator, AccessLevel.Publisher, AccessLevel.Administrator, AccessLevel.SuperAdministrator, AccessLevel.Root]
    }
    
    const allowedLevels = visibilityMap[sectionId] || []
    return allowedLevels.includes(persona.permissionLevel as AccessLevel)
  }

  isActionAvailable = async (actionId: 
    | 'create' 
    | 'edit' 
    | 'delete' 
    | 'approve' 
    | 'waive' 
    | 'export' 
    | 'configure' 
    | 'execute' 
    | 'administer'): Promise<boolean> => {
    // Map actionId to the same actions as hasPermission
    const actionMap: Record<string, 
      | 'View' 
      | 'Create' 
      | 'Edit' 
      | 'Delete' 
      | 'Approve' 
      | 'Waive' 
      | 'Export' 
      | 'Configure' 
      | 'Execute' 
      | 'Administer'> = {
      create: 'Create',
      edit: 'Edit',
      delete: 'Delete',
      approve: 'Approve',
      waive: 'Waive',
      export: 'Export',
      configure: 'Configure',
      execute: 'Execute',
      administer: 'Administer'
    }
    
    const action = actionMap[actionId]
    if (!action) return false
    return this.hasPermission(action as any)
  }

  async getDefaultLandingPage(): Promise<string> {
    const persona = await this.getCurrentPersona()
    if (!persona) return '/'
    
    // Define default landing pages by role/persona
    const landingPageMap: Record<string, string> = {
      'Executive Leadership': '/executive',
      'Portfolio Manager': '/portfolios',
      'Application Owner': '/applications',
      'Release Manager': '/releases',
      'Test Manager': '/test',
      'Release Engineer': '/release',
      'Governance Officer': '/governance',
      'Administrator': '/administration',
      'Guest': '/'
    }
    
    return landingPageMap[persona.persona] || '/'
  }

  async logAuditEntry(
    actor: string,
    action: string,
    targetType: string,
    targetId: string,
    detail?: string
  ): Promise<string> {
    // Validate actor matches current persona
    const currentUser = await this.getCurrentUser()
    if (currentUser?.id !== actor) {
      throw new Error('Actor must match current persona')
    }
    
    if (!action || !targetType || !targetId) {
      throw new Error('Action, targetType, and targetId are required')
    }
    
    const auditLogEntry = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actor,
      action,
      targetType,
      targetId,
      timestamp: new Date().toISOString(),
      detail: detail ?? undefined
    }
    
    await auditLogRepository.create(auditLogEntry)
    return auditLogEntry.id
  }
  
  // Helper to convert permissions to approximate access level (lower number = higher access)
  private permissionsToAccessLevel(permissions: Permission[]): AccessLevel {
    // Define permission weights (lower weight = higher access)
    const permissionWeights: Record<Permission, number> = {
      [Permission.Admin]: 1,
      [Permission.Execute]: 2,
      [Permission.Write]: 3,
      [Permission.Delete]: 4,
      [Permission.Read]: 5,
      [Permission.Export]: 6,
      [Permission.Import]: 7,
      [Permission.Configure]: 8,
      [Permission.ManageUsers]: 9,
      [Permission.ManageSettings]: 10
    }
    
    // Find minimum weight (highest access)
    let minWeight = 10
    for (const perm of permissions) {
      const weight = permissionWeights[perm]
      if (weight < minWeight) {
        minWeight = weight
      }
    }
    
    // Map weight to AccessLevel enum (1-10)
    // Note: This is an approximation since we don't have direct mapping
    return Math.min(minWeight, 10) as AccessLevel
  }
}

export const accessControlService = new AccessControlService()