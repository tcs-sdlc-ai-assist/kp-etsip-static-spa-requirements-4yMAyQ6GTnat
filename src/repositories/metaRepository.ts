import { storageAdapter } from '@/storage/storageAdapter'

type SeedSize = 'Small' | 'Standard' | 'Large'

interface Meta {
  schemaVersion: number
  seedVersion: string
  seedAnchorDate: string
  seedSize: SeedSize
  prngSeed: number
  installedAt: string
}

class MetaRepository {
  async getMeta(): Promise<Meta | null> {
    const metas = await storageAdapter.getCollection<Meta>('meta')
    return metas.length > 0 ? metas[0] : null
  }

  async saveMeta(meta: Meta): Promise<void> {
    await storageAdapter.saveCollection('meta', [meta])
  }
}

export const metaRepository = new MetaRepository()