/**
 * Economy Module
 * Handles economic system and inflation
 */

import { EconomyUI } from './ui.js';
import { EconomyLogic } from './logic.js';
import { EconomyFirebase } from './firebase.js';

export class EconomyModule {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.ui = new EconomyUI();
    this.logic = new EconomyLogic();
    this.firebase = new EconomyFirebase();
  }

  async init() {
    await this.firebase.init();
    const stats = await this.logic.getEconomyStats();
    this.ui.render(document.getElementById('economy-container'), stats);
  }
}
