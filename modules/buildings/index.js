/**
 * Buildings Module
 * Handles building/property management
 */

import { BuildingsUI } from './ui.js';
import { BuildingsLogic } from './logic.js';
import { BuildingsFirebase } from './firebase.js';

export class BuildingsModule {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.ui = new BuildingsUI();
    this.logic = new BuildingsLogic();
    this.firebase = new BuildingsFirebase();
  }

  async init() {
    await this.firebase.init();
    const buildings = await this.logic.getBuildings();
    this.ui.render(document.getElementById('buildings-container'), buildings);
  }

  async upgradeBuilding(buildingId) {
    return this.logic.upgradeBuilding(buildingId);
  }
}
