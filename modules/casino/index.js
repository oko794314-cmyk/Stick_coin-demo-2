/**
 * Casino Module
 * Handles casino/gaming operations
 */

import { CasinoUI } from './ui.js';
import { CasinoLogic } from './logic.js';
import { CasinoFirebase } from './firebase.js';

export class CasinoModule {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.ui = new CasinoUI();
    this.logic = new CasinoLogic();
    this.firebase = new CasinoFirebase();
  }

  async init() {
    await this.firebase.init();
    this.ui.render(document.getElementById('casino-container'));
  }

  async placeBet(game, amount, bet) {
    return this.logic.placeBet(game, amount, bet);
  }
}
