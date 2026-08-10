import { describe, it, expect } from '@jest/globals';

import { StorageService } from '@shared/services/storage';

describe('StorageService', () => {
  const storageService = new StorageService();

  it('stores and retrieves a JSON value', async () => {
    await storageService.set('demo_key', { value: 42 });
    const result = await storageService.get<{ value: number }>('demo_key');
    expect(result).toEqual({ value: 42 });
  });

  it('returns null for a missing key', async () => {
    const result = await storageService.get('missing_key');
    expect(result).toBeNull();
  });

  it('removes a stored value', async () => {
    await storageService.set('to_remove', 'present');
    await storageService.remove('to_remove');
    expect(await storageService.get('to_remove')).toBeNull();
  });
});
