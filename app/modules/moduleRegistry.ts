import type { ComponentType, LazyExoticComponent } from 'react';

export interface ModuleRootProps {
  onExit: () => void;
}

// Component can be lazy-loaded to defer parsing until first use
export interface ModuleDefinition {
  id: string;
  displayName: string;
  icon: string;
  component: ComponentType<ModuleRootProps> | LazyExoticComponent<ComponentType<ModuleRootProps>>;
  enabled: boolean;
}

const moduleRegistry = new Map<string, ModuleDefinition>();

export function registerModule(moduleDefinition: ModuleDefinition): void {
  if (moduleRegistry.has(moduleDefinition.id)) {
    throw new Error(`Module "${moduleDefinition.id}" is already registered.`);
  }
  moduleRegistry.set(moduleDefinition.id, moduleDefinition);
}

export function getEnabledModules(): ModuleDefinition[] {
  return Array.from(moduleRegistry.values()).filter((moduleDefinition) => moduleDefinition.enabled);
}

export function getModule(moduleId: string): ModuleDefinition | undefined {
  return moduleRegistry.get(moduleId);
}

export function clearModuleRegistry(): void {
  moduleRegistry.clear();
}
