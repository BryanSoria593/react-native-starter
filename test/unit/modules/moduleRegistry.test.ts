import { describe, it, expect, beforeEach } from '@jest/globals';

import {
  clearModuleRegistry,
  getEnabledModules,
  getModule,
  registerModule,
  type ModuleDefinition,
} from '@app/modules/moduleRegistry';

function buildModuleDefinition(overrides: Partial<ModuleDefinition> = {}): ModuleDefinition {
  return {
    id: 'test-module',
    displayName: 'Test',
    icon: 'cube-outline',
    enabled: true,
    component: () => null,
    ...overrides,
  };
}

describe('moduleRegistry', () => {
  beforeEach(() => {
    clearModuleRegistry();
  });

  it('registers and retrieves a module by id', () => {
    registerModule(buildModuleDefinition());
    expect(getModule('test-module')?.displayName).toBe('Test');
  });

  it('lists only enabled modules', () => {
    registerModule(buildModuleDefinition({ id: 'enabled-one', enabled: true }));
    registerModule(buildModuleDefinition({ id: 'disabled-one', enabled: false }));

    expect(getEnabledModules().map((moduleDefinition) => moduleDefinition.id)).toEqual([
      'enabled-one',
    ]);
  });

  it('throws when the same id is registered twice', () => {
    registerModule(buildModuleDefinition());
    expect(() => registerModule(buildModuleDefinition())).toThrow();
  });
});
