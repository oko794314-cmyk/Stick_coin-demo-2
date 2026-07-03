/**
 * Workshop Module
 * Handles crafting and item creation
 */

import { WorkshopUI } from './ui.js';
import { WorkshopLogic } from './logic.js';
import { WorkshopFirebase } from './firebase.js';

export class WorkshopModule {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.ui = new WorkshopUI();
    this.logic = new WorkshopLogic();
    this.firebase = new WorkshopFirebase();
  }

  async init() {
    await this.firebase.init();
    this.ui.render(document.getElementById('workshop-container'));
  }

  async craftItem(itemId) {
    return this.logic.craftItem(itemId);
  }
}
