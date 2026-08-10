// Metro's static analyzer requires import paths as inline literals for lazy chunk resolution
import React, { type ComponentType } from 'react';

import { getModule, registerModule, type ModuleRootProps } from './moduleRegistry';

interface ModuleRegistrationEntry {
  id: string;
  displayName: string;
  icon: string;
  enabled: boolean;
  load: () => Promise<{ default: ComponentType<ModuleRootProps> }>;
}

// Register additional feature modules here to make them discoverable via getEnabledModules()
const MODULE_REGISTRATIONS: ModuleRegistrationEntry[] = [];

for (const moduleRegistration of MODULE_REGISTRATIONS) {
  if (!getModule(moduleRegistration.id)) {
    registerModule({
      id: moduleRegistration.id,
      displayName: moduleRegistration.displayName,
      icon: moduleRegistration.icon,
      enabled: moduleRegistration.enabled,
      component: React.lazy(moduleRegistration.load),
    });
  }
}
