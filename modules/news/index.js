/**
 * News Module
 * Handles cryptocurrency and market news
 */

import { NewsUI } from './ui.js';
import { NewsLogic } from './logic.js';
import { NewsFirebase } from './firebase.js';

export class NewsModule {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.ui = new NewsUI();
    this.logic = new NewsLogic();
    this.firebase = new NewsFirebase();
  }

  async init() {
    await this.firebase.init();
    const news = await this.logic.fetchNews();
    this.ui.render(document.getElementById('news-container'), news);
  }

  async getNews(category = 'all') {
    return this.logic.fetchNews(category);
  }
}
