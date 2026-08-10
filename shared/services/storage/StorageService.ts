import AsyncStorage from '@react-native-async-storage/async-storage';

// Only place AsyncStorage is imported; service-layer rule ensures mockability and swappability
export class StorageService {
  async get<TValue>(key: string): Promise<TValue | null> {
    const rawValue = await AsyncStorage.getItem(key);
    if (rawValue === null) {
      return null;
    }
    return JSON.parse(rawValue) as TValue;
  }

  async set<TValue>(key: string, value: TValue): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }

  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }
}
