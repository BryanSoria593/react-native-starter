import { StorageService } from './storage';

export const services = {
  storage: new StorageService(),
} as const;
