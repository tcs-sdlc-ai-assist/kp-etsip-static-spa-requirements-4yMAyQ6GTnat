export type Listener<T> = (payload: T) => void;

interface EventBus {
  on: <T>(eventType: string | symbol, listener: Listener<T>) => () => void;
  off: <T>(eventType: string | symbol, listener: Listener<T>) => void;
  emit: <T>(eventType: string | symbol, payload: T) => void;
}

function createEventBus(): EventBus {
  const listeners = new Map<string | symbol, Set<Function>>();

  return {
    on(eventType, listener) {
      if (!listeners.has(eventType)) {
        listeners.set(eventType, new Set());
      }
      const set = listeners.get(eventType)!;
      set.add(listener as unknown as Function);
      return () => this.off(eventType, listener);
    },
    off(eventType, listener) {
      const set = listeners.get(eventType);
      if (set) {
        set.delete(listener as unknown as Function);
        if (set.size === 0) {
          listeners.delete(eventType);
        }
      }
    },
    emit(eventType, payload) {
      const set = listeners.get(eventType);
      if (set) {
        set.forEach(listener => {
          (listener as Listener<unknown>)(payload);
        });
      }
    }
  };
}

export const eventBus = createEventBus();