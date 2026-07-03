/**
 * Mining Module
 * Handles cryptocurrency mining operations
 */

import { MiningUI } from './ui.js';
import { MiningLogic } from './logic.js';
import { MiningFirebase } from './firebase.js';

export class MiningModule {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.ui = new MiningUI();
    this.logic = new MiningLogic();
    this.firebase = new MiningFirebase();
  }

  async init() {
    await this.firebase.init();
    this.ui.render(document.getElementById('mining-container'));
  }

  async startMining() {
    return this.logic.startMining();
  }

  async stopMining() {
    return this.logic.stopMining();
  }
}
