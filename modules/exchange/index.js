/**
 * Exchange Module
 * Handles cryptocurrency exchange operations
 */

import { ExchangeUI } from './ui.js';
import { ExchangeLogic } from './logic.js';
import { ExchangeFirebase } from './firebase.js';

export class ExchangeModule {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.ui = new ExchangeUI();
    this.logic = new ExchangeLogic();
    this.firebase = new ExchangeFirebase();
  }

  async init() {
    await this.firebase.init();
    this.ui.render(document.getElementById('exchange-container'));
  }

  getExchangeRates() {
    return this.logic.getExchangeRates();
  }

  async executeExchange(from, to, amount) {
    return this.logic.executeExchange(from, to, amount);
  }
}
