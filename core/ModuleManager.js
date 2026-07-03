/**
 * Module Manager
 * Handles loading and initialization of all modules
 */

export class ModuleManager {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.modules = {};
  }

  registerModule(name, ModuleClass) {
    this.modules[name] = new ModuleClass(this.stateManager);
  }

  async initializeModule(name) {
    if (this.modules[name]) {
      await this.modules[name].init();
    } else {
      console.error(`Module ${name} not found`);
    }
  }

  async initializeAll() {
    for (const [name, module] of Object.entries(this.modules)) {
      await this.initializeModule(name);
    }
  }

  getModule(name) {
    return this.modules[name];
  }
}
