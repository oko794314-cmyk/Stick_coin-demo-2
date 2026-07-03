/**
 * Rankings Module
 * Handles leaderboards and rankings
 */

import { RankingsUI } from './ui.js';
import { RankingsLogic } from './logic.js';
import { RankingsFirebase } from './firebase.js';

export class RankingsModule {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.ui = new RankingsUI();
    this.logic = new RankingsLogic();
    this.firebase = new RankingsFirebase();
  }

  async init() {
    await this.firebase.init();
    const rankings = await this.logic.getRankings();
    this.ui.render(document.getElementById('rankings-container'), rankings);
  }
}
