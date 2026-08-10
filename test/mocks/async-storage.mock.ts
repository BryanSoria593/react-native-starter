// Mapped via jest.config.js moduleNameMapper
const memoryStore = new Map<string, string>();

const AsyncStorageMock = {
  getItem: async (key: string): Promise<string | null> =>
    memoryStore.has(key) ? (memoryStore.get(key) as string) : null,
  setItem: async (key: string, value: string): Promise<void> => {
    memoryStore.set(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    memoryStore.delete(key);
  },
  clear: async (): Promise<void> => {
    memoryStore.clear();
  },
};

export default AsyncStorageMock;
