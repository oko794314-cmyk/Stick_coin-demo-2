/**
 * Marketplace Module
 * Handles buying and selling items
 */

import { MarketplaceUI } from './ui.js';
import { MarketplaceLogic } from './logic.js';
import { MarketplaceFirebase } from './firebase.js';

export class MarketplaceModule {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.ui = new MarketplaceUI();
    this.logic = new MarketplaceLogic();
    this.firebase = new MarketplaceFirebase();
  }

  async init() {
    await this.firebase.init();
    const items = await this.logic.getMarketItems();
    this.ui.render(document.getElementById('marketplace-container'), items);
  }

  async buyItem(itemId, amount) {
    return this.logic.buyItem(itemId, amount);
  }

  async sellItem(itemId, price) {
    return this.logic.sellItem(itemId, price);
  }
}
