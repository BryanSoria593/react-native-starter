import { createJSONStorage } from 'zustand/middleware';

import { services } from '@shared/services';

// Double stringify/parse bridge: services.storage handles JSON, zustand also expects strings
export const zustandStorageAdapter = createJSONStorage(() => ({
  getItem: async (key: string) => {
    const value = await services.storage.get(key);
    return value === null ? null : JSON.stringify(value);
  },
  setItem: async (key: string, value: string) => {
    try {
      const parsedValue: unknown = JSON.parse(value);
      await services.storage.set(key, parsedValue);
    } catch {
      await services.storage.set(key, value);
    }
  },
  removeItem: async (key: string) => {
    await services.storage.remove(key);
  },
}));
