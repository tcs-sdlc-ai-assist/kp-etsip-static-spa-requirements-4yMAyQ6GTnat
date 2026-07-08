import { storageAdapter } from '@/storage/storageAdapter'

interface ActivePersona {
  personaId: string
}

class ActivePersonaRepository {
  async getActivePersona(): Promise<string | null> {
    const personas = await storageAdapter.getCollection<ActivePersona>('activePersona')
    return personas.length > 0 ? personas[0].personaId : null
  }

  async setActivePersona(personaId: string): Promise<void> {
    await storageAdapter.saveCollection('activePersona', [{ personaId }])
  }
}

export const activePersonaRepository = new ActivePersonaRepository()