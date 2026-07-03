/**
 * Transfers Module
 * Handles coin transfers and transactions
 */

import { TransfersUI } from './ui.js';
import { TransfersLogic } from './logic.js';
import { TransfersFirebase } from './firebase.js';

export class TransfersModule {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.ui = new TransfersUI();
    this.logic = new TransfersLogic();
    this.firebase = new TransfersFirebase();
  }

  async init() {
    await this.firebase.init();
    this.ui.render(document.getElementById('transfers-container'));
  }

  async sendCoins(recipientId, amount) {
    return this.logic.sendCoins(recipientId, amount);
  }
}
